"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { categories } from "@/data";
import { Trash } from "lucide-react";
import ButtonSpinner from "../_components/ButtonSpinner";

const timeRanges = [
  "7:00 AM - 7:00PM",
  "7:00 AM - 5:00PM",
  "8:00 AM - 8:00PM",
  "9:00 AM - 9:00PM",
  "9:00 AM - 12:00 PM",
  "12:00 PM - 3:00 PM",
  "3:00 PM - 6:00 PM",
  "6:00 PM - 9:00 PM",
];

function ServiceForm({ service, setService, type, handleSubmit }) {
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setService((prevService) => ({
      ...prevService,
      [id]: value,
    }));
  };

  const handleCategoryChange = (value) => {
    setService((prevService) => ({
      ...prevService,
      category: value,
    }));
  };

  const handleTimeRangeChange = (value) => {
    setService((prevService) => ({
      ...prevService,
      available: value,
    }));
  };

  const handleUploadPhotos = (e) => {
    const newPhotos = Array.from(e.target.files);
    setService((prevService) => ({
      ...prevService,
      photos: [...prevService.photos, ...newPhotos],
    }));
  };

  const handleRemovePhoto = (indexToRemove) => {
    setService((prevService) => ({
      ...prevService,
      photos: prevService.photos.filter((_, index) => index !== indexToRemove),
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await handleSubmit(e);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-12 px-4 md:px-6">
      <h1 className="text-2xl font-bold mb-6">
        {type === "create" ? "Create your Service" : "Edit your Service"}
      </h1>
      <form className="space-y-6" onSubmit={onSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="title">Name of Service</Label>
            <Input
              id="title"
              placeholder="Enter service name"
              value={service.title || ""}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              id="category"
              value={service.category || ""}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="address">User Address</Label>
          <Input
            id="address"
            placeholder="Enter your address"
            value={service.address || ""}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="available">Available Time Range</Label>
            <Select
              id="available"
              value={service.available || ""}
              onValueChange={handleTimeRangeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                {timeRanges.map((timeRange) => (
                  <SelectItem key={timeRange} value={timeRange}>
                    {timeRange}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="contact">Contact Info</Label>
            <Input
              id="contact"
              type="tel"
              placeholder="Enter your phone number"
              value={service.contact || ""}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div>
          <Label htmlFor="description">Description of Service</Label>
          <Textarea
            id="description"
            placeholder="Describe your service"
            className="min-h-[100px]"
            value={service.description || ""}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
  <Label htmlFor="image">Image Upload</Label>
  <Input
    id="image"
    type="file"
    accept="image/*"
    multiple
    onChange={handleUploadPhotos}
    required
  />
</div>
{service.photos && service.photos.length > 0 && (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
    {service.photos.map((photo, index) => (
      <div key={index} className="relative w-40 h-40">
        <img
          src={photo instanceof File ? URL.createObjectURL(photo) : photo}
          alt="service"
          className="object-cover w-full h-full rounded-md"
        />
        <Button
          type="button"
          className="absolute top-1 right-1 bg-red-500 text-white p-3 rounded-full hover:bg-red-700"
          onClick={() => handleRemovePhoto(index)}
        >
          <Trash className="w-[15px]" />
        </Button>
      </div>
    ))}
  </div>
)}

        <Button type="submit" className="w-full">
          {loading && <ButtonSpinner />}
          {type === "create" ? "Create" : "Update"}
        </Button>
      </form>
    </div>
  );
}

export default ServiceForm;
