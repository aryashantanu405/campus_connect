'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, MapPin, Plus, Upload, Search, Filter, AlertCircle } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";

// Form validation schema
const itemSchema = z.object({
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  place: z.string()
    .min(3, 'Place must be at least 3 characters')
    .max(100, 'Place must be less than 100 characters'),
  type: z.enum(['lost', 'found']),
  image: z.instanceof(File, { message: "Image is required" })
    .refine((file) => ['image/jpeg', 'image/png', 'image/gif'].includes(file.type), {
      message: "Only .jpg, .jpeg, .png and .gif formats are supported",
    })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "Image must be less than 5MB",
    })
});

export default function LostAndFound() {
  const { user } = useUser();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [date, setDate] = useState(new Date());
  const [previewImage, setPreviewImage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      type: 'lost',
      description: '',
      place: ''
    },
    mode: "onChange"
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/lost-found');
      if (!response.ok) throw new Error('Failed to fetch items');
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to load items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('image', file, { shouldValidate: true });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    if (!user) {
      toast.error("Please sign in to post items.");
      return;
    }

    try {
      setIsSubmitting(true);
      const formDataToSend = new FormData();
      formDataToSend.append('description', data.description);
      formDataToSend.append('place', data.place);
      formDataToSend.append('type', data.type);
      formDataToSend.append('date', date.toISOString());
      formDataToSend.append('user_id', user.id);
      formDataToSend.append('owner_username', user.username || user.firstName);
      formDataToSend.append('image', data.image);

      const response = await fetch('/api/lost-found', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) throw new Error('Failed to post item');

      toast.success("Item posted successfully!");
      setIsDialogOpen(false);
      reset();
      setPreviewImage(null);
      setDate(new Date());
      fetchItems();
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to post item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClaim = async (item) => {
    if (!user) {
      toast.error("Please sign in to claim items.");
      return;
    }

    try {
      const response = await fetch('/api/lost-found', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item._id,
          claimed_by: user.id
        }),
      });

      if (!response.ok) throw new Error('Failed to claim item');

      toast.success("Item claimed successfully! The owner will be notified.");
      fetchItems();
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to claim item. Please try again.");
    }
  };

  const filteredItems = items
    .filter(item => 
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.place.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(item => filterType === 'all' || item.type === filterType);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white p-4 sm:p-6 lg:p-8">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 right-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Lost & Found
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Help your fellow students find their lost items or report what you've found. Together we can make a difference!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              className="pl-10"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterType === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterType('all')}
              className="flex-1 sm:flex-none"
            >
              All
            </Button>
            <Button
              variant={filterType === 'lost' ? 'default' : 'outline'}
              onClick={() => setFilterType('lost')}
              className="flex-1 sm:flex-none"
            >
              Lost
            </Button>
            <Button
              variant={filterType === 'found' ? 'default' : 'outline'}
              onClick={() => setFilterType('found')}
              className="flex-1 sm:flex-none"
            >
              Found
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[1, 2, 3].map((n) => (
              <Card key={n} className="p-4 sm:p-6 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </Card>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {filteredItems.map((item) => (
              <Card
                key={item._id}
                className={cn(
                  "group p-4 sm:p-6 backdrop-blur-sm bg-white/80 border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
                  item.type === 'lost' 
                    ? "hover:border-red-200" 
                    : "hover:border-green-200"
                )}
              >
                <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={item.image?.url || '/default_logo.jpg'}
                    alt={item.description}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className={cn(
                    "absolute top-2 right-2 px-3 py-1 rounded-full text-white text-sm font-medium",
                    item.type === 'lost' ? "bg-red-500" : "bg-green-500"
                  )}>
                    {item.type === 'lost' ? 'Lost' : 'Found'}
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                  {item.description}
                </h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">{item.place}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    <span className="text-sm">{format(new Date(item.date), 'PPP')}</span>
                  </div>
                </div>

                {item.status === 'claimed' ? (
                  <div className="text-center py-2 bg-gray-100 rounded-lg text-gray-600">
                    Item has been claimed
                  </div>
                ) : (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        className={cn(
                          "w-full",
                          item.type === 'lost' 
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-green-500 hover:bg-green-600"
                        )}
                      >
                        {item.type === 'lost' ? 'I Found This!' : 'Claim Item'}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Action</AlertDialogTitle>
                        <AlertDialogDescription>
                          {item.type === 'lost' 
                            ? "Have you found this item? The owner will be notified and can contact you."
                            : "Is this your lost item? You'll be able to contact the finder."}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleClaim(item)}>
                          Confirm
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </Card>
            ))}
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Report Lost/Found Item</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="image">
                  Upload Image <span className="text-red-500">*</span>
                </Label>
                <div className={`mt-2 flex justify-center rounded-lg border border-dashed ${errors.image ? 'border-red-500' : 'border-gray-900/25'} px-6 py-10`}>
                  <div className="text-center">
                    {previewImage ? (
                      <div className="relative w-40 h-40 mx-auto mb-4">
                        <Image
                          src={previewImage}
                          alt="Preview"
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    ) : (
                      <Upload className="mx-auto h-12 w-12 text-gray-300" />
                    )}
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 5MB</p>
                  </div>
                </div>
                {errors.image && (
                  <p className="text-sm text-red-500">{errors.image.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  className={`min-h-[100px] ${errors.description ? 'border-red-500' : ''}`}
                  placeholder="Describe the item..."
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="place">
                  Place <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="place"
                  {...register('place')}
                  className={errors.place ? 'border-red-500' : ''}
                  placeholder="Where was it lost/found?"
                />
                {errors.place && (
                  <p className="text-sm text-red-500">{errors.place.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Date <span className="text-red-500">*</span></Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="type"
                  checked={watch('type') === 'found'}
                  onCheckedChange={(checked) => 
                    setValue('type', checked ? 'found' : 'lost', { shouldValidate: true })
                  }
                />
                <Label htmlFor="type">
                  {watch('type') === 'lost' ? 'Lost Item' : 'Found Item'}
                </Label>
              </div>

              <div className="flex justify-end gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsDialogOpen(false);
                    reset();
                    setPreviewImage(null);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={isSubmitting || !isValid}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}