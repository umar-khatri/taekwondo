-- Taekwondo Academy Database Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================
-- STUDENTS TABLE
-- ============================================
create table if not exists students (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text not null,
  date_joined date not null default current_date,
  belt text not null default 'white' check (belt in ('white', 'yellow', 'green', 'blue', 'red', 'black')),
  emergency_contact text default '',
  notes text default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================
-- ATTENDANCE TABLE
-- ============================================
create table if not exists attendance (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null references students(id) on delete cascade,
  date date not null,
  status text not null check (status in ('present', 'absent')),
  created_at timestamptz not null default now(),
  unique(student_id, date)
);

-- ============================================
-- TRIAL REQUESTS TABLE
-- ============================================
create table if not exists trial_requests (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text not null,
  age integer,
  status text not null default 'new' check (status in ('new', 'contacted')),
  created_at timestamptz not null default now()
);

-- ============================================
-- ANNOUNCEMENTS TABLE
-- ============================================
create table if not exists announcements (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- INDEXES
-- ============================================
create index if not exists idx_attendance_student_id on attendance(student_id);
create index if not exists idx_attendance_date on attendance(date);
create index if not exists idx_students_is_active on students(is_active);
create index if not exists idx_trial_requests_status on trial_requests(status);

-- ============================================
-- ROW LEVEL SECURITY (Public access for now)
-- ============================================
alter table students enable row level security;
alter table attendance enable row level security;
alter table trial_requests enable row level security;
alter table announcements enable row level security;

-- Allow full access with anon key (single-user app, no auth needed)
create policy "Allow all access to students" on students for all using (true) with check (true);
create policy "Allow all access to attendance" on attendance for all using (true) with check (true);
create policy "Allow all access to trial_requests" on trial_requests for all using (true) with check (true);
create policy "Allow all access to announcements" on announcements for all using (true) with check (true);

-- ============================================
-- FEE PAYMENTS TABLE
-- ============================================
create table if not exists fee_payments (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null references students(id) on delete cascade,
  month text not null, -- Format: 'YYYY-MM'
  paid_date date not null default current_date,
  created_at timestamptz not null default now(),
  unique(student_id, month)
);

create index if not exists idx_fee_payments_student_id on fee_payments(student_id);
create index if not exists idx_fee_payments_month on fee_payments(month);

alter table fee_payments enable row level security;
create policy "Allow all access to fee_payments" on fee_payments for all using (true) with check (true);

-- ============================================
-- USER ROLES & RLS
-- ============================================
create table if not exists public.user_roles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'user')),
  created_at timestamptz not null default now(),
  unique(user_id)
);

alter table public.user_roles enable row level security;

create policy "Users can read their own role" on public.user_roles 
  for select using (auth.uid() = user_id);

alter table public.trial_requests add column if not exists user_id uuid references auth.users(id);

alter table public.trial_requests drop constraint if exists trial_requests_status_check;
alter table public.trial_requests add constraint trial_requests_status_check 
  check (status in ('new', 'contacted', 'pending', 'approved', 'rejected'));

drop policy if exists "Allow all access to students" on public.students;
drop policy if exists "Allow all access to attendance" on public.attendance;
drop policy if exists "Allow all access to trial_requests" on public.trial_requests;
drop policy if exists "Allow all access to announcements" on public.announcements;
drop policy if exists "Allow all access to fee_payments" on public.fee_payments;

create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  );
$$ language sql security definer;

create policy "Admins can do everything on students" on public.students for all using (is_admin());
create policy "Admins can do everything on attendance" on public.attendance for all using (is_admin());
create policy "Admins can do everything on announcements" on public.announcements for all using (is_admin());
create policy "Admins can do everything on fee_payments" on public.fee_payments for all using (is_admin());
create policy "Admins can do everything on trial_requests" on public.trial_requests for all using (is_admin());

create policy "Anyone can read announcements" on public.announcements for select using (true);

create policy "Users can read own trial requests" on public.trial_requests 
  for select using (auth.uid() = user_id);

create policy "Users can insert own trial requests" on public.trial_requests 
  for insert with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_roles (user_id, role)
  values (new.id, 'user');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
