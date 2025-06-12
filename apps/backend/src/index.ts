import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 8000;

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies

interface Book {
  id: string;
  title: string;
  author: string;
  priority: 'High' | 'Medium' | 'Low';
}

let books: Book[] = [];
const priorityOrder = { High: 1, Medium: 2, Low: 3 };

// GET /api/hello - Basic health check or welcome endpoint
app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Backend connected' });
});

// POST /api/books - Add a new book
app.post('/api/books', (req: Request, res: Response) => {
  const { title, author, priority } = req.body;

  if (!title || !priority) {
    return res.status(400).json({ error: 'Title and priority are required' });
  }

  if (!['High', 'Medium', 'Low'].includes(priority)) {
    return res.status(400).json({ error: 'Priority must be High, Medium, or Low' });
  }

  const newBook: Book = {
    id: Date.now().toString(), // Simple unique ID
    title,
    author,
    priority,
  };
  books.push(newBook);
  return res.status(201).json(newBook);
});

// GET /api/books - Get all books, sorted by priority
app.get('/api/books', (req: Request, res: Response) => {
  const sortedBooks = [...books].sort((a, b) => {
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
  return res.status(200).json(sortedBooks);
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
