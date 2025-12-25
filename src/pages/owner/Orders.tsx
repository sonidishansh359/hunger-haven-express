import { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Clock, CheckCircle, XCircle, Truck, User, Phone, MapPin, ChevronDown } from 'lucide-react';
import { PageHeader } from '@/components/owner/DashboardComponents';
import { useOwnerData } from '@/contexts/OwnerDataContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Order, OrderStatus } from '@/types/auth';
import { cn } from '@/lib/utils';

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: 'Pending', color: 'bg-warning/20 text-warning', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-primary/20 text-primary', icon: CheckCircle },
  preparing: { label: 'Preparing', color: 'bg-accent/20 text-accent', icon: Clock },
  ready: { label: 'Ready', color: 'bg-success/20 text-success', icon: CheckCircle },
  picked_up: { label: 'Picked Up', color: 'bg-blue-500/20 text-blue-500', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-success/20 text-success', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-destructive/20 text-destructive', icon: XCircle },
};

const statusFlow: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered'];

export default function OrdersPage() {
  const { orders, deliveryBoys, updateOrderStatus, assignDeliveryBoy } = useOwnerData();
  const { toast } = useToast();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const filteredOrders = orders
    .filter((order) => filterStatus === 'all' || order.status === filterStatus)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    toast({
      title: 'Order Updated',
      description: `Order status changed to ${statusConfig[newStatus].label}`,
    });
  };

  const handleAssignDelivery = (orderId: string, deliveryBoyId: string) => {
    assignDeliveryBoy(orderId, deliveryBoyId);
    const boy = deliveryBoys.find((b) => b.id === deliveryBoyId);
    toast({
      title: 'Delivery Assigned',
      description: `Order assigned to ${boy?.name}`,
    });
  };

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const currentIndex = statusFlow.indexOf(currentStatus);
    return currentIndex >= 0 && currentIndex < statusFlow.length - 1
      ? statusFlow[currentIndex + 1]
      : null;
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <Helmet>
        <title>Orders - FoodSwift Owner</title>
      </Helmet>

      <PageHeader
        title="Order Management"
        description="View and manage all incoming orders"
      />

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={filterStatus === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterStatus('all')}
        >
          All Orders
        </Button>
        {Object.entries(statusConfig).map(([status, config]) => (
          <Button
            key={status}
            variant={filterStatus === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus(status)}
          >
            {config.label}
          </Button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order, index) => {
          const StatusIcon = statusConfig[order.status].icon;
          const isExpanded = expandedOrder === order.id;
          const nextStatus = getNextStatus(order.status);
          const assignedBoy = deliveryBoys.find((b) => b.id === order.deliveryBoyId);

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card rounded-2xl border border-border overflow-hidden"
            >
              {/* Order Header */}
              <div
                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:block">
                      <span
                        className={cn(
                          'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium',
                          statusConfig[order.status].color
                        )}
                      >
                        <StatusIcon className="w-4 h-4" />
                        {statusConfig[order.status].label}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        Order #{order.id.slice(-6).toUpperCase()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.customerName} • {formatTime(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-foreground">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                    <ChevronDown
                      className={cn(
                        'w-5 h-5 text-muted-foreground transition-transform',
                        isExpanded && 'rotate-180'
                      )}
                    />
                  </div>
                </div>

                {/* Mobile Status Badge */}
                <div className="sm:hidden mt-3">
                  <span
                    className={cn(
                      'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium',
                      statusConfig[order.status].color
                    )}
                  >
                    <StatusIcon className="w-4 h-4" />
                    {statusConfig[order.status].label}
                  </span>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-border"
                >
                  <div className="p-4 space-y-4">
                    {/* Order Items */}
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Items</h4>
                      <div className="space-y-2">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-foreground">
                              {item.quantity}x {item.name}
                            </span>
                            <span className="text-muted-foreground">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Customer Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Customer</p>
                          <p className="font-medium text-foreground">{order.customerName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="font-medium text-foreground">{order.customerPhone}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 sm:col-span-2">
                        <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Delivery Address</p>
                          <p className="font-medium text-foreground">{order.deliveryAddress}</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      {order.status === 'pending' && (
                        <>
                          <Button
                            onClick={() => handleStatusChange(order.id, 'confirmed')}
                            className="flex-1"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Accept Order
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleStatusChange(order.id, 'cancelled')}
                            className="flex-1"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject Order
                          </Button>
                        </>
                      )}

                      {nextStatus && order.status !== 'pending' && order.status !== 'cancelled' && (
                        <Button
                          onClick={() => handleStatusChange(order.id, nextStatus)}
                          className="flex-1"
                        >
                          Mark as {statusConfig[nextStatus].label}
                        </Button>
                      )}

                      {(order.status === 'ready' || order.status === 'preparing') && (
                        <div className="flex-1">
                          <Select
                            value={order.deliveryBoyId || ''}
                            onValueChange={(value) => handleAssignDelivery(order.id, value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Assign Delivery" />
                            </SelectTrigger>
                            <SelectContent>
                              {deliveryBoys
                                .filter((b) => b.isAvailable)
                                .map((boy) => (
                                  <SelectItem key={boy.id} value={boy.id}>
                                    {boy.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>

                    {assignedBoy && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Truck className="w-4 h-4" />
                        Assigned to: <span className="text-foreground font-medium">{assignedBoy.name}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No orders found</p>
        </div>
      )}
    </>
  );
}
