-- Seed data for Taekwondo Academy

-- Clear existing data if any (optional, but good for a fresh seed)
TRUNCATE students CASCADE;
TRUNCATE trial_requests CASCADE;
TRUNCATE announcements CASCADE;

-- Insert Students
INSERT INTO students (name, phone, date_joined, belt, emergency_contact, notes, is_active) VALUES
('John Doe', '+971 50 111 2222', current_date - interval '3 months', 'yellow', 'Jane Doe (+971 50 111 2223)', 'Great potential', true),
('Sarah Smith', '+971 55 222 3333', current_date - interval '1 year', 'blue', 'Michael Smith (+971 55 222 3334)', '', true),
('Ahmed Khan', '+971 52 333 4444', current_date - interval '2 years', 'red', '', 'Preparing for black belt test', true),
('Emily Chen', '+971 58 444 5555', current_date - interval '1 month', 'white', '', 'Needs to work on flexibility', true),
('Omar Ali', '+971 56 555 6666', current_date - interval '5 years', 'black', '', 'Assistant instructor', true),
('Lisa Wong', '+971 50 666 7777', current_date - interval '6 months', 'green', '', '', true),
('Mark Johnson', '+971 55 777 8888', current_date - interval '8 months', 'yellow', '', 'Has a knee injury, be careful', true),
('Aisha Rahman', '+971 52 888 9999', current_date - interval '2 months', 'white', '', '', false);

-- Insert Announcements
INSERT INTO announcements (title, content, created_at, updated_at) VALUES
('Summer Camp Registration Open', 'Join our intensive summer camp starting next month. Special discounts for early birds! Classes will be held 5 days a week.', current_timestamp - interval '2 days', current_timestamp - interval '2 days'),
('Belt Grading Test Next Weekend', 'All eligible students should prepare for the belt grading test on Saturday at 10:00 AM. Ensure your uniform is clean and arrive 15 minutes early.', current_timestamp - interval '5 days', current_timestamp - interval '5 days'),
('Holiday Closure Notice', 'The academy will be closed on Friday for the national holiday. Normal classes resume on Monday. Enjoy the long weekend!', current_timestamp - interval '10 days', current_timestamp - interval '10 days');

-- Insert Trial Requests
INSERT INTO trial_requests (name, phone, age, status, created_at) VALUES
('David Brown', '+971 50 123 1234', 12, 'new', current_timestamp - interval '1 hour'),
('Hassan Mahmood', '+971 55 234 2345', 8, 'new', current_timestamp - interval '3 hours'),
('Priya Patel', '+971 52 345 3456', 25, 'contacted', current_timestamp - interval '1 day'),
('Tom Wilson', '+971 58 456 4567', null, 'contacted', current_timestamp - interval '2 days');

-- Insert Attendance
DO $$
DECLARE
    student_rec record;
BEGIN
    FOR student_rec IN SELECT id FROM students WHERE is_active = true LOOP
        -- 2 days ago
        INSERT INTO attendance (student_id, date, status) 
        VALUES (student_rec.id, current_date - 2, CASE WHEN random() > 0.2 THEN 'present' ELSE 'absent' END);
        
        -- 4 days ago
        INSERT INTO attendance (student_id, date, status) 
        VALUES (student_rec.id, current_date - 4, CASE WHEN random() > 0.3 THEN 'present' ELSE 'absent' END);
        
        -- 7 days ago
        INSERT INTO attendance (student_id, date, status) 
        VALUES (student_rec.id, current_date - 7, CASE WHEN random() > 0.1 THEN 'present' ELSE 'absent' END);
    END LOOP;
END $$;
