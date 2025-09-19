'use client'

import { useState } from 'react'
import { CreditCard, Settings, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

interface SubscriptionManagerProps {
  subscriptionStatus?: 'active' | 'inactive' | 'past_due' | 'canceled'
  currentPlan?: string
  nextBillingDate?: string
}

export default function SubscriptionManager({
  subscriptionStatus = 'inactive',
  currentPlan = 'Free',
  nextBillingDate
}: SubscriptionManagerProps) {
  const [loading, setLoading] = useState(false)

  const handleManageSubscription = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const { url } = await response.json()
      
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Error creating portal session:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = () => {
    switch (subscriptionStatus) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'past_due':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case 'canceled':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <XCircle className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusText = () => {
    switch (subscriptionStatus) {
      case 'active':
        return 'Active'
      case 'past_due':
        return 'Past Due'
      case 'canceled':
        return 'Canceled'
      default:
        return 'Inactive'
    }
  }

  const getStatusColor = () => {
    switch (subscriptionStatus) {
      case 'active':
        return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300'
      case 'past_due':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300'
      case 'canceled':
        return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <CreditCard className="w-6 h-6 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Subscription
          </h3>
        </div>
        {subscriptionStatus === 'active' && (
          <Button
            variant="ghost"
            onClick={handleManageSubscription}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <Settings className="w-4 h-4" />
            <span>Manage</span>
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Current Plan
          </span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {currentPlan}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Status
          </span>
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
        </div>

        {nextBillingDate && subscriptionStatus === 'active' && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Next Billing Date
            </span>
            <span className="text-sm text-gray-900 dark:text-white">
              {new Date(nextBillingDate).toLocaleDateString()}
            </span>
          </div>
        )}

        {subscriptionStatus === 'inactive' && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
              Upgrade to Pro to unlock all features and unlimited meetings.
            </p>
            <Button
              onClick={() => window.location.href = '/pricing'}
              className="w-full"
            >
              Upgrade to Pro
            </Button>
          </div>
        )}

        {subscriptionStatus === 'past_due' && (
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
              Your payment failed. Please update your payment method to continue using Pro features.
            </p>
            <Button
              onClick={handleManageSubscription}
              disabled={loading}
              className="w-full"
            >
              Update Payment Method
            </Button>
          </div>
        )}

        {subscriptionStatus === 'canceled' && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-200 mb-3">
              Your subscription has been canceled. You can reactivate it anytime.
            </p>
            <Button
              onClick={() => window.location.href = '/pricing'}
              className="w-full"
            >
              Reactivate Subscription
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}

