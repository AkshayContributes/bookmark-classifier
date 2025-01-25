import React, { useState, useEffect } from 'react';
import { Bookmark, Category, BookmarkContextValue, BookmarkError, BaseEntity } from '../lib/types';
import { storageAdapter } from '../lib/storage/localstorage';
import { BookmarkContext } from './BookmarkContext.constants';


export const BookmarkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [loadedBookmarks, loadedCategories] = await Promise.all([
                    storageAdapter.getBookmarks(),
                    storageAdapter.getCategories(),
                ]);
                setBookmarks(loadedBookmarks);
                setCategories(loadedCategories);
            } catch (err) {
                setError(err as BookmarkError);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const addBookmark = async (bookmark: Omit<Bookmark, keyof BaseEntity>) => {
        try {
            const newBookmark = await storageAdapter.saveBookmark(bookmark as Bookmark);
            setBookmarks((prev) => [...prev, newBookmark]);
            return newBookmark;
        } catch (err) {
            setError(err as BookmarkError);
            throw err;
        }
    };

    const updateBookmark = async (id: string, updates: Partial<Bookmark>) => {
        const updatedBookmark = await storageAdapter.saveBookmark({ ...updates, id } as Bookmark);
        setBookmarks((prev) => prev.map((b) => (b.id === id ? updatedBookmark : b)));
        return updatedBookmark;
    };

    const removeBookmark = async (id: string) => {
        await storageAdapter.deleteBookmark(id);
        setBookmarks((prev) => prev.filter((b) => b.id !== id));
    };

    const addCategory = async (category: Omit<Category, keyof BaseEntity>) => {
        const newCategory = await storageAdapter.saveCategory(category as Category);
        setCategories((prev) => [...prev, newCategory]);
        return newCategory;
    };

    const updateCategory = async (id: string, updates: Partial<Category>) => {
        const updatedCategory = await storageAdapter.saveCategory({ ...updates, id } as Category);
        setCategories((prev) => prev.map((c) => (c.id === id ? updatedCategory : c)));
        return updatedCategory;
    };

    const removeCategory = async (id: string) => {
        await storageAdapter.deleteCategory(id);
        setCategories((prev) => prev.filter((c) => c.id !== id));
    };

    const contextValue: BookmarkContextValue = {
        bookmarks,
        categories,
        isLoading,
        error,
        addBookmark,
        updateBookmark,
        removeBookmark,
        addCategory,
        updateCategory,
        removeCategory,
    };

    return <BookmarkContext.Provider value={contextValue}>{children}</BookmarkContext.Provider>;
};


