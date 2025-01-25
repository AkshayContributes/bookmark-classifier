import { createContext, useContext } from 'react';
import {  BookmarkContextValue } from '../lib/types';


export const BookmarkContext = createContext<BookmarkContextValue | undefined>(undefined);

export const useBookmarkContext = () => {
    const context = useContext(BookmarkContext);
    if (!context) {
        throw new Error('useBookmarkContext must be used within a BookmarkProvider');
    }
    return context;
};