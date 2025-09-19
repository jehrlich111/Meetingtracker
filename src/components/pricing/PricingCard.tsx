'use client'

import { useState } from 'react'
import { Check, CreditCard, Loader } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

interface PricingCardProps {
  name: string
  price: string
  description: string
  features: string[]
  isPopular?: boolean
  onSubscribe: () => void
  loading?: boolean
}

export default function PricingCard({
  name,
  price,
  description,
  features,
  isPopular = false,
  onSubscribe,
  loading = false
}: PricingCardProps) {
  return (
    <Card className={`relative p-8 ${isPopular ? 'ring-2 ring-primary-500 shadow-lg' : ''}`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {description}
        </p>
        <div className="flex items-baseline justify-center">
          <span className="text-5xl font-bold text-gray-900 dark:text-white">
            {price}
          </span>
          <span className="text-xl text-gray-500 dark:text-gray-400 ml-1">
            /month
          </span>
        </div>
      </div>

      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        onClick={onSubscribe}
        disabled={loading}
        className={`w-full flex items-center justify-center space-x-2 ${
          isPopular 
            ? 'bg-primary-600 hover:bg-primary-700' 
            : 'bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600'
        }`}
      >
        {loading ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <CreditCard className="w-4 h-4" />
        )}
        <span>{loading ? 'Processing...' : 'Subscribe Now'}</span>
      </Button>
    </Card>
  )
}

