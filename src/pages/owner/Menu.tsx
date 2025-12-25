import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Plus, Search, Edit2, Trash2, X, Camera } from 'lucide-react';
import { PageHeader } from '@/components/owner/DashboardComponents';
import { useOwnerData } from '@/contexts/OwnerDataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { MenuItem } from '@/types/auth';
import { menuCategories } from '@/data/mockData';
import { cn } from '@/lib/utils';

const initialFormState = {
  name: '',
  description: '',
  price: 0,
  category: '',
  image: '',
  isVeg: true,
  isAvailable: true,
  restaurantId: 'rest-1',
};

export default function MenuPage() {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem, toggleItemAvailability, restaurant } = useOwnerData();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState(initialFormState);
  const [imagePreview, setImagePreview] = useState('');

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenDialog = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        image: item.image,
        isVeg: item.isVeg,
        isAvailable: item.isAvailable,
        restaurantId: item.restaurantId,
      });
      setImagePreview(item.image);
    } else {
      setEditingItem(null);
      setFormData(initialFormState);
      setImagePreview('');
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
    setFormData(initialFormState);
    setImagePreview('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData({ ...formData, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      updateMenuItem(editingItem.id, formData);
      toast({ title: 'Item Updated', description: 'Menu item has been updated successfully.' });
    } else {
      addMenuItem(formData);
      toast({ title: 'Item Added', description: 'New menu item has been added.' });
    }
    
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    deleteMenuItem(id);
    toast({ title: 'Item Deleted', description: 'Menu item has been removed.' });
  };

  return (
    <>
      <Helmet>
        <title>Menu Management - FoodSwift Owner</title>
      </Helmet>

      <PageHeader
        title="Menu Management"
        description={`Manage menu items for ${restaurant?.name || 'your restaurant'}`}
        actions={
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {menuCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                'bg-card rounded-2xl border border-border overflow-hidden',
                !item.isAvailable && 'opacity-60'
              )}
            >
              <div className="relative aspect-video">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span
                    className={cn(
                      'px-2 py-1 text-xs font-medium rounded-full',
                      item.isVeg
                        ? 'bg-success text-success-foreground'
                        : 'bg-destructive text-destructive-foreground'
                    )}
                  >
                    {item.isVeg ? 'Veg' : 'Non-Veg'}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                  </div>
                  <span className="text-lg font-bold text-primary">${item.price.toFixed(2)}</span>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {item.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Available</span>
                    <Switch
                      checked={item.isAvailable}
                      onCheckedChange={() => toggleItemAvailability(item.id)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(item)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No menu items found</p>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Image</Label>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <label className="block">
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                <Button type="button" variant="outline" className="w-full" asChild>
                  <span><Camera className="w-4 h-4 mr-2" />Upload Image</span>
                </Button>
              </label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="itemName">Name</Label>
              <Input
                id="itemName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="itemDesc">Description</Label>
              <Textarea
                id="itemDesc"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="itemPrice">Price ($)</Label>
                <Input
                  id="itemPrice"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {menuCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label>Vegetarian</Label>
              <Switch
                checked={formData.isVeg}
                onCheckedChange={(checked) => setFormData({ ...formData, isVeg: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Available</Label>
              <Switch
                checked={formData.isAvailable}
                onCheckedChange={(checked) => setFormData({ ...formData, isAvailable: checked })}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                {editingItem ? 'Update' : 'Add'} Item
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
