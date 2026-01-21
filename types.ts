
export enum HeroClass {
  WARRIOR = 'นักรบ',
  MAGE = 'จอมเวท',
  HEALER = 'ผู้รักษา'
}

export interface ActiveQuest {
  questId: string;
  startTime: number;
  endTime: number;
  claimed: boolean;
}

export interface Student {
  id: string;
  name: string;
  heroClass: HeroClass;
  grade: number; // 1-6
  room: number;  // 1-4
  level: number;
  hp: number;
  maxHp: number;
  xp: number;
  gold: number;
  avatar: string;
  activeQuest?: ActiveQuest;
  lastDailyClaim?: number; // Timestamp for daily check-in (Student side)
  lastAttendance?: string; // Date string "YYYY-MM-DD" for teacher check-in
}

export interface LogEntry {
  id: string;
  studentId: string;
  studentName: string;
  type: 'XP' | 'GOLD' | 'HP' | 'ITEM' | 'ATTENDANCE';
  amount: number;
  reason: string;
  timestamp: number;
}

export interface Quest {
  id: string;
  title: string;
  rewardXp: number;
  rewardGold: number;
  description: string;
  durationMinutes: number; // For timed quests
  icon: string;
}

export interface ShopItem {
  id: string;
  name: string;
  price: number;
  description: string;
  icon: string;
}

export type View = 
  | 'LOGIN' 
  | 'REGISTER' 
  | 'TEACHER_ARENA' 
  | 'TEACHER_ATTENDANCE'
  | 'TEACHER_CHRONICLES' 
  | 'TEACHER_TREASURY' 
  | 'TEACHER_INSIGHTS' 
  | 'TEACHER_EVENTS'
  | 'TEACHER_MANAGEMENT'
  | 'STUDENT_HERO' 
  | 'STUDENT_QUESTS' 
  | 'STUDENT_SHOP' 
  | 'STUDENT_LOGS' 
  | 'LEADERBOARD';

export interface UserSession {
  role: 'TEACHER' | 'STUDENT';
  studentId?: string;
}
