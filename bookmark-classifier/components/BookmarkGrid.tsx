import React from 'react';
import { Bookmark, Category } from '../lib/types';
import { Search, SortAsc, SortDesc, Tag, Folder, Clock, ExternalLink } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

interface BookmarkGridProps {
  bookmarks: Bookmark[];
  categories: Category[];
  isLoading?: boolean;
}

type SortOption = 'created' | 'updated' | 'title' | 'visitCount';
type SortDirection = 'asc' | 'desc';

const BookmarkCard = ({ bookmark }: { bookmark: Bookmark }) => {
  const favicon = bookmark.favicon || `https://www.google.com/s2/favicons?domain=${new URL(bookmark.url).hostname}`;
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <img
              src={favicon}
              alt=""
              className="w-4 h-4"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/fallback-favicon.png';
              }}
            />
            <CardTitle className="text-lg line-clamp-2">{bookmark.title}</CardTitle>
          </div>
          <Button variant="ghost" size="icon" asChild>
            <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </div>
        <CardDescription className="line-clamp-2">
          {bookmark.description || new URL(bookmark.url).hostname}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {bookmark.tags?.map(tag => (
            <Badge key={tag} variant="secondary">
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {new Date(bookmark.createdAt).toLocaleDateString()}
        </span>
        {bookmark.visitCount !== undefined && bookmark.visitCount > 0 && (
          <span>{bookmark.visitCount} visits</span>
        )}
      </CardFooter>
    </Card>
  );
};

export default function BookmarkGrid({ bookmarks, categories, isLoading = false }: BookmarkGridProps) {
  const [filter, setFilter] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [sortBy, setSortBy] = React.useState<SortOption>('created');
  const [sortDirection, setSortDirection] = React.useState<SortDirection>('desc');

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const filteredAndSortedBookmarks = React.useMemo(() => {
    let result = bookmarks;

    // Filter by search term
    if (filter) {
      result = result.filter(bookmark =>
        bookmark.title.toLowerCase().includes(filter.toLowerCase()) ||
        bookmark.url.toLowerCase().includes(filter.toLowerCase()) ||
        bookmark.tags?.some(tag => tag.toLowerCase().includes(filter.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter(bookmark =>
        bookmark.categoryIds?.includes(selectedCategory)
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'created':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'updated':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'visitCount':
          comparison = (a.visitCount || 0) - (b.visitCount || 0);
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [bookmarks, filter, selectedCategory, sortBy, sortDirection]);

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search bookmarks..."
              className="pl-9"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center gap-2">
                    <Folder className="w-4 h-4" />
                    {category.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                Sort by
                {sortDirection === 'asc' ? (
                  <SortAsc className="w-4 h-4" />
                ) : (
                  <SortDesc className="w-4 h-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => { setSortBy('created'); toggleSortDirection(); }}>
                Date Created
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSortBy('updated'); toggleSortDirection(); }}>
                Last Updated
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSortBy('title'); toggleSortDirection(); }}>
                Title
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSortBy('visitCount'); toggleSortDirection(); }}>
                Most Visited
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {filteredAndSortedBookmarks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No bookmarks found</p>
          <p className="text-sm">Try adjusting your filters or add some bookmarks</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedBookmarks.map((bookmark) => (
            <BookmarkCard key={bookmark.id} bookmark={bookmark} />
          ))}
        </div>
      )}
    </div>
  );
}