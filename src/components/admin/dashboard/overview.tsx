"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { useEffect, useState } from "react"

const mockData = [
  {
    name: "Jan",
    deposits: 400,
    exchanges: 240,
    withdrawals: 180,
  },
  {
    name: "Feb",
    deposits: 300,
    exchanges: 139,
    withdrawals: 221,
  },
  {
    name: "Mar",
    deposits: 200,
    exchanges: 980,
    withdrawals: 290,
  },
  {
    name: "Apr",
    deposits: 278,
    exchanges: 390,
    withdrawals: 200,
  },
  {
    name: "May",
    deposits: 189,
    exchanges: 480,
    withdrawals: 181,
  },
  {
    name: "Jun",
    deposits: 239,
    exchanges: 380,
    withdrawals: 250,
  },
  {
    name: "Jul",
    deposits: 349,
    exchanges: 430,
    withdrawals: 210,
  },
]

export function Overview() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className="h-[300px] flex items-center justify-center">Loading chart...</div>
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={mockData}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Bar dataKey="deposits" fill="#adfa1d" radius={[4, 4, 0, 0]} />
        <Bar dataKey="exchanges" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
        <Bar dataKey="withdrawals" fill="#f43f5e" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

