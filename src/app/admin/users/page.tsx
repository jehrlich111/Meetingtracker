'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Users, Shield, Mail, Calendar, ArrowLeft } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import CreateUserModal from '@/components/admin/CreateUserModal'
import EditUserModal from '@/components/admin/EditUserModal'
import Navigation from '@/components/Navigation'
import { User } from '@/types'

export default function AdminUsersPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      // Mock data for demo
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'admin@meetingflow.com',
          name: 'Admin User',
          role: 'ADMIN',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date()
        },
        {
          id: '2',
          email: 'john.doe@company.com',
          name: 'John Doe',
          role: 'USER',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date()
        },
        {
          id: '3',
          email: 'jane.smith@company.com',
          name: 'Jane Smith',
          role: 'USER',
          createdAt: new Date('2024-02-01'),
          updatedAt: new Date()
        },
        {
          id: '4',
          email: 'mike.wilson@company.com',
          name: 'Mike Wilson',
          role: 'USER',
          createdAt: new Date('2024-02-15'),
          updatedAt: new Date()
        }
      ]
      setUsers(mockUsers)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUserCreated = (newUser: User) => {
    setUsers(prevUsers => [newUser, ...prevUsers])
  }

  const handleUserUpdated = (updatedUser: User) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      )
    )
  }

  const handleUserDeleted = (userId: string) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId))
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setIsEditModalOpen(true)
  }

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      handleUserDeleted(userId)
    }
  }

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Button>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Shield className="w-6 h-6 mr-2" />
                  User Management
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Manage users and their permissions
                </p>
              </div>
            </div>
            <Button 
              className="flex items-center space-x-2"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="w-4 h-4" />
              <span>Add User</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {users.length}
                  </p>
                </div>
                <Users className="w-8 h-8 text-primary-600" />
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Admin Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {users.filter(u => u.role === 'ADMIN').length}
                  </p>
                </div>
                <Shield className="w-8 h-8 text-red-600" />
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Regular Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {users.filter(u => u.role === 'USER').length}
                  </p>
                </div>
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </Card>
          </div>

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input max-w-md"
            />
          </div>

          {/* Users List */}
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <span className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                        {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {user.name || 'No Name'}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {user.email}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'ADMIN' 
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        }`}>
                          {user.role}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            
            {filteredUsers.length === 0 && (
              <Card className="p-12 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No users found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm ? 'No users match your search criteria.' : 'Get started by adding your first user.'}
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onUserCreated={handleUserCreated}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedUser(null)
        }}
        onUserUpdated={handleUserUpdated}
        user={selectedUser}
      />
    </div>
    </>
  )
}


