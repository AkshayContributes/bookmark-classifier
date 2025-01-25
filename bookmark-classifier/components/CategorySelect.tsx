import React from 'react';
import { Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { useBookmarkContext } from '../context/BookmarkContext.constants';

export function CategorySelect({ value, onValueChange }: {
  value: string;
  onValueChange: (value: string) => void;
}) {
  const { categories, addCategory } = useBookmarkContext();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [newCategoryName, setNewCategoryName] = React.useState('');

  const handleAddCategory = async () => {
    if (newCategoryName.trim()) {
      const newCategory = await addCategory({
        name: newCategoryName,
        order: categories.length,
      });
      setNewCategoryName('');
      setIsDialogOpen(false);
      onValueChange(newCategory.id);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      await handleAddCategory();
    }
  };

  return (
    <>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <div className="flex items-center justify-between px-2 py-2">
            <Button
              variant="ghost"
              className="w-full flex items-center gap-2"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="h-4 w-4" />
              New Category
            </Button>
          </div>
          {categories.map(category => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCategory}>
                Add Category
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}