import { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Camera, Save, MapPin, Phone, Clock } from 'lucide-react';
import { PageHeader } from '@/components/owner/DashboardComponents';
import { useOwnerData } from '@/contexts/OwnerDataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

export default function RestaurantPage() {
  const { restaurant, updateRestaurant, toggleRestaurantOpen } = useOwnerData();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState(restaurant?.image || '');
  const [formData, setFormData] = useState({
    name: restaurant?.name || '',
    description: restaurant?.description || '',
    cuisine: restaurant?.cuisine || '',
    address: restaurant?.address || '',
    phone: restaurant?.phone || '',
    deliveryTime: restaurant?.deliveryTime || '',
    minOrder: restaurant?.minOrder || 0,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateRestaurant({
      ...formData,
      image: imagePreview,
    });
    toast({
      title: 'Changes Saved',
      description: 'Your restaurant details have been updated.',
    });
  };

  return (
    <>
      <Helmet>
        <title>Restaurant Settings - FoodSwift Owner</title>
      </Helmet>

      <PageHeader
        title="Restaurant Settings"
        description="Manage your restaurant details and settings"
        actions={
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-card rounded-2xl border border-border p-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-6">Basic Information</h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Restaurant Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter restaurant name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your restaurant"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cuisine">Cuisine Type</Label>
                <Input
                  id="cuisine"
                  value={formData.cuisine}
                  onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                  placeholder="e.g. Indian, Italian"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 234 567 8900"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Full address"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deliveryTime">Delivery Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="deliveryTime"
                    value={formData.deliveryTime}
                    onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                    placeholder="e.g. 25-35 min"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="minOrder">Minimum Order ($)</Label>
                <Input
                  id="minOrder"
                  type="number"
                  value={formData.minOrder}
                  onChange={(e) => setFormData({ ...formData, minOrder: Number(e.target.value) })}
                  placeholder="15"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Image Upload */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl border border-border p-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">Restaurant Image</h2>
            <div className="relative aspect-video rounded-xl overflow-hidden bg-muted mb-4">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Restaurant"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Camera className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
            </div>
            <label className="block">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <Button variant="outline" className="w-full" asChild>
                <span>
                  <Camera className="w-4 h-4 mr-2" />
                  Upload Image
                </span>
              </Button>
            </label>
          </motion.div>

          {/* Status Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl border border-border p-6"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4">Restaurant Status</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Accept Orders</p>
                <p className="text-sm text-muted-foreground">
                  {restaurant?.isOpen ? 'Your restaurant is open' : 'Your restaurant is closed'}
                </p>
              </div>
              <Switch
                checked={restaurant?.isOpen}
                onCheckedChange={toggleRestaurantOpen}
              />
            </div>
          </motion.div>

          {/* Stats Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-primary rounded-2xl p-6 text-primary-foreground"
          >
            <h2 className="text-lg font-semibold mb-4">Restaurant Rating</h2>
            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold">{restaurant?.rating || 4.5}</span>
              <span className="text-2xl">⭐</span>
            </div>
            <p className="text-sm opacity-80 mt-2">Based on customer reviews</p>
          </motion.div>
        </div>
      </div>
    </>
  );
}
