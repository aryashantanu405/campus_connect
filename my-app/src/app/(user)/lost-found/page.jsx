'use client';

import { useState,useEffect } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, MapPin, Plus, Upload } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { cn } from "@/lib/utils";

// Mock data
const initialItems = [
  {
    id: '1',
    user_id: 'user1',
    owner_username: 'mayank',
    image: 'https://images.pexels.com/photos/3602258/pexels-photo-3602258.jpeg',
    description: 'Black leather wallet with important cards',
    place: 'Central Library, 2nd Floor',
    date: new Date('2024-03-20'),
    type: 'lost'
  },
  {
    id: '2',
    user_id: 'user2',
    owner_username: 'shantanu',
    image: 'https://images.pexels.com/photos/1010496/pexels-photo-1010496.jpeg',
    description: 'Apple AirPods Pro with case',
    place: 'Student Center',
    date: new Date('2024-03-19'),
    type: 'found'
  },
  {
    id: '3',
    user_id: 'user3',
    owner_username: 'trinetra',
    image: 'https://images.pexels.com/photos/1042143/pexels-photo-1042143.jpeg',
    description: 'Silver wristwatch with brown leather strap',
    place: 'Engineering Block',
    date: new Date('2024-03-18'),
    type: 'lost'
  },
  {
    id: '4',
    user_id: 'user4',
    owner_username: 'aryan',
    image: 'https://images.pexels.com/photos/1161541/pexels-photo-1161541.jpeg',
    description: 'Blue backpack with laptop inside',
    place: 'Cafeteria',
    date: new Date('2024-03-17'),
    type: 'found'
  }
];


export default function LostAndFound() {
  const [items, setItems] = useState(initialItems);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [formData, setFormData] = useState({
    description: '',
    place: '',
    type: 'lost',
    image: null
  });
  const [previewImage, setPreviewImage] = useState(null);

  const fetchitems =async (initialItems)=>{
    try{
      const response =await fetch('/api/lost-found',{
        headers:{
          'Content-Type':'application/json'
        },
        method:'POST',
        body:JSON.stringify(initialItems),
      });
      if(!response.ok){
        throw new Error('Failed to fetch items');
      }
      const data = await response.json();
      console.log('Fetched items:', data);
    }
    catch(error){
      console.error('Error fetching items:', error);
    }
  }

  useEffect(() => {
    fetchitems(initialItems);
  },[initialItems]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData(prev => ({ ...prev, image: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      _id: String(items.length + 1),
      user_id: 'current_user',
      image: previewImage || 'https://images.pexels.com/photos/1010496/pexels-photo-1010496.jpeg',
      description: formData.description,
      place: formData.place,
      date: format(date, 'yyyy-MM-dd'),
      type: formData.type
    };

    setItems(prev => [newItem, ...prev]);
    setIsDialogOpen(false);
    setFormData({ description: '', place: '', type: 'lost', image: null });
    setPreviewImage(null);
    setDate(new Date());
    
    console.log('New item created:', newItem);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white p-6 lg:p-8">
      {/* Animated background circles */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 right-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Lost & Found
          </h1>
          <p className="text-gray-600 text-lg">
            Help your fellow students find their lost items or report what you've found
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <Card
              key={item.id}
              className={cn(
                "group p-6 backdrop-blur-sm bg-white/80 border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
                item.type === 'lost' 
                  ? "hover:border-red-200" 
                  : "hover:border-green-200"
              )}
            >
              <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.description}
                  fill
                  className="object-cover"
                />
                <div className={cn(
                  "absolute top-2 right-2 px-3 py-1 rounded-full text-white text-sm font-medium",
                  item.type === 'lost' ? "bg-red-500" : "bg-green-500"
                )}>
                  {item.type === 'lost' ? 'Lost' : 'Found'}
                </div>
              </div>
              
              <h3 className="text-lg text-center font-semibold mb-2 line-clamp-2">
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
              
              <Button 
                className={cn(
                  "w-full",
                    "bg-green-500 hover:bg-green-600"
                )}
              >
                Claim Item
              </Button>
            </Card>
          ))}
        </div>

        {/* Add Item Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Report Lost/Found Item</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="image">Upload Image</Label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
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
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the item..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="place">Place</Label>
                <Input
                  id="place"
                  value={formData.place}
                  onChange={(e) => setFormData(prev => ({ ...prev, place: e.target.value }))}
                  placeholder="Where was it lost/found?"
                />
              </div>

              <div className="space-y-2">
                <Label>Date</Label>
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
                  checked={formData.type === 'found'}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, type: checked ? 'found' : 'lost' }))
                  }
                />
                <Label htmlFor="type">
                  {formData.type === 'lost' ? 'Lost Item' : 'Found Item'}
                </Label>
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Submit
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}