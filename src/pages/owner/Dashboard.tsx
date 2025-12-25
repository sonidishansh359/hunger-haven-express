import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  ShoppingBag,
  DollarSign,
  Clock,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';
import { StatCard, PageHeader } from '@/components/owner/DashboardComponents';
import { useOwnerData } from '@/contexts/OwnerDataContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function OwnerDashboard() {
  const { orders, restaurant, getTodayStats } = useOwnerData();
  const stats = getTodayStats();

  const recentOrders = orders
    .filter((order) => order.status !== 'delivered' && order.status !== 'cancelled')
    .slice(0, 5);

  return (
    <>
      <Helmet>
        <title>Dashboard - FoodSwift Owner</title>
      </Helmet>

      <PageHeader
        title="Dashboard"
        description={`Welcome back! Here's what's happening at ${restaurant?.name || 'your restaurant'}.`}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            title="Today's Orders"
            value={stats.orders}
            icon={ShoppingBag}
            trend={{ value: 12, isPositive: true }}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatCard
            title="Today's Revenue"
            value={`$${stats.revenue.toFixed(2)}`}
            icon={DollarSign}
            trend={{ value: 8, isPositive: true }}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatCard
            title="Pending Orders"
            value={stats.pending}
            icon={Clock}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatCard
            title="Total Orders"
            value={orders.length}
            icon={TrendingUp}
          />
        </motion.div>
      </div>

      {/* Quick Actions & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-card rounded-2xl border border-border p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Recent Orders</h2>
            <Link to="/owner/orders">
              <Button variant="ghost" size="sm">
                View All
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-xl"
                >
                  <div>
                    <p className="font-medium text-foreground">#{order.id.slice(-6)}</p>
                    <p className="text-sm text-muted-foreground">{order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">${order.totalAmount.toFixed(2)}</p>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        order.status === 'pending'
                          ? 'bg-warning/20 text-warning'
                          : order.status === 'preparing'
                          ? 'bg-primary/20 text-primary'
                          : 'bg-success/20 text-success'
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No active orders right now</p>
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card rounded-2xl border border-border p-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/owner/menu">
              <Button variant="outline" className="w-full justify-start">
                <span className="mr-3">🍽️</span>
                Add Menu Item
              </Button>
            </Link>
            <Link to="/owner/restaurant">
              <Button variant="outline" className="w-full justify-start">
                <span className="mr-3">⚙️</span>
                Edit Restaurant
              </Button>
            </Link>
            <Link to="/owner/orders">
              <Button variant="outline" className="w-full justify-start">
                <span className="mr-3">📋</span>
                Manage Orders
              </Button>
            </Link>
            <Link to="/owner/earnings">
              <Button variant="outline" className="w-full justify-start">
                <span className="mr-3">📊</span>
                View Earnings
              </Button>
            </Link>
          </div>

          {/* Restaurant Status */}
          <div className="mt-6 p-4 rounded-xl bg-muted/50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Restaurant Status</span>
              <span
                className={`flex items-center gap-2 text-sm font-medium ${
                  restaurant?.isOpen ? 'text-success' : 'text-destructive'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${restaurant?.isOpen ? 'bg-success' : 'bg-destructive'}`} />
                {restaurant?.isOpen ? 'Open' : 'Closed'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
