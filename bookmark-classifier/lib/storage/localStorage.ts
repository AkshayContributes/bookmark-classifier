// src/lib/storage/localStorage.ts

import { 
    StorageAdapter, 
    Bookmark, 
    Category, 
    BookmarkError,
    BaseEntity 
  } from '../types'
  
  const STORAGE_KEYS = {
    BOOKMARKS: 'bookmarks',
    CATEGORIES: 'categories',
  } as const
  
  class LocalStorageAdapter implements StorageAdapter {
    private async getItem<T>(key: string): Promise<T[]> {
      try {
        const data = localStorage.getItem(key)
        return data ? JSON.parse(data) : []
      } catch (error) {
        throw new BookmarkError(
          `Failed to retrieve data from localStorage: ${key}`,
          'STORAGE_READ_ERROR',
          error instanceof Error ? error : undefined
        )
      }
    }
  
    private async setItem<T>(key: string, value: T[]): Promise<void> {
      try {
        localStorage.setItem(key, JSON.stringify(value))
      } catch (error) {
        throw new BookmarkError(
          `Failed to save data to localStorage: ${key}`,
          'STORAGE_WRITE_ERROR',
          error instanceof Error ? error : undefined
        )
      }
    }
  
    private generateId(): string {
      return crypto.randomUUID()
    }
  
    private addBaseFields<T extends BaseEntity>(data: Omit<T, keyof BaseEntity>): T {
      const now = new Date().toISOString()
      return {
        ...data,
        id: this.generateId(),
        createdAt: now,
        updatedAt: now,
      } as T
    }
  
    // Bookmark methods
    async getBookmarks(): Promise<Bookmark[]> {
      return this.getItem<Bookmark>(STORAGE_KEYS.BOOKMARKS)
    }
  
    async getBookmark(id: string): Promise<Bookmark | null> {
      const bookmarks = await this.getBookmarks()
      return bookmarks.find(b => b.id === id) || null
    }
  
    async saveBookmark(bookmark: Bookmark): Promise<Bookmark> {
      const bookmarks = await this.getBookmarks()
      const existingIndex = bookmarks.findIndex(b => b.id === bookmark.id)
  
      if (existingIndex >= 0) {
        // Update existing bookmark
        const updatedBookmark = {
          ...bookmark,
          updatedAt: new Date().toISOString()
        }
        bookmarks[existingIndex] = updatedBookmark
        await this.setItem(STORAGE_KEYS.BOOKMARKS, bookmarks)
        return updatedBookmark
      } else {
        // Add new bookmark
        const newBookmark = this.addBaseFields<Bookmark>(bookmark)
        bookmarks.push(newBookmark)
        await this.setItem(STORAGE_KEYS.BOOKMARKS, bookmarks)
        return newBookmark
      }
    }
  
    async deleteBookmark(id: string): Promise<void> {
      const bookmarks = await this.getBookmarks()
      const filteredBookmarks = bookmarks.filter(b => b.id !== id)
      
      if (filteredBookmarks.length === bookmarks.length) {
        throw new BookmarkError(
          `Bookmark not found: ${id}`,
          'BOOKMARK_NOT_FOUND'
        )
      }
  
      await this.setItem(STORAGE_KEYS.BOOKMARKS, filteredBookmarks)
    }
  
    // Category methods
    async getCategories(): Promise<Category[]> {
      return this.getItem<Category>(STORAGE_KEYS.CATEGORIES)
    }
  
    async getCategory(id: string): Promise<Category | null> {
      const categories = await this.getCategories()
      return categories.find(c => c.id === id) || null
    }
  
    async saveCategory(category: Category): Promise<Category> {
      const categories = await this.getCategories()
      const existingIndex = categories.findIndex(c => c.id === category.id)
  
      if (existingIndex >= 0) {
        // Update existing category
        const updatedCategory = {
          ...category,
          updatedAt: new Date().toISOString()
        }
        categories[existingIndex] = updatedCategory
        await this.setItem(STORAGE_KEYS.CATEGORIES, categories)
        return updatedCategory
      } else {
        // Add new category
        const newCategory = this.addBaseFields<Category>(category)
        categories.push(newCategory)
        await this.setItem(STORAGE_KEYS.CATEGORIES, categories)
        return newCategory
      }
    }
  
    async deleteCategory(id: string): Promise<void> {
      const categories = await this.getCategories()
      const bookmarks = await this.getBookmarks()
  
      // Check if category has bookmarks
      const hasBookmarks = bookmarks.some(b => b.categoryId === id)
      if (hasBookmarks) {
        throw new BookmarkError(
          `Cannot delete category with existing bookmarks: ${id}`,
          'CATEGORY_HAS_BOOKMARKS'
        )
      }
  
      const filteredCategories = categories.filter(c => c.id !== id)
      
      if (filteredCategories.length === categories.length) {
        throw new BookmarkError(
          `Category not found: ${id}`,
          'CATEGORY_NOT_FOUND'
        )
      }
  
      await this.setItem(STORAGE_KEYS.CATEGORIES, filteredCategories)
    }
  }
  
  // Create and export a singleton instance
  export const storageAdapter = new LocalStorageAdapter()