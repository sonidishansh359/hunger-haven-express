import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, MapPin, Clock, Star, TrendingUp, ChevronRight, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserData } from '@/contexts/UserDataContext';
import { useAuth } from '@/contexts/AuthContext';

const categories = [
  { id: 1, name: 'Pizza', icon: '🍕', color: 'bg-orange-100 dark:bg-orange-900/20' },
  { id: 2, name: 'Burgers', icon: '🍔', color: 'bg-yellow-100 dark:bg-yellow-900/20' },
  { id: 3, name: 'Sushi', icon: '🍣', color: 'bg-red-100 dark:bg-red-900/20' },
  { id: 4, name: 'Indian', icon: '🍛', color: 'bg-amber-100 dark:bg-amber-900/20' },
  { id: 5, name: 'Desserts', icon: '🍰', color: 'bg-pink-100 dark:bg-pink-900/20' },
  { id: 6, name: 'Drinks', icon: '🥤', color: 'bg-blue-100 dark:bg-blue-900/20' },
];

export default function UserDashboard() {
  const { restaurants, activeOrder } = useUserData();
  const { user } = useAuth();

  return (
    <div className="pb-20 lg:pb-8">
      {/* Header */}
      <div className="bg-gradient-primary px-4 lg:px-8 py-8 lg:py-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-primary-foreground/80 mb-1">Good afternoon,</p>
            <h1 className="text-2xl lg:text-3xl font-bold text-primary-foreground mb-6">
              {user?.name || 'Welcome'} 👋
            </h1>

            {/* Search */}
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for restaurants or dishes..."
                className="w-full h-12 pl-12 pr-4 bg-card rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 mt-4 text-primary-foreground/80">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Delivering to: 123 Main Street, Food City</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 lg:px-8 -mt-4">
        {/* Active Order Banner */}
        {activeOrder && activeOrder.status !== 'delivered' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Link to="/user/tracking">
              <div className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Order in Progress</p>
                      <p className="text-sm text-muted-foreground">
                        {activeOrder.restaurantName} • {activeOrder.status.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Track Order
                  </Button>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Categories */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Categories</h2>
            <Link to="/user/restaurants" className="text-sm text-primary font-medium">
              See All
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {categories.map(category => (
              <Link
                key={category.id}
                to={`/user/restaurants?category=${category.name}`}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-xl transition-transform hover:scale-105',
                  category.color
                )}
              >
                <span className="text-2xl">{category.icon}</span>
                <span className="text-sm font-medium text-foreground">{category.name}</span>
              </Link>
            ))}
          </div>
        </motion.section>

        {/* Featured Restaurants */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Popular Near You</h2>
            </div>
            <Link to="/user/restaurants" className="text-sm text-primary font-medium">
              See All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {restaurants.slice(0, 6).map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Link to={`/user/restaurant/${restaurant.id}`}>
                  <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-36">
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                      />
                      {restaurant.isOpen && (
                        <span className="absolute top-2 left-2 px-2 py-1 bg-success text-success-foreground text-xs font-medium rounded-full">
                          Open
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground mb-1">{restaurant.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{restaurant.cuisine}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-foreground">
                          <Star className="w-4 h-4 text-warning fill-warning" />
                          {restaurant.rating}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {restaurant.deliveryTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* All Restaurants */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Utensils className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">All Restaurants</h2>
            </div>
          </div>
          <div className="space-y-3">
            {restaurants.map(restaurant => (
              <Link key={restaurant.id} to={`/user/restaurant/${restaurant.id}`}>
                <div className="bg-card border border-border rounded-xl p-4 flex gap-4 hover:shadow-md transition-shadow">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{restaurant.name}</h3>
                        <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
                      </div>
                      <span className={cn(
                        'px-2 py-1 text-xs font-medium rounded-full',
                        restaurant.isOpen
                          ? 'bg-success/10 text-success'
                          : 'bg-muted text-muted-foreground'
                      )}>
                        {restaurant.isOpen ? 'Open' : 'Closed'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="flex items-center gap-1 text-foreground">
                        <Star className="w-4 h-4 text-warning fill-warning" />
                        {restaurant.rating}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {restaurant.deliveryTime}
                      </span>
                      <span className="text-muted-foreground">
                        Min ${restaurant.minOrder}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
