import * as React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "../components/ui/dialog";
  import { Button } from "../components/ui/button";
  import { Plus } from "lucide-react";
  import BookmarkForm from "./BookmarkForm";
  import { Bookmark, Category } from "../lib/types";
  
  interface AddBookmarkDialogProps {
    categories: Category[];
    onSubmit: (data: Partial<Bookmark>) => void;
  }
  
  export function AddBookmarkDialog({ categories, onSubmit }: AddBookmarkDialogProps) {
    const [open, setOpen] = React.useState(false);
  
    const handleSubmit = (data: Partial<Bookmark>) => {
      onSubmit(data);
      setOpen(false);
    };
  
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Bookmark
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New Bookmark</DialogTitle>
          </DialogHeader>
          <BookmarkForm
            categories={categories}
            onSubmit={handleSubmit}
            onCancel={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    );
  }