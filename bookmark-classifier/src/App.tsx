import BookmarksPage  from '../components/BookmarksPage';
import './App.css'
import { BookmarkProvider } from '../context/BookmarkContext';

function App() {
  return (
    <BookmarkProvider>
      <div className="min-h-screen bg-background">
        <BookmarksPage />
      </div>
    </BookmarkProvider>
  )
  
}

export default App
