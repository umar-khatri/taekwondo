export type Belt =
  | "white"
  | "yellow"
  | "green"
  | "blue"
  | "red"
  | "black";

export interface Student {
  id: string;
  name: string;
  phone: string;
  date_joined: string;
  belt: Belt;
  emergency_contact: string;
  notes: string;
  is_active: boolean;
  created_at: string;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  date: string;
  status: "present" | "absent";
  created_at: string;
}

export interface TrialRequest {
  id: string;
  name: string;
  phone: string;
  age: number | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  user_id?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  event_date: string;
  created_at: string;
  updated_at: string;
}

export interface FeePayment {
  id: string;
  student_id: string;
  month: string;
  paid_date: string;
  created_at: string;
}

export const BELT_COLORS: Record<Belt, { bg: string; text: string; label: string }> = {
  white: { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-800 dark:text-gray-200", label: "White" },
  yellow: { bg: "bg-yellow-100 dark:bg-yellow-900/40", text: "text-yellow-800 dark:text-yellow-200", label: "Yellow" },
  green: { bg: "bg-green-100 dark:bg-green-900/40", text: "text-green-800 dark:text-green-200", label: "Green" },
  blue: { bg: "bg-blue-100 dark:bg-blue-900/40", text: "text-blue-800 dark:text-blue-200", label: "Blue" },
  red: { bg: "bg-red-100 dark:bg-red-900/40", text: "text-red-800 dark:text-red-200", label: "Red" },
  black: { bg: "bg-zinc-900 dark:bg-zinc-100", text: "text-white dark:text-zinc-900", label: "Black" },
};

export const ACADEMY_INFO = {
  name: "Master Farooq's Club",
  tagline: "Discipline. Respect. Excellence.",
  description:
    "Master Farooq's Club is a premier Taekwondo academy dedicated to building character, discipline, and physical fitness through the art of Taekwondo. Our experienced instructors provide personalized training for all ages and skill levels.",
  instructor: {
    name: "Master Farooq",
    title: "Head Instructor",
    bio: "5th Dan Black Belt with over 15 years of teaching experience. Certified by the World Taekwondo Federation.",
  },
  schedule: {
    days: "Monday, Wednesday, Friday",
    time: "9:30 AM – 10:30 AM",
  },
  address: "Jaffrey Sports Club, J B Shah Marg, Masjid Bunder, Mumbai - 400009 (Chinch Bunder Playground, Dongri)",
  phone: "+971 50 123 4567",
  email: "info@masterfarooqs.club",
  mapQuery: "Jaffrey Sports Club, J B Shah Marg, Masjid Bunder, Mumbai",
};
