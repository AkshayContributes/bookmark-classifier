// src/lib/types/index.ts

// Base entity interface for common fields
export interface BaseEntity {
    id: string
    createdAt: string
    updatedAt: string
  }
  
  // Category definition
  export interface Category extends BaseEntity {
    name: string
    description?: string
    color?: string
    icon?: string
    order: number
    parentId?: string // For future nested categories
  }
  
  // Bookmark definition
  export interface Bookmark extends BaseEntity {
    url: string
    title: string
    description?: string
    favicon?: string
    categoryIds: string[]
    metadata?: BookmarkMetadata
    tags?: string[]
    isArchived?: boolean
    visitCount?: number
  }
  
  // Rich metadata for bookmarks
  export interface BookmarkMetadata {
    siteName?: string
    author?: string
    publishedAt?: string
    readingTime?: number
    thumbnail?: string
    language?: string
  }
  
  // Search/Filter related types
  export interface BookmarkFilters {
    query?: string
    categoryId?: string
    tags?: string[]
    dateRange?: DateRange
    isArchived?: boolean
  }
  
  export interface DateRange {
    start?: string
    end?: string
  }
  
  // Storage related types
  export interface StorageAdapter {
    getBookmarks(): Promise<Bookmark[]>
    getBookmark(id: string): Promise<Bookmark | null>
    saveBookmark(bookmark: Bookmark): Promise<Bookmark>
    deleteBookmark(id: string): Promise<void>
    
    getCategories(): Promise<Category[]>
    getCategory(id: string): Promise<Category | null>
    saveCategory(category: Category): Promise<Category>
    deleteCategory(id: string): Promise<void>
  }
  
  // Context related types
  export interface BookmarkContextState {
    bookmarks: Bookmark[]
    categories: Category[]
    isLoading: boolean
    error: Error | null
  }
  
  export interface BookmarkContextActions {
    addBookmark: (bookmark: Omit<Bookmark, keyof BaseEntity>) => Promise<Bookmark>
    updateBookmark: (id: string, bookmark: Partial<Bookmark>) => Promise<Bookmark>
    removeBookmark: (id: string) => Promise<void>
    addCategory: (category: Omit<Category, keyof BaseEntity>) => Promise<Category>
    updateCategory: (id: string, category: Partial<Category>) => Promise<Category>
    removeCategory: (id: string) => Promise<void>
  }
  
  export interface BookmarkContextValue extends BookmarkContextState, BookmarkContextActions {}
  
  // Error handling
  export class BookmarkError extends Error {
    constructor(
      message: string,
      public code: string,
      public originalError?: Error
    ) {
      super(message)
      this.name = 'BookmarkError'
    }
  }
  
  // Utility types
  export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }
  export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>