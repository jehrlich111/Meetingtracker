'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Target, CheckSquare, BarChart3, Plus, Bell, Users, UserPlus } from 'lucide-react'
import Button from '@/components/ui/Button'
import MeetingCard from './MeetingCard'
import TaskCard from './TaskCard'
import GoalCard from './GoalCard'
import StatsCard from './StatsCard'
import QuickTaskModal from './QuickTaskModal'
import AssignmentModal from './AssignmentModal'
import Navigation from '@/components/Navigation'
import { Meeting, Task, Goal, DashboardStats, User } from '@/types'

export default function Dashboard() {
  const { data: session } = useSession()
  const router = useRouter()
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    upcomingMeetings: 0,
    pendingTasks: 0,
    completedGoals: 0,
    meetingEffectiveness: 0
  })
  const [loading, setLoading] = useState(true)
  const [showQuickTaskModal, setShowQuickTaskModal] = useState(false)
  const [showAssignmentModal, setShowAssignmentModal] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Mock data for demo
      const mockMeetings: Meeting[] = [
        {
          id: '1',
          title: 'Weekly Team Standup',
          description: 'Review progress and plan for the week',
          date: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
          duration: 30,
          status: 'SCHEDULED',
          objectives: ['Review last week progress', 'Plan this week tasks', 'Identify blockers'],
          orgId: 'org1',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          title: 'Product Planning Session',
          description: 'Plan Q1 product roadmap',
          date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          duration: 120,
          status: 'SCHEDULED',
          objectives: ['Define Q1 goals', 'Prioritize features', 'Assign responsibilities'],
          orgId: 'org1',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]

      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'Update project documentation',
          description: 'Update API documentation for new features',
          status: 'IN_PROGRESS',
          priority: 'HIGH',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          title: 'Review code changes',
          description: 'Review pull requests from team members',
          status: 'NOT_STARTED',
          priority: 'MEDIUM',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]

      const mockGoals: Goal[] = [
        {
          id: '1',
          title: 'Increase team productivity by 25%',
          description: 'Implement new processes and tools to improve team efficiency',
          type: 'TEAM',
          progress: 60,
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          ownerId: 'user1',
          orgId: 'org1',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          title: 'Complete Q1 product launch',
          description: 'Launch the new product features by end of Q1',
          type: 'COMPANY',
          progress: 80,
          deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          ownerId: 'user1',
          orgId: 'org1',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]

      const mockUsers: User[] = [
        {
          id: '1',
          email: 'john.doe@company.com',
          name: 'John Doe',
          role: 'USER',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          email: 'jane.smith@company.com',
          name: 'Jane Smith',
          role: 'USER',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '3',
          email: 'mike.wilson@company.com',
          name: 'Mike Wilson',
          role: 'USER',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]

      setMeetings(mockMeetings)
      setTasks(mockTasks)
      setGoals(mockGoals)
      setUsers(mockUsers)
      setStats({
        upcomingMeetings: mockMeetings.length,
        pendingTasks: mockTasks.filter(t => t.status !== 'COMPLETED').length,
        completedGoals: mockGoals.filter(g => g.progress === 100).length,
        meetingEffectiveness: 85
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTaskCreated = (newTask: Task) => {
    setTasks(prevTasks => [newTask, ...prevTasks])
    setStats(prevStats => ({
      ...prevStats,
      pendingTasks: prevStats.pendingTasks + 1
    }))
  }

  const handleAssignmentCreated = (assignment: any) => {
    if (assignment.type === 'task') {
      const newTask: Task = {
        id: Date.now().toString(),
        title: assignment.title,
        description: assignment.description,
        status: 'NOT_STARTED',
        priority: assignment.priority || 'MEDIUM',
        assigneeId: assignment.assigneeId,
        dueDate: assignment.dueDate,
        meetingId: assignment.meetingId,
        goalId: assignment.goalId,
        createdAt: new Date(),
        updatedAt: new Date(),
        assignee: users.find(u => u.id === assignment.assigneeId),
        meeting: assignment.meetingId ? meetings.find(m => m.id === assignment.meetingId) : undefined,
        goal: assignment.goalId ? goals.find(g => g.id === assignment.goalId) : undefined
      }
      setTasks(prevTasks => [newTask, ...prevTasks])
      setStats(prevStats => ({
        ...prevStats,
        pendingTasks: prevStats.pendingTasks + 1
      }))
    } else if (assignment.type === 'goal') {
      const newGoal: Goal = {
        id: Date.now().toString(),
        title: assignment.title,
        description: assignment.description,
        type: 'PERSONAL',
        progress: 0,
        deadline: assignment.deadline,
        ownerId: assignment.assigneeId,
        orgId: 'org1',
        createdAt: new Date(),
        updatedAt: new Date(),
        owner: users.find(u => u.id === assignment.assigneeId)
      }
      setGoals(prevGoals => [newGoal, ...prevGoals])
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 lg:ml-64">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome back, {session?.user?.name || 'User'}!
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Here's what's happening with your meetings and goals
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <Bell className="w-6 h-6" />
              </button>
              <button 
                className="btn btn-primary flex items-center space-x-2"
                onClick={() => router.push('/meetings')}
              >
                <Plus className="w-4 h-4" />
                <span>New Meeting</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Upcoming Meetings"
              value={stats.upcomingMeetings}
              icon={Calendar}
              color="blue"
            />
            <StatsCard
              title="Pending Tasks"
              value={stats.pendingTasks}
              icon={CheckSquare}
              color="orange"
            />
            <StatsCard
              title="Completed Goals"
              value={stats.completedGoals}
              icon={Target}
              color="green"
            />
            <StatsCard
              title="Meeting Effectiveness"
              value={`${stats.meetingEffectiveness}%`}
              icon={BarChart3}
              color="purple"
            />
          </div>

          {/* Quick Assignment Section */}
          <div className="mb-8">
            <div className="card p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Quick Assignments
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Assign tasks and goals to team members and link them to meetings
                  </p>
                </div>
                <Button
                  onClick={() => setShowAssignmentModal(true)}
                  className="flex items-center space-x-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Assign Task/Goal</span>
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Recent Assignments Preview */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      <CheckSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Recent Tasks</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {tasks.filter(t => t.assigneeId).length} assigned
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {tasks.filter(t => t.assigneeId).slice(0, 2).map((task) => (
                      <div key={task.id} className="text-sm">
                        <p className="text-gray-900 dark:text-white truncate">{task.title}</p>
                        <p className="text-gray-500 dark:text-gray-400">
                          → {task.assignee?.name || 'Unassigned'}
                        </p>
                      </div>
                    ))}
                    {tasks.filter(t => t.assigneeId).length === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No assigned tasks yet
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                      <Target className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Recent Goals</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {goals.filter(g => g.ownerId).length} assigned
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {goals.filter(g => g.ownerId).slice(0, 2).map((goal) => (
                      <div key={goal.id} className="text-sm">
                        <p className="text-gray-900 dark:text-white truncate">{goal.title}</p>
                        <p className="text-gray-500 dark:text-gray-400">
                          → {goal.owner?.name || 'Unassigned'}
                        </p>
                      </div>
                    ))}
                    {goals.filter(g => g.ownerId).length === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No assigned goals yet
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Meeting Links</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {tasks.filter(t => t.meetingId).length} linked to meetings
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {tasks.filter(t => t.meetingId).slice(0, 2).map((task) => (
                      <div key={task.id} className="text-sm">
                        <p className="text-gray-900 dark:text-white truncate">{task.title}</p>
                        <p className="text-gray-500 dark:text-gray-400">
                          → {task.meeting?.title || 'Unknown Meeting'}
                        </p>
                      </div>
                    ))}
                    {tasks.filter(t => t.meetingId).length === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No meeting-linked tasks yet
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Upcoming Meetings */}
            <div className="lg:col-span-2">
              <div className="card p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Upcoming Meetings
                  </h2>
                  <button 
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    onClick={() => router.push('/meetings')}
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {meetings.map((meeting) => (
                    <MeetingCard 
                      key={meeting.id} 
                      meeting={meeting} 
                      onClick={() => router.push(`/meetings/${meeting.id}`)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Task Creation */}
              <div className="card p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <CheckSquare className="w-5 h-5 mr-2" />
                    Quick Add Task
                  </h3>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Create and assign tasks to team members or link them to meetings.
                  </p>
                  <Button
                    onClick={() => setShowQuickTaskModal(true)}
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Task</span>
                  </Button>
                </div>
              </div>

              {/* Recent Tasks */}
              <div className="card p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Recent Tasks
                  </h3>
                  <button 
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    onClick={() => router.push('/tasks')}
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {tasks.slice(0, 3).map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>

              {/* Goal Progress */}
              <div className="card p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Goal Progress
                  </h3>
                  <button 
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    onClick={() => router.push('/goals')}
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {goals.slice(0, 2).map((goal) => (
                    <GoalCard key={goal.id} goal={goal} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Task Modal */}
      <QuickTaskModal
        isOpen={showQuickTaskModal}
        onClose={() => setShowQuickTaskModal(false)}
        onTaskCreated={handleTaskCreated}
        meetings={meetings}
        users={users}
      />

      {/* Assignment Modal */}
      <AssignmentModal
        isOpen={showAssignmentModal}
        onClose={() => setShowAssignmentModal(false)}
        onAssignmentCreated={handleAssignmentCreated}
        meetings={meetings}
        users={users}
        goals={goals}
      />
    </div>
    </>
  )
}
