export type Role = 'student' | 'trainer' | 'admin' | 'super_admin';

export interface Profile {
  id: string; full_name: string; role: Role; mobile?: string | null;
  email?: string | null; avatar_url?: string | null;
}

export interface Student {
  id: string; profile_id: string; student_id: string;
  course_id?: string | null; batch_id?: string | null;
  admission_date: string; guardian_name?: string | null; address?: string | null;
  current_week: number; status: 'active' | 'inactive';
  profiles?: Profile; batches?: Batch;
}

export interface Batch { id: string; name: string; course_id: string; trainer_id?: string | null; start_date: string; end_date?: string | null; schedule?: string | null; classroom?: string | null; status: 'upcoming' | 'active' | 'completed' | 'cancelled'; }

export interface Course { id: string; code: string; title: string; tagline?: string | null; description?: string | null; duration_weeks: number; }

export interface Module { id: string; course_id: string; module_number: number; title: string; weeks_start: number; weeks_end: number; }

export interface Week {
  id: string; course_id: string; module_id: string; week_number: number; title: string;
  topics: string[]; objectives: string[]; activities: string[]; applications: string[];
  illustration_url?: string | null; video_url?: string | null; resources: string[]; is_published: boolean;
  modules?: Module;
}

export interface Workbook { id: string; week_id: string; title: string; explanation?: string | null; topics: string[]; examples: string[]; practice: string[]; self_check: string[]; is_published: boolean; weeks?: Week; }

export interface Assignment { id: string; week_id: string; title: string; description?: string | null; due_date?: string | null; max_score: number; weeks?: Week; }

export interface Submission { id: string; assignment_id: string; student_id: string; content?: string | null; file_url?: string | null; status: 'submitted' | 'graded' | 'returned'; score?: number | null; feedback?: string | null; submitted_at: string; assignments?: Assignment; }

export interface AttendanceRow { id: string; batch_id: string; student_id: string; date: string; status: 'present' | 'absent' | 'late'; }

export interface Assessment { id: string; batch_id?: string | null; week_id?: string | null; type: 'pre' | 'weekly' | 'mid_course' | 'practical' | 'final' | 'capstone'; title: string; held_on?: string | null; max_score: number; weeks?: Week; }

export interface ResultRow { id: string; assessment_id: string; student_id: string; score: number; percentage: number; passed: boolean; feedback?: string | null; is_published: boolean; assessments?: Assessment; }

export interface Portfolio { id: string; student_id: string; status: 'in_progress' | 'submitted' | 'completed'; completed_at?: string | null; }

export interface Project { id: string; portfolio_id: string; name: string; description?: string | null; skills: string[]; files: string[]; images: string[]; links: string[]; trainer_feedback?: string | null; approval: 'pending' | 'approved' | 'rejected'; }

export interface Certificate { id: string; certificate_number: string; student_id: string; course_id: string; batch_id?: string | null; issue_date: string; status: 'draft' | 'issued' | 'revoked'; courses?: Course; }

export interface Announcement { id: string; title: string; body: string; audience: string; is_published: boolean; published_at?: string | null; }

export interface GalleryItem { id: string; category: string; title: string; image_url: string; sort_order: number; }

export interface Admission { id: string; name: string; mobile: string; email?: string | null; location?: string | null; course_interest?: string | null; status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'enrolled'; notes?: string | null; applied_at: string; }

export interface Enquiry { id: string; name: string; mobile: string; email?: string | null; location?: string | null; course_interest?: string | null; message?: string | null; status: string; notes?: string | null; created_at: string; }

export interface SupportTicket { id: string; student_id: string; subject: string; category?: string | null; description?: string | null; status: 'open' | 'in_progress' | 'resolved' | 'closed'; created_at: string; }

export interface Trainer { id: string; profile_id: string; skills: string[]; status: 'active' | 'inactive'; profiles?: Profile; }
