import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { User, Deadline, DailyActionItem, ConflictCluster, RescuePlan } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

interface DatabaseSchema {
  users: User[];
  deadlines: Deadline[];
  daily_action_plan: DailyActionItem[];
}

function ensureDbFile(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData = getInitialSeedData();
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }

  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    const initialData = getInitialSeedData();
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
}

function saveDb(data: DatabaseSchema) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function getInitialSeedData(): DatabaseSchema {
  const salt = bcrypt.genSaltSync(10);
  const demoHashedPassword = bcrypt.hashSync('password123', salt);

  const demoUserId = 'usr_alex_chen_01';
  const now = new Date();
  
  // Calculate relative due dates
  const due28h = new Date(now.getTime() + 28 * 60 * 60 * 1000).toISOString();
  const due36h = new Date(now.getTime() + 36 * 60 * 60 * 1000).toISOString();
  const due60h = new Date(now.getTime() + 60 * 60 * 60 * 1000).toISOString();
  const due4d = new Date(now.getTime() + 96 * 60 * 60 * 1000).toISOString();
  const due6d = new Date(now.getTime() + 144 * 60 * 60 * 1000).toISOString();

  const users: User[] = [
    {
      id: demoUserId,
      name: 'Alex Chen',
      email: 'alex.chen@mit.edu',
      password_hash: demoHashedPassword,
      college_name: 'MIT School of Engineering',
      semester: 'Semester 6 - Spring 2026',
      created_at: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const deadlines: Deadline[] = [
    {
      id: 'task_001_raft',
      user_id: demoUserId,
      title: 'Lab 3: Raft Consensus Protocol & Leader Election',
      course_name: 'CS451: Distributed Systems',
      source: 'Google Classroom',
      due_date: due28h,
      risk_score: 'High',
      status: 'In Progress',
      estimated_hours: 6.5,
      description: 'Implement Section 5.2 of Raft paper: Election timers, RequestVote RPC handlers, and heartbeat logic. Must pass 2A test suite with zero deadlocks.',
      tags: ['Systems', 'Coding', 'High Cognitive Load'],
      created_at: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'task_002_dbms',
      user_id: demoUserId,
      title: 'Group Case Study: Sharding vs Distributed Two-Phase Commit',
      course_name: 'CS320: Database Management Systems',
      source: 'WhatsApp',
      due_date: due36h,
      risk_score: 'High',
      status: 'Pending',
      estimated_hours: 4.0,
      description: 'Extracted from "CS320 Project Squad" WhatsApp group chat. Professor posted update: Submission must include latency bench graphs and fault-tolerance tradeoffs.',
      tags: ['Architecture', 'Team Project', 'Clash Candidate'],
      created_at: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'task_003_ml',
      user_id: demoUserId,
      title: 'Take-Home Project: Fine-Tuning Multi-Head Attention',
      course_name: 'AI502: Advanced Deep Learning',
      source: 'Email',
      due_date: due60h,
      risk_score: 'Medium',
      status: 'Pending',
      estimated_hours: 7.0,
      description: 'Received via prof.lecun@university.edu. Implement FlashAttention kernel comparison and submit training loss curves on CIFAR-100.',
      tags: ['PyTorch', 'Research', 'GPU Compute'],
      created_at: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'task_004_cn',
      user_id: demoUserId,
      title: 'Wireshark Packet Analysis 4: TCP Congestion Control Simulation',
      course_name: 'CS312: Computer Networks',
      source: 'Portal',
      due_date: due4d,
      risk_score: 'Low',
      status: 'Pending',
      estimated_hours: 2.5,
      description: 'Campus Portal Assignment drop-box. Inspect PCAP trace of TCP Reno slow-start vs CUBIC fast recovery.',
      tags: ['Wireshark', 'Analysis'],
      created_at: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'task_005_ethics',
      user_id: demoUserId,
      title: 'Ethical Implications of Autonomous Vehicle Decision Algorithms',
      course_name: 'HASS220: Tech & Society',
      source: 'PDF',
      due_date: due6d,
      risk_score: 'Low',
      status: 'Pending',
      estimated_hours: 3.0,
      description: 'Parsed from course syllabus PDF page 14: 1500-word critical essay comparing utilitarian vs deontological decision trees in automotive safety.',
      tags: ['Essay', 'Reading'],
      created_at: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const todayStr = now.toISOString().slice(0, 10);

  const daily_action_plan: DailyActionItem[] = [
    {
      id: 'action_001',
      user_id: demoUserId,
      task_id: 'task_001_raft',
      scheduled_time_start: '17:30',
      scheduled_time_end: '19:15',
      date: todayStr,
      is_completed: true,
      notes: 'Pass tests 2A: TestInitialElection & TestReElection completed!',
    },
    {
      id: 'action_002',
      user_id: demoUserId,
      task_id: 'task_001_raft',
      scheduled_time_start: '19:45',
      scheduled_time_end: '21:15',
      date: todayStr,
      is_completed: false,
      notes: 'Work on candidate split vote randomized backoff logic.',
    },
    {
      id: 'action_003',
      user_id: demoUserId,
      task_id: 'task_002_dbms',
      scheduled_time_start: '21:30',
      scheduled_time_end: '23:00',
      date: todayStr,
      is_completed: false,
      notes: 'Coordinate with project group on Google Docs & finish sharding diagram.',
    },
  ];

  return { users, deadlines, daily_action_plan };
}

// Database Operations
export const db = {
  // USERS
  findUserByEmail(email: string): User | undefined {
    const data = ensureDbFile();
    return data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },

  findUserById(id: string): User | undefined {
    const data = ensureDbFile();
    return data.users.find((u) => u.id === id);
  },

  createUser(user: Omit<User, 'id' | 'created_at'>): User {
    const data = ensureDbFile();
    const newUser: User = {
      ...user,
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      created_at: new Date().toISOString(),
    };
    data.users.push(newUser);
    saveDb(data);
    return newUser;
  },

  // DEADLINES
  getDeadlines(userId: string, filters?: { source?: string; status?: string; risk?: string }): Deadline[] {
    const data = ensureDbFile();
    let list = data.deadlines.filter((d) => d.user_id === userId);

    if (filters?.source && filters.source !== 'All') {
      list = list.filter((d) => d.source.toLowerCase() === filters.source!.toLowerCase());
    }
    if (filters?.status && filters.status !== 'All') {
      list = list.filter((d) => d.status.toLowerCase() === filters.status!.toLowerCase());
    }
    if (filters?.risk && filters.risk !== 'All') {
      list = list.filter((d) => d.risk_score.toLowerCase() === filters.risk!.toLowerCase());
    }

    // Sort by due date ascending
    return list.sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
  },

  getDeadlineById(id: string): Deadline | undefined {
    const data = ensureDbFile();
    return data.deadlines.find((d) => d.id === id);
  },

  createDeadline(deadline: Omit<Deadline, 'id' | 'created_at'>): Deadline {
    const data = ensureDbFile();
    const newDeadline: Deadline = {
      ...deadline,
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString(),
    };
    data.deadlines.push(newDeadline);
    saveDb(data);
    return newDeadline;
  },

  updateDeadline(id: string, updates: Partial<Deadline>): Deadline | null {
    const data = ensureDbFile();
    const idx = data.deadlines.findIndex((d) => d.id === id);
    if (idx === -1) return null;

    data.deadlines[idx] = { ...data.deadlines[idx], ...updates };
    saveDb(data);
    return data.deadlines[idx];
  },

  deleteDeadline(id: string): boolean {
    const data = ensureDbFile();
    const initialLen = data.deadlines.length;
    data.deadlines = data.deadlines.filter((d) => d.id !== id);
    // Cascade delete any daily action items referencing this deadline
    data.daily_action_plan = data.daily_action_plan.filter((item) => item.task_id !== id);
    if (data.deadlines.length < initialLen) {
      saveDb(data);
      return true;
    }
    return false;
  },

  // DAILY ACTION PLAN
  getActionPlan(userId: string, date: string): DailyActionItem[] {
    const data = ensureDbFile();
    const items = data.daily_action_plan.filter((item) => item.user_id === userId && item.date === date);

    // Join with Deadline information
    return items.map((item) => {
      const task = data.deadlines.find((d) => d.id === item.task_id);
      return { ...item, task };
    }).sort((a, b) => a.scheduled_time_start.localeCompare(b.scheduled_time_start));
  },

  createActionItem(item: Omit<DailyActionItem, 'id'>): DailyActionItem {
    const data = ensureDbFile();
    const newItem: DailyActionItem = {
      ...item,
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    data.daily_action_plan.push(newItem);
    saveDb(data);

    const task = data.deadlines.find((d) => d.id === newItem.task_id);
    return { ...newItem, task };
  },

  toggleActionItem(id: string, is_completed: boolean): DailyActionItem | null {
    const data = ensureDbFile();
    const idx = data.daily_action_plan.findIndex((item) => item.id === id);
    if (idx === -1) return null;

    data.daily_action_plan[idx].is_completed = is_completed;
    saveDb(data);

    const task = data.deadlines.find((d) => d.id === data.daily_action_plan[idx].task_id);
    return { ...data.daily_action_plan[idx], task };
  },

  deleteActionItem(id: string): boolean {
    const data = ensureDbFile();
    const initialLen = data.daily_action_plan.length;
    data.daily_action_plan = data.daily_action_plan.filter((item) => item.id !== id);
    if (data.daily_action_plan.length < initialLen) {
      saveDb(data);
      return true;
    }
    return false;
  },

  bulkReplaceActionPlan(userId: string, date: string, newItems: Omit<DailyActionItem, 'id' | 'user_id' | 'date'>[]): DailyActionItem[] {
    const data = ensureDbFile();
    // Remove existing for this date
    data.daily_action_plan = data.daily_action_plan.filter((item) => !(item.user_id === userId && item.date === date));

    const added: DailyActionItem[] = [];
    newItems.forEach((item, i) => {
      const createdItem: DailyActionItem = {
        ...item,
        id: `act_rescue_${Date.now()}_${i}`,
        user_id: userId,
        date: date,
      };
      data.daily_action_plan.push(createdItem);
      const task = data.deadlines.find((d) => d.id === createdItem.task_id);
      added.push({ ...createdItem, task });
    });

    saveDb(data);
    return added;
  },

  // CONFLICTS & RISK DETECTOR
  calculateConflicts(userId: string): ConflictCluster[] {
    const data = ensureDbFile();
    const activeTasks = data.deadlines
      .filter((d) => d.user_id === userId && d.status !== 'Completed')
      .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());

    const clusters: ConflictCluster[] = [];
    const now = new Date().getTime();

    // Group tasks with due dates within 48 hours of each other
    for (let i = 0; i < activeTasks.length; i++) {
      const clusterTasks = [activeTasks[i]];
      const dueI = new Date(activeTasks[i].due_date).getTime();

      for (let j = i + 1; j < activeTasks.length; j++) {
        const dueJ = new Date(activeTasks[j].due_date).getTime();
        if (dueJ - dueI <= 48 * 60 * 60 * 1000) {
          clusterTasks.push(activeTasks[j]);
        }
      }

      if (clusterTasks.length >= 2) {
        // Prevent duplicate clusters with exact same deadline IDs
        const ids = clusterTasks.map((t) => t.id).sort();
        const alreadyExists = clusters.some(
          (c) => c.deadline_ids.slice().sort().join(',') === ids.join(',')
        );

        if (!alreadyExists) {
          const totalHours = clusterTasks.reduce((sum, t) => sum + t.estimated_hours, 0);
          const earliestDue = Math.min(...clusterTasks.map((t) => new Date(t.due_date).getTime()));
          const hoursUntilFirst = Math.max(0, Math.round((earliestDue - now) / (1000 * 60 * 60)));

          let severity: 'Critical' | 'Warning' | 'Manageable' = 'Warning';
          if (clusterTasks.length >= 3 || totalHours >= 10 || hoursUntilFirst < 24) {
            severity = 'Critical';
          } else if (totalHours <= 4) {
            severity = 'Manageable';
          }

          clusters.push({
            id: `conflict_${i}_${Date.now()}`,
            title: `${clusterTasks.length} Overlapping Deadlines within 48 Hours`,
            severity,
            deadline_ids: clusterTasks.map((t) => t.id),
            deadlines: clusterTasks,
            timeframe_hours: 48,
            total_required_hours: totalHours,
            hours_until_first_due: hoursUntilFirst,
            recommendation:
              severity === 'Critical'
                ? `Severe collision! ${totalHours} hours of deep work required with only ${hoursUntilFirst}h until the first deadline. Enable Deadline Rescue Mode to triage immediately.`
                : `Tight workload window detected (${totalHours}h required). Recommend scheduling focus blocks today to avoid last-minute crunch.`,
          });
        }
      }
    }

    return clusters;
  },

  // DEADLINE RESCUE MODE
  generateRescuePlan(userId: string): RescuePlan {
    const data = ensureDbFile();
    const activeTasks = data.deadlines.filter((d) => d.user_id === userId && d.status !== 'Completed');
    const now = new Date();

    // Sort by Urgency Ratio: (Time Until Due / Estimated Hours)
    // Lower ratio means higher urgency
    const scoredTasks = activeTasks.map((task) => {
      const dueTime = new Date(task.due_date).getTime();
      const hoursRemaining = Math.max(0.5, (dueTime - now.getTime()) / (1000 * 60 * 60));
      const urgencyRatio = hoursRemaining / Math.max(1, task.estimated_hours);

      let urgency_tier: 'Immediate (Do Now)' | 'Secondary (Do Next)' | 'Defer / Request Extension';
      let action_note: string;
      let recommendedHours = task.estimated_hours;

      if (hoursRemaining <= 36 || urgencyRatio < 5) {
        urgency_tier = 'Immediate (Do Now)';
        action_note = `Critical deadline in ${Math.round(hoursRemaining)}h. Complete core requirements first.`;
      } else if (hoursRemaining <= 72 || urgencyRatio < 12) {
        urgency_tier = 'Secondary (Do Next)';
        action_note = `Due in ${Math.round(hoursRemaining / 24)} days. Complete outline & setup today.`;
        recommendedHours = Math.min(task.estimated_hours, 2.5);
      } else {
        urgency_tier = 'Defer / Request Extension';
        action_note = `Lower immediate pressure. Defer non-critical polish until urgent deliverables are submitted.`;
        recommendedHours = 1.0;
      }

      return {
        deadline: task,
        urgencyRatio,
        urgency_tier,
        recommended_focus_hours: recommendedHours,
        action_note,
      };
    }).sort((a, b) => a.urgencyRatio - b.urgencyRatio);

    // Build emergency schedule blocks starting from next round hour
    const emergency_schedule: RescuePlan['emergency_schedule'] = [];
    const scheduleStartHour = Math.min(22, Math.max(18, now.getHours() + 1));
    let currentHour = scheduleStartHour;
    let currentMinute = 0;

    scoredTasks
      .filter((t) => t.urgency_tier === 'Immediate (Do Now)' || t.urgency_tier === 'Secondary (Do Next)')
      .slice(0, 3)
      .forEach((item, index) => {
        const startStr = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
        const durationMin = Math.min(120, Math.max(60, Math.round(item.recommended_focus_hours * 60 * 0.5)));
        
        let endTotalMin = currentHour * 60 + currentMinute + durationMin;
        const endHour = Math.floor(endTotalMin / 60) % 24;
        const endMinute = endTotalMin % 60;
        const endStr = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;

        emergency_schedule.push({
          time_start: startStr,
          time_end: endStr,
          task_id: item.deadline.id,
          task_title: item.deadline.title,
          course_name: item.deadline.course_name,
          focus_objective:
            index === 0
              ? 'Triage phase 1: Implement primary pass requirements and core tests.'
              : 'Triage phase 2: Draft essential submission components and eliminate fatal bugs.',
        });

        // Advance 15 min break
        currentHour = Math.floor((endTotalMin + 15) / 60) % 24;
        currentMinute = (endTotalMin + 15) % 60;
      });

    return {
      activated_at: now.toISOString(),
      summary: `Rescue Mode engaged: Triaged ${activeTasks.length} active deadlines. Reorganized into high-impact triage blocks.`,
      focus_capacity_hours: 5.5,
      triaged_tasks: scoredTasks,
      emergency_schedule,
    };
  },
};
