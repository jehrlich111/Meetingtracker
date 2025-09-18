'use client'

import { useState, useEffect } from 'react'
import { X, User, Shield } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { User as UserType } from '@/types'

interface EditUserModalProps {
  isOpen: boolean
  onClose: () => void
  onUserUpdated: (user: UserType) => void
  user: UserType | null
}

export default function EditUserModal({ isOpen, onClose, onUserUpdated, user }: EditUserModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'USER' as UserType['role']
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email,
        role: user.role
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSubmitting(true)

    try {
      const updatedUser: UserType = {
        ...user,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        updatedAt: new Date()
      }

      onUserUpdated(updatedUser)
      onClose()
    } catch (error) {
      console.error('Error updating user:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <User className="w-5 h-5 mr-2" />
              Edit User
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="label">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input"
                placeholder="Enter full name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="label">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input"
                placeholder="Enter email address"
              />
            </div>

            {/* Role */}
            <div>
              <label className="label">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input"
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            {/* User Info */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                User Information
              </h4>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <p>ID: {user.id}</p>
                <p>Created: {new Date(user.createdAt).toLocaleDateString()}</p>
                <p>Last Updated: {new Date(user.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !formData.name.trim() || !formData.email.trim()}
                className="flex-1"
              >
                {isSubmitting ? 'Updating...' : 'Update User'}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}




