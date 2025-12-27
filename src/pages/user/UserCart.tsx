import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  MapPin,
  CreditCard,
  Wallet,
  Banknote,
  ChevronRight,
  ShoppingBag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserData } from '@/contexts/UserDataContext';
import { useToast } from '@/hooks/use-toast';

type PaymentMethod = 'upi' | 'card' | 'cod';

const paymentMethods = [
  { id: 'upi' as PaymentMethod, name: 'UPI', icon: Wallet, description: 'Pay using UPI apps' },
  { id: 'card' as PaymentMethod, name: 'Card', icon: CreditCard, description: 'Credit or Debit card' },
  { id: 'cod' as PaymentMethod, name: 'Cash on Delivery', icon: Banknote, description: 'Pay when delivered' },
];

export default function UserCart() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cart, updateCartQuantity, removeFromCart, placeOrder } = useUserData();
  
  const [deliveryAddress, setDeliveryAddress] = useState('123 Main Street, Apt 4B, Food City, FC 12345');
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 25 ? 0 : 3.99;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast({
        title: 'Cart is empty',
        description: 'Add items to your cart first',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const order = placeOrder(deliveryAddress, selectedPayment);
    
    setIsProcessing(false);
    
    toast({
      title: 'Order placed successfully!',
      description: `Order #${order.id.slice(-6)} is being prepared`,
    });
    
    navigate('/user/checkout-success', { state: { order } });
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Add some delicious food to get started</p>
          <Button onClick={() => navigate('/user/restaurants')}>
            Browse Restaurants
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pb-24 lg:pb-8">
      {/* Header */}
      <div className="sticky top-16 bg-card/95 backdrop-blur-md border-b border-border z-30">
        <div className="px-4 lg:px-8 py-4 flex items-center gap-4 max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Your Cart</h1>
        </div>
      </div>

      <div className="px-4 lg:px-8 py-6 max-w-4xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Cart Items & Delivery */}
          <div className="lg:col-span-3 space-y-6">
            {/* Cart Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-xl overflow-hidden"
            >
              <div className="p-4 border-b border-border">
                <h2 className="font-semibold text-foreground">
                  {cart[0]?.restaurantName || 'Your Items'}
                </h2>
              </div>
              <div className="divide-y divide-border">
                {cart.map(item => (
                  <div key={item.menuItemId} className="p-4 flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeFromCart(item.menuItemId)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateCartQuantity(item.menuItemId, item.quantity - 1)}
                          className="w-7 h-7 rounded bg-secondary flex items-center justify-center hover:bg-secondary/80"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.menuItemId, item.quantity + 1)}
                          className="w-7 h-7 rounded bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Delivery Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-foreground">Delivery Address</h2>
                <button className="text-sm text-primary font-medium">Change</button>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Home</p>
                  <p className="text-sm text-muted-foreground">{deliveryAddress}</p>
                </div>
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border rounded-xl p-4"
            >
              <h2 className="font-semibold text-foreground mb-4">Payment Method</h2>
              <div className="space-y-3">
                {paymentMethods.map(method => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={cn(
                      'w-full flex items-center gap-4 p-3 rounded-xl border transition-colors',
                      selectedPayment === method.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-secondary/50'
                    )}
                  >
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      selectedPayment === method.id ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                    )}>
                      <method.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-foreground">{method.name}</p>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                    <div className={cn(
                      'w-5 h-5 rounded-full border-2',
                      selectedPayment === method.id
                        ? 'border-primary bg-primary'
                        : 'border-muted-foreground'
                    )}>
                      {selectedPayment === method.id && (
                        <div className="w-full h-full rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-card border border-border rounded-xl p-6 sticky top-36">
              <h2 className="font-semibold text-foreground mb-4">Order Summary</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span className={deliveryFee === 0 ? 'text-success' : 'text-foreground'}>
                    {deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="text-foreground">${tax.toFixed(2)}</span>
                </div>
                <div className="h-px bg-border my-4" />
                <div className="flex justify-between text-base font-semibold">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">${total.toFixed(2)}</span>
                </div>
              </div>

              {subtotal < 25 && (
                <p className="text-xs text-muted-foreground mt-4">
                  Add ${(25 - subtotal).toFixed(2)} more for free delivery
                </p>
              )}

              <Button
                className="w-full mt-6 h-12"
                size="lg"
                onClick={handlePlaceOrder}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  `Place Order • $${total.toFixed(2)}`
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
