import React, { useEffect, useState } from 'react'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await fetch('/admin/api/total-revenue')
        if (response.ok) {
          const data = await response.json()
          setTotalRevenue(data.total_revenue)
        }
      } catch (error) {
        console.error('Error fetching revenue:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRevenue()
  }, [])

  return (
    <div className="flex gap-4">
      <Card className="flex-1 @container/card">
        <CardHeader>
          <CardDescription className="font-lexend font-light">Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-lexend tabular-nums @[250px]/card:text-3xl">
            {loading ? 'Loading...' : `₱${totalRevenue.toLocaleString()}`}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="flex-1 @container/card">
        <CardHeader>
          <CardDescription></CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="flex-1 @container/card">
        <CardHeader>
          <CardDescription></CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="flex-1 @container/card">
        <CardHeader>
          <CardDescription></CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
} 