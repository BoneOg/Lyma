"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "An interactive area chart"

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "var(--color-olive)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--color-olive)",
  },
}

interface ChartDataPoint {
  date: string;
  desktop: number;
  mobile: number;
  tablet?: number;
}

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("30d")
  const [chartData, setChartData] = React.useState<ChartDataPoint[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  // Fetch real analytics data
  React.useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        let days = 30
        if (timeRange === "365d") {
          days = 365
        } else if (timeRange === "90d") {
          days = 90
        } else if (timeRange === "7d") {
          days = 7
        }
        
        const response = await fetch(`/api/analytics/chart-data?days=${days}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data')
        }
        
        const data = await response.json()
        setChartData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching analytics data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchChartData()
  }, [timeRange])

  // Calculate totals from real data
  const desktopTotal = chartData.reduce((sum, item) => sum + item.desktop, 0)
  const mobileTotal = chartData.reduce((sum, item) => sum + item.mobile, 0)
  const combinedTotal = desktopTotal + mobileTotal

  // Get description text based on time range
  const getDescriptionText = () => {
    switch (timeRange) {
      case "365d":
        return "Total for the last 12 months"
      case "90d":
        return "Total for the last 3 months"
      case "30d":
        return "Total for the last 30 days"
      case "7d":
        return "Total for the last 7 days"
      default:
        return "Total for the last 30 days"
    }
  }

  // Get short description text for mobile
  const getShortDescriptionText = () => {
    switch (timeRange) {
      case "365d":
        return "Last 12 months"
      case "90d":
        return "Last 3 months"
      case "30d":
        return "Last 30 days"
      case "7d":
        return "Last 7 days"
      default:
        return "Last 30 days"
    }
  }

  if (loading) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle className="font-lexend font-semibold">Loading Analytics...</CardTitle>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <div className="aspect-auto h-[250px] w-full flex items-center justify-center">
            <div className="text-olive">Loading chart data...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle className="font-lexend font-semibold text-red-600">Error Loading Analytics</CardTitle>
          <CardDescription className="font-lexend font-light text-red-500">
            {error}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <div className="aspect-auto h-[250px] w-full flex items-center justify-center">
            <div className="text-red-500">Failed to load analytics data</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle className="font-lexend font-semibold">Total Visitors: {combinedTotal.toLocaleString()}</CardTitle>
        <CardDescription className="font-lexend font-light">
          <span className="hidden @[540px]/card:block ">
            {getDescriptionText()}
          </span>
          <span className="@[540px]/card:hidden">
            {getShortDescriptionText()}
          </span>
        </CardDescription>
        
        {/* Statistics */}
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center gap-2 font-lexend font-light text-sm">
            <div className="w-3 h-3 rounded-sm bg-[var(--color-olive)]"></div>
            <span>Desktop: {desktopTotal.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 font-lexend font-light text-sm">
            <div className="w-3 h-3 rounded-sm bg-[var(--color-olive)] opacity-60"></div>
            <span>Mobile: {mobileTotal.toLocaleString()}</span>
          </div>
        </div>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="365d" className="font-lexend font-light hover:bg-[#3f411a]/50 hover:text-beige transition-colors">Last 12 months</ToggleGroupItem>
            <ToggleGroupItem value="90d" className="font-lexend font-light hover:bg-[#3f411a]/50 hover:text-beige transition-colors">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d" className="font-lexend font-light hover:bg-[#3f411a]/50 hover:text-beige transition-colors">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d" className="font-lexend font-light hover:bg-[#3f411a]/50 hover:text-beige transition-colors">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden font-lexend"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 30 days" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="365d" className="rounded-lg font-lexend">
                Last 12 months
              </SelectItem>
              <SelectItem value="90d" className="rounded-lg font-lexend">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg font-lexend">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg font-lexend">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={timeRange === "365d" ? 50 : 32}
              className="font-lexend font-light text-xs"
              tickFormatter={(value) => {
                const date = new Date(value)
                
                // For 7 days, show day names
                if (timeRange === "7d") {
                  return date.toLocaleDateString("en-US", {
                    weekday: "short",
                  })
                }
                
                // For 30 days, show week ranges
                if (timeRange === "30d") {
                  const startOfWeek = new Date(date)
                  startOfWeek.setDate(date.getDate() - date.getDay())
                  const endOfWeek = new Date(startOfWeek)
                  endOfWeek.setDate(startOfWeek.getDate() + 6)
                  
                  return `${startOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric" })}-${endOfWeek.toLocaleDateString("en-US", { day: "numeric" })}`
                }
                
                // For 3 months, show month names
                if (timeRange === "90d") {
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                  })
                }
                
                // For 12 months, show month and day
                if (timeRange === "365d") {
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
                
                // Default fallback
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    const date = new Date(value)
                    
                    // For 7 days, show full date
                    if (timeRange === "7d") {
                      return date.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      })
                    }
                    
                    // For 30 days, show full date
                    if (timeRange === "30d") {
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                    
                    // For 3 months, show month and day
                    if (timeRange === "90d") {
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                    
                    // For 12 months, show month and day
                    if (timeRange === "365d") {
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                    
                    // Default fallback
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="mobile"
              type="linear"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="linear"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
} 