import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Store, Bike } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { RoleCard } from '@/components/auth/RoleCard';
import { LoginForm } from '@/components/auth/LoginForm';
import { UserRole } from '@/types/auth';

const roles = [
  {
    id: 'user' as UserRole,
    title: 'Customer',
    description: 'Order delicious food from your favorite restaurants and track delivery in real-time.',
    icon: User,
    gradient: 'bg-gradient-to-br from-blue-500 to-blue-600',
  },
  {
    id: 'owner' as UserRole,
    title: 'Restaurant Owner',
    description: 'Manage your restaurant, menu items, and orders all in one powerful dashboard.',
    icon: Store,
    gradient: 'bg-gradient-to-br from-primary to-accent',
  },
  {
    id: 'delivery' as UserRole,
    title: 'Delivery Partner',
    description: 'Pick up orders and deliver happiness to customers while earning on your schedule.',
    icon: Bike,
    gradient: 'bg-gradient-to-br from-green-500 to-emerald-600',
  },
];

export default function Landing() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [showLogin, setShowLogin] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setTimeout(() => setShowLogin(true), 200);
  };

  const handleBack = () => {
    setShowLogin(false);
    setTimeout(() => setSelectedRole(null), 200);
  };

  return (
    <>
      <Helmet>
        <title>FoodSwift - Fast Food Delivery</title>
        <meta name="description" content="Order food, manage your restaurant, or deliver happiness. Join FoodSwift today." />
      </Helmet>

      <div className="min-h-screen bg-background flex">
        {/* Left Panel - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-3xl">🍕</span>
                </div>
                <h1 className="text-4xl font-bold text-white">FoodSwift</h1>
              </div>

              <h2 className="text-5xl xl:text-6xl font-bold text-white leading-tight mb-6">
                Delicious Food,<br />
                Delivered Fast.
              </h2>

              <p className="text-xl text-white/80 max-w-md leading-relaxed">
                Join thousands of customers, restaurants, and delivery partners on the fastest growing food delivery platform.
              </p>

              <div className="flex gap-8 mt-12">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white">500+</div>
                  <div className="text-white/70 text-sm mt-1">Restaurants</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white">50K+</div>
                  <div className="text-white/70 text-sm mt-1">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white">1M+</div>
                  <div className="text-white/70 text-sm mt-1">Orders Delivered</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-white/10" />
          <div className="absolute top-20 -right-20 w-64 h-64 rounded-full bg-white/5" />
        </div>

        {/* Right Panel - Auth */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <AnimatePresence mode="wait">
            {!showLogin ? (
              <motion.div
                key="role-selection"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-lg"
              >
                {/* Mobile logo */}
                <div className="lg:hidden text-center mb-8">
                  <div className="inline-flex items-center gap-2">
                    <span className="text-4xl">🍕</span>
                    <h1 className="text-3xl font-bold text-gradient">FoodSwift</h1>
                  </div>
                </div>

                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-foreground">Get Started</h2>
                  <p className="text-muted-foreground mt-2">
                    Choose how you want to use FoodSwift
                  </p>
                </div>

                <div className="grid gap-4">
                  {roles.map((role, index) => (
                    <motion.div
                      key={role.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <RoleCard
                        title={role.title}
                        description={role.description}
                        icon={role.icon}
                        gradient={role.gradient}
                        isSelected={selectedRole === role.id}
                        onClick={() => handleRoleSelect(role.id)}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <LoginForm
                key="login-form"
                role={selectedRole!}
                onBack={handleBack}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
