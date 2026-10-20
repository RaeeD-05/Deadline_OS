export type DeadlineSource = 'Google Classroom' | 'Email' | 'WhatsApp' | 'Portal' | 'PDF';
export type RiskScore = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  college_name: string;
  semester: string;
  created_at: string;
}

export interface Deadline {
  id: string;
  user_id: string;
  title: string;
  course_name: string;
  source: DeadlineSource;
  due_date: string; // ISO string e.g. "2026-10-22T23:59:00Z"
  risk_score: RiskScore;
  status: TaskStatus;
  estimated_hours: number;
  description: string;
  tags?: string[];
  created_at: string;
}

export interface DailyActionItem {
  id: string;
  user_id: string;
  task_id: string;
  scheduled_time_start: string; // "18:00"
  scheduled_time_end: string;   // "19:30"
  date: string; // "2026-10-20"
  is_completed: boolean;
  notes?: string;
  task?: Deadline; // Populated for joined queries
}

export interface ConflictCluster {
  id: string;
  title: string;
  severity: 'Critical' | 'Warning' | 'Manageable';
  deadline_ids: string[];
  deadlines: Deadline[];
  timeframe_hours: number;
  total_required_hours: number;
  hours_until_first_due: number;
  recommendation: string;
}

export interface RescuePlan {
  activated_at: string;
  summary: string;
  focus_capacity_hours: number;
  triaged_tasks: {
    deadline: Deadline;
    urgency_tier: 'Immediate (Do Now)' | 'Secondary (Do Next)' | 'Defer / Request Extension';
    recommended_focus_hours: number;
    action_note: string;
  }[];
  emergency_schedule: {
    time_start: string;
    time_end: string;
    task_id: string;
    task_title: string;
    course_name: string;
    focus_objective: string;
  }[];
}
