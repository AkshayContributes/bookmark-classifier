import React from 'react';
import { Bookmark, Category } from '../lib/types';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { CategorySelect } from './CategorySelect';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Label } from "../components/ui/label";

interface BookmarkFormProps {
  bookmark?: Partial<Bookmark>;
  categories: Category[];
  onSubmit: (data: Partial<Bookmark>) => void;
  onCancel: () => void;
}

export default function BookmarkForm({ 
  bookmark, 
  categories, 
  onSubmit, 
  onCancel 
}: BookmarkFormProps) {
  const [formData, setFormData] = React.useState<Partial<Bookmark>>({
    title: '',
    url: '',
    description: '',
    categoryIds: [],
    tags: [],
    ...bookmark,
  });

  const [tagInput, setTagInput] = React.useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    const categoryId = value;
    setFormData(prev => ({
      ...prev,
      categoryIds: prev.categoryIds?.includes(categoryId)
        ? prev.categoryIds.filter(id => id !== categoryId)
        : [...(prev.categoryIds || []), categoryId],
    }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (tagInput.trim()) {
        setFormData(prev => ({
          ...prev,
          tags: [...new Set([...(prev.tags || []), tagInput.trim()])]
        }));
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          name="url"
          type="url"
          required
          placeholder="https://example.com"
          value={formData.url}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          required
          placeholder="Bookmark title"
          value={formData.title}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Optional description"
          value={formData.description}
          onChange={handleChange}
          className="resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <CategorySelect
          value={formData.categoryIds?.[0] || ''}
          onValueChange={handleCategoryChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.tags?.map(tag => (
            <span
              key={tag}
              className="bg-gray-100 px-2 py-1 rounded-full text-sm flex items-center gap-1"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <Input
          id="tags"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
          placeholder="Add tags (press Enter or comma to add)"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {bookmark ? 'Update' : 'Create'} Bookmark
        </Button>
      </div>
    </form>
  );
}