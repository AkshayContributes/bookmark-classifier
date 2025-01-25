import BookmarkGrid from './BookmarkGrid';
import { AddBookmarkDialog } from './AddBookmarkDialog';
import { useBookmarkContext } from '../context/BookmarkContext.constants';
import { Bookmark } from '../lib/types';

export default function BookmarksPage() {
  const { bookmarks, categories, isLoading, addBookmark } = useBookmarkContext();

  const handleAddBookmark = async (data: Partial<Bookmark>) => {
    try {
      if (!data.url) {
        throw new Error('URL is required');
      }

      if(!data.title) {
        throw new Error('Title is required');
      }
      
      const newBookmark = {
        url: data.url,
        title: data.title,
        description: data.description || '',
        categoryIds: data.categoryIds || [],
        tags: data.tags || []
      };
      
      await addBookmark(newBookmark);
      // You might want to add success notification here
    } catch (error) {
      // Handle error here
      console.error('Failed to add bookmark:', error);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Bookmarks</h1>
        <AddBookmarkDialog 
          categories={categories} 
          onSubmit={handleAddBookmark} 
        />
      </div>
      
      <BookmarkGrid 
        bookmarks={bookmarks} 
        categories={categories}
        isLoading={isLoading}
      />
    </div>
  );
}