"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
app.use((0, cors_1.default)()); // Enable CORS for all routes
app.use(express_1.default.json()); // Middleware to parse JSON bodies
let books = [];
const priorityOrder = { High: 1, Medium: 2, Low: 3 };
// GET /api/hello - Basic health check or welcome endpoint
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Backend connected' });
});
// POST /api/books - Add a new book
app.post('/api/books', (req, res) => {
    const { title, author, priority } = req.body;
    if (!title || !priority) {
        return res.status(400).json({ error: 'Title and priority are required' });
    }
    if (!['High', 'Medium', 'Low'].includes(priority)) {
        return res.status(400).json({ error: 'Priority must be High, Medium, or Low' });
    }
    const newBook = {
        id: Date.now().toString(), // Simple unique ID
        title,
        author,
        priority,
    };
    books.push(newBook);
    return res.status(201).json(newBook);
});
// GET /api/books - Get all books, sorted by priority
app.get('/api/books', (req, res) => {
    const sortedBooks = [...books].sort((a, b) => {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    return res.status(200).json(sortedBooks);
});
app.listen(port, () => {
    console.log(`Backend server is running on http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map