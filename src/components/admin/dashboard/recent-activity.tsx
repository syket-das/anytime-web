"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react"

type ActivityType = "deposit" | "exchange" | "withdrawal"

interface Activity {
  id: string
  type: ActivityType
  user: {
    name: string
    email: string
    image?: string
  }
  amount: number
  currency: string
  status: string
  date: string
}

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "deposit",
    user: {
      name: "John Doe",
      email: "john@example.com",
    },
    amount: 500,
    currency: "USDT",
    status: "SUCCESS",
    date: "2023-05-20T14:30:00Z",
  },
  {
    id: "2",
    type: "exchange",
    user: {
      name: "Jane Smith",
      email: "jane@example.com",
    },
    amount: 1000,
    currency: "INR",
    status: "PENDING",
    date: "2023-05-19T10:15:00Z",
  },
  {
    id: "3",
    type: "withdrawal",
    user: {
      name: "Bob Johnson",
      email: "bob@example.com",
    },
    amount: 250,
    currency: "USDT",
    status: "SUCCESS",
    date: "2023-05-18T09:45:00Z",
  },
  {
    id: "4",
    type: "deposit",
    user: {
      name: "Alice Brown",
      email: "alice@example.com",
    },
    amount: 750,
    currency: "BDT",
    status: "SUCCESS",
    date: "2023-05-17T16:20:00Z",
  },
  {
    id: "5",
    type: "exchange",
    user: {
      name: "Charlie Wilson",
      email: "charlie@example.com",
    },
    amount: 300,
    currency: "USDT",
    status: "FAILED",
    date: "2023-05-16T11:10:00Z",
  },
]

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    setActivities(mockActivities)
  }, [])

  return (
    <div className="space-y-8">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={activity.user.image} alt={activity.user.name} />
            <AvatarFallback>{getInitials(activity.user.name)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.user.name}</p>
            <p className="text-sm text-muted-foreground">{getActivityDescription(activity)}</p>
          </div>
          <div className={`ml-auto font-medium ${getStatusColor(activity.status)}`}>{activity.status}</div>
        </div>
      ))}
    </div>
  )
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)
}

function getActivityDescription(activity: Activity): string {
  const date = new Date(activity.date).toLocaleDateString()

  switch (activity.type) {
    case "deposit":
      return `Deposited ${activity.amount} ${activity.currency} on ${date}`
    case "exchange":
      return `Exchanged ${activity.amount} ${activity.currency} on ${date}`
    case "withdrawal":
      return `Withdrew ${activity.amount} ${activity.currency} on ${date}`
    default:
      return `Transaction of ${activity.amount} ${activity.currency} on ${date}`
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case "SUCCESS":
      return "text-green-600"
    case "PENDING":
      return "text-yellow-600"
    case "FAILED":
    case "CANCELLED":
      return "text-red-600"
    default:
      return "text-gray-600"
  }
}

