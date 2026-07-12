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
