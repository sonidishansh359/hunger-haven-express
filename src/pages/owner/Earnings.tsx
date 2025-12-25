import { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { DollarSign, TrendingUp, ShoppingBag, Calendar } from 'lucide-react';
import { PageHeader, StatCard } from '@/components/owner/DashboardComponents';
import { mockEarningsData } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Period = 'daily' | 'weekly' | 'monthly';

export default function EarningsPage() {
  const [period, setPeriod] = useState<Period>('daily');

  const totalRevenue = mockEarningsData.reduce((sum, day) => sum + day.revenue, 0);
  const totalOrders = mockEarningsData.reduce((sum, day) => sum + day.orders, 0);
  const avgOrderValue = totalRevenue / totalOrders;
  const maxRevenue = Math.max(...mockEarningsData.map((d) => d.revenue));

  const periodMultiplier: Record<Period, number> = {
    daily: 1,
    weekly: 7,
    monthly: 30,
  };

  return (
    <>
      <Helmet>
        <title>Earnings - FoodSwift Owner</title>
      </Helmet>

      <PageHeader
        title="Earnings"
        description="Track your revenue and order statistics"
        actions={
          <div className="flex gap-2">
            {(['daily', 'weekly', 'monthly'] as Period[]).map((p) => (
              <Button
                key={p}
                variant={period === p ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPeriod(p)}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </Button>
            ))}
          </div>
        }
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            title="Total Revenue"
            value={`$${(totalRevenue * periodMultiplier[period]).toFixed(2)}`}
            icon={DollarSign}
            trend={{ value: 15, isPositive: true }}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatCard
            title="Total Orders"
            value={Math.round(totalOrders * periodMultiplier[period])}
            icon={ShoppingBag}
            trend={{ value: 12, isPositive: true }}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatCard
            title="Avg Order Value"
            value={`$${avgOrderValue.toFixed(2)}`}
            icon={TrendingUp}
            trend={{ value: 8, isPositive: true }}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatCard
            title="Best Day"
            value={`$${maxRevenue.toFixed(2)}`}
            icon={Calendar}
          />
        </motion.div>
      </div>

      {/* Revenue Chart (Simplified Bar Chart) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-card rounded-2xl border border-border p-6 mb-8"
      >
        <h2 className="text-lg font-semibold text-foreground mb-6">Revenue Overview</h2>
        <div className="h-64 flex items-end justify-between gap-2">
          {mockEarningsData.map((day, index) => {
            const height = (day.revenue / maxRevenue) * 100;
            return (
              <motion.div
                key={day.date}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: 0.6 + index * 0.05, duration: 0.5 }}
                className="flex-1 flex flex-col items-center"
              >
                <div
                  className="w-full bg-gradient-primary rounded-t-lg relative group cursor-pointer min-h-[20px]"
                  style={{ height: '100%' }}
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-foreground text-background px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ${day.revenue.toFixed(2)}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground mt-2">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Daily Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-card rounded-2xl border border-border overflow-hidden"
      >
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Daily Breakdown</h2>
        </div>
        <div className="divide-y divide-border">
          {mockEarningsData.map((day) => (
            <div
              key={day.date}
              className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {new Date(day.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">{day.orders} orders</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-foreground">${day.revenue.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">
                  Avg: ${(day.revenue / day.orders).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
