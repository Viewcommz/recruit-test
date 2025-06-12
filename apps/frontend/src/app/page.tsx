"use client"; // Required for Next.js App Router components using hooks

import React, { useState, useEffect, FormEvent } from 'react';

interface Book {
  id: string;
  title: string;
  author: string;
  priority: 'High' | 'Medium' | 'Low';
}

const API_URL = 'http://localhost:8000/api';

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch books from backend
  const fetchBooks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/books`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBooks(data);
    } catch (e) {
      if (e instanceof Error) {
        setError(`Failed to fetch books: ${e.message}`);
      } else {
        setError('Failed to fetch books: An unknown error occurred');
      }
      console.error("Fetch error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch books on component mount
  useEffect(() => {
    fetchBooks();
  }, []);

  // Handle form submission
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!title.trim()) {
        alert("Title cannot be empty.");
        setIsLoading(false);
        return;
    }

    try {
      const response = await fetch(`${API_URL}/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, author, priority }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // Clear form and refetch books
      setTitle('');
      setAuthor('');
      setPriority('Medium');
      fetchBooks(); // Refetch to update the list
    } catch (e) {
      if (e instanceof Error) {
        setError(`Failed to add book: ${e.message}`);
      } else {
        setError('Failed to add book: An unknown error occurred');
      }
      console.error("Submit error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  // Basic styling
  const styles = {
    container: { fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px' },
    form: { marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' },
    inputGroup: { marginBottom: '10px' },
    label: { display: 'block', marginBottom: '5px' },
    input: { width: '100%', padding: '8px', boxSizing: 'border-box' as 'border-box' },
    select: { width: '100%', padding: '8px', boxSizing: 'border-box' as 'border-box' },
    button: { padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    bookList: { listStyleType: 'none', padding: 0 },
    bookItem: { border: '1px solid #eee', padding: '10px', marginBottom: '10px', borderRadius: '5px', display: 'flex', justifyContent: 'space-between' },
    priorityHigh: { borderLeft: '5px solid red' },
    priorityMedium: { borderLeft: '5px solid orange' },
    priorityLow: { borderLeft: '5px solid green' },
    error: { color: 'red', marginBottom: '10px'},
    loading: { color: 'blue', marginBottom: '10px'},
  };

  return (
    <div style={styles.container}>
      <h1>My Reading List</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Add New Book</h2>
        <div style={styles.inputGroup}>
          <label htmlFor="title" style={styles.label}>Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="author" style={styles.label}>Author:</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="priority" style={styles.label}>Priority:</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'High' | 'Medium' | 'Low')}
            style={styles.select}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <button type="submit" style={styles.button} disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Book'}
        </button>
      </form>

      {error && <p style={styles.error}>Error: {error}</p>}

      <h2>Books to Read</h2>
      {isLoading && books.length === 0 && <p style={styles.loading}>Loading books...</p>}
      {books.length === 0 && !isLoading && <p>No books yet. Add one above!</p>}

      <ul style={styles.bookList}>
        {books.map((book) => (
          <li
            key={book.id}
            style={{
              ...styles.bookItem,
              ...(book.priority === 'High' ? styles.priorityHigh : {}),
              ...(book.priority === 'Medium' ? styles.priorityMedium : {}),
              ...(book.priority === 'Low' ? styles.priorityLow : {}),
            }}
          >
            <div>
              <h3>{book.title}</h3>
              <p>{book.author || 'N/A'}</p>
            </div>
            <span>Priority: {book.priority}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
