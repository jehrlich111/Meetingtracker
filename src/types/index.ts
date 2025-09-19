// Core Types
export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'ADMIN' | 'USER';
  createdAt: Date;
  updatedAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  settings?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  date: Date;
  duration: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  objectives: string[];
  agenda?: any;
  orgId: string;
  createdAt: Date;
  updatedAt: Date;
  attendees?: MeetingAttendee[];
  tasks?: Task[];
  notes?: MeetingNote[];
  decisions?: Decision[];
}

export interface MeetingAttendee {
  id: string;
  meetingId: string;
  userId: string;
  role: 'ORGANIZER' | 'PARTICIPANT' | 'OBSERVER';
  prepStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  createdAt: Date;
  user?: User;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  type: 'COMPANY' | 'DEPARTMENT' | 'TEAM' | 'PERSONAL';
  progress: number;
  deadline?: Date;
  parentGoalId?: string;
  ownerId: string;
  orgId: string;
  createdAt: Date;
  updatedAt: Date;
  owner?: User;
  parentGoal?: Goal;
  subGoals?: Goal[];
  tasks?: Task[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assigneeId?: string;
  dueDate?: Date;
  meetingId?: string;
  goalId?: string;
  effort?: number;
  createdAt: Date;
  updatedAt: Date;
  assignee?: User;
  meeting?: Meeting;
  goal?: Goal;
}

export interface MeetingNote {
  id: string;
  content: string;
  meetingId: string;
  authorId: string;
  timestamp: Date;
  createdAt: Date;
  author?: User;
}

export interface Decision {
  id: string;
  description: string;
  context?: string;
  meetingId: string;
  implementationStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
}

export interface Template {
  id: string;
  name: string;
  type: 'STANDUP' | 'PLANNING' | 'REVIEW' | 'STRATEGY' | 'RETROSPECTIVE' | 'ONE_ON_ONE';
  structure: any;
  orgId: string;
  createdAt: Date;
  updatedAt: Date;
}

// UI State Types
export interface MeetingFormData {
  title: string;
  description?: string;
  date: Date;
  duration: number;
  objectives: string[];
  agenda: AgendaItem[];
  attendees: string[];
  templateId?: string;
}

export interface AgendaItem {
  id: string;
  title: string;
  description?: string;
  duration: number;
  order: number;
  completed: boolean;
}

export interface DashboardStats {
  upcomingMeetings: number;
  pendingTasks: number;
  completedGoals: number;
  meetingEffectiveness: number;
}

export interface MeetingAnalytics {
  totalMeetings: number;
  averageDuration: number;
  objectiveCompletionRate: number;
  taskCreationRate: number;
  goalProgressRate: number;
}

// Socket.io Types
export interface SocketEvents {
  'meeting:join': (meetingId: string) => void;
  'meeting:leave': (meetingId: string) => void;
  'meeting:update': (meetingId: string, data: Partial<Meeting>) => void;
  'note:create': (meetingId: string, note: Omit<MeetingNote, 'id' | 'createdAt'>) => void;
  'note:update': (meetingId: string, noteId: string, content: string) => void;
  'task:create': (meetingId: string, task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  'task:update': (meetingId: string, taskId: string, updates: Partial<Task>) => void;
  'decision:create': (meetingId: string, decision: Omit<Decision, 'id' | 'createdAt' | 'updatedAt'>) => void;
  'agenda:update': (meetingId: string, agenda: AgendaItem[]) => void;
  'objective:update': (meetingId: string, objectiveIndex: number, completed: boolean) => void;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
