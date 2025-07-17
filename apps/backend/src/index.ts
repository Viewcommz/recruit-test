import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { DatabaseService } from "./services/database";

// 환경변수 로드
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// 데이터베이스 초기화
const db = DatabaseService.getInstance();
db.init();

// 미들웨어 설정
app.use(helmet());
app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Accept"],
        credentials: true,
    })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// 헬스체크 엔드포인트
app.get("/api/health", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.json({
        status: "ok",
        message: "BookShelf API Server is running",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
    });
});

// 기본 API 정보
app.get("/api", (req, res) => {
    res.json({
        name: "BookShelf API",
        version: "1.0.0",
        description: "1시간 AI 개발 테스트용 백엔드",
        endpoints: {
            health: "/api/health",
            info: "/api",
            books: "/api/books",
            userBooks: "/api/user-books",
        },
    });
});

// Books API with sorting and filtering
app.get("/api/books", (req, res) => {
    try {
        let books = db.getAllBooks();

        // 필터링
        const { author, category, search, language } = req.query;

        if (search) {
            const searchTerm = (search as string).toLowerCase();
            books = books.filter(book =>
                book.title.toLowerCase().includes(searchTerm) ||
                book.author.toLowerCase().includes(searchTerm) ||
                book.description?.toLowerCase().includes(searchTerm)
            );
        }

        if (author) {
            books = books.filter(book =>
                book.author.toLowerCase().includes((author as string).toLowerCase())
            );
        }

        if (category) {
            books = books.filter(book =>
                book.categories?.some(cat =>
                    cat.toLowerCase().includes((category as string).toLowerCase())
                )
            );
        }

        if (language) {
            books = books.filter(book => book.language === language);
        }

        // 정렬
        const { sortBy = 'createdAt', order = 'desc' } = req.query;
        const sortOrder = order === 'asc' ? 1 : -1;

        books.sort((a, b) => {
            let aValue: any, bValue: any;

            switch (sortBy) {
                case 'title':
                    aValue = a.title.toLowerCase();
                    bValue = b.title.toLowerCase();
                    break;
                case 'author':
                    aValue = a.author.toLowerCase();
                    bValue = b.author.toLowerCase();
                    break;
                case 'publishedDate':
                    aValue = new Date(a.publishedDate || 0);
                    bValue = new Date(b.publishedDate || 0);
                    break;
                case 'pageCount':
                    aValue = a.pageCount || 0;
                    bValue = b.pageCount || 0;
                    break;
                case 'createdAt':
                default:
                    // createdAt은 데이터베이스에서 가져올 때 없으므로 ID 기반으로 정렬
                    aValue = a.id;
                    bValue = b.id;
                    break;
            }

            if (aValue < bValue) return -1 * sortOrder;
            if (aValue > bValue) return 1 * sortOrder;
            return 0;
        });

        // 페이지네이션
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedBooks = books.slice(startIndex, endIndex);

        res.json({
            success: true,
            data: paginatedBooks,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(books.length / limit),
                totalItems: books.length,
                itemsPerPage: limit,
                hasNext: endIndex < books.length,
                hasPrev: page > 1
            },
            filters: {
                search: search || null,
                author: author || null,
                category: category || null,
                language: language || null,
                sortBy: sortBy as string,
                order: order as string
            }
        });
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch books",
        });
    }
});

app.get("/api/books/:id", (req, res) => {
    try {
        const book = db.getBookById(req.params.id);
        if (!book) {
            return res.status(404).json({
                success: false,
                error: "Book not found",
            });
        }
        res.json({
            success: true,
            data: book,
        });
    } catch (error) {
        console.error("Error fetching book:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch book",
        });
    }
});

app.post("/api/books", (req, res) => {
    try {
        const book = db.addBook(req.body);
        res.status(201).json({
            success: true,
            data: book,
        });
    } catch (error) {
        console.error("Error adding book:", error);
        res.status(500).json({
            success: false,
            error: "Failed to add book",
        });
    }
});

// User Books API
app.get("/api/user-books", (req, res) => {
    try {
        const userBooks = db.getUserBooks();
        res.json({
            success: true,
            data: userBooks,
            count: userBooks.length,
        });
    } catch (error) {
        console.error("Error fetching user books:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch user books",
        });
    }
});

app.get("/api/user-books/:id", (req, res) => {
    try {
        const userBook = db.getUserBookById(req.params.id);
        if (!userBook) {
            return res.status(404).json({
                success: false,
                error: "User book not found",
            });
        }
        res.json({
            success: true,
            data: userBook,
        });
    } catch (error) {
        console.error("Error fetching user book:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch user book",
        });
    }
});

app.post("/api/user-books", (req, res) => {
    try {
        const userBook = db.addUserBook(req.body);
        res.status(201).json({
            success: true,
            data: userBook,
        });
    } catch (error) {
        console.error("Error adding user book:", error);
        res.status(500).json({
            success: false,
            error: "Failed to add user book",
        });
    }
});

app.put("/api/user-books/:id", (req, res) => {
    try {
        const userBook = db.updateUserBook(req.params.id, req.body);
        if (!userBook) {
            return res.status(404).json({
                success: false,
                error: "User book not found",
            });
        }
        res.json({
            success: true,
            data: userBook,
        });
    } catch (error) {
        console.error("Error updating user book:", error);
        res.status(500).json({
            success: false,
            error: "Failed to update user book",
        });
    }
});

// 404 핸들러
app.use("*", (req, res) => {
    res.status(404).json({
        success: false,
        error: "Route not found",
        message:
            "이 테스트에서는 프론트엔드 구현에 집중하세요. localStorage를 사용하세요.",
    });
});

// 에러 핸들러
app.use(
    (
        err: Error,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        console.error("Error:", err);
        res.status(500).json({
            success: false,
            error:
                process.env.NODE_ENV === "production"
                    ? "Internal server error"
                    : err.message,
        });
    }
);

// 서버 시작
app.listen(PORT, () => {
    console.log(`🚀 BookShelf API Server running on port ${PORT}`);
    console.log(`📚 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});
