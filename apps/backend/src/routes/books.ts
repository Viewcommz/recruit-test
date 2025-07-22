import express from "express";
import { DatabaseService } from "../services/database";
import { BookSchema, ApiResponse, Book } from "@bookshelf/shared";
import { z } from "zod";

const router = express.Router();
const db = DatabaseService.getInstance();

// 책 정렬 함수
function sortBooks(books: Book[], sortBy: string, order: string): Book[] {
    return books.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortBy) {
            case 'title':
                aValue = a.title.toLowerCase();
                bValue = b.title.toLowerCase();
                break;
            case 'author':
                aValue = a.author.toLowerCase();
                bValue = b.author.toLowerCase();
                break;
            case 'pageCount':
                aValue = a.pageCount || 0;
                bValue = b.pageCount || 0;
                break;
            case 'publishedDate':
                aValue = new Date(a.publishedDate || '1900-01-01');
                bValue = new Date(b.publishedDate || '1900-01-01');
                break;
            case 'priority':
                // 우선순위 계산 (페이지수 역순 + 최신순)
                aValue = (a.pageCount || 0) * -1 + new Date(a.publishedDate || '1900-01-01').getTime();
                bValue = (b.pageCount || 0) * -1 + new Date(b.publishedDate || '1900-01-01').getTime();
                break;
            default: // createdAt
                aValue = new Date(a.publishedDate || '1900-01-01');
                bValue = new Date(b.publishedDate || '1900-01-01');
        }

        if (aValue < bValue) return order === 'asc' ? -1 : 1;
        if (aValue > bValue) return order === 'asc' ? 1 : -1;
        return 0;
    });
}

// 책 추가 API - POST /api/books
router.post("/", async (req, res) => {
    try {
        // 요청 데이터 검증 (id 제외)
        const CreateBookSchema = BookSchema.omit({ id: true });
        const validatedData = CreateBookSchema.parse(req.body);

        // 데이터베이스에 책 추가
        const newBook = db.addBook(validatedData);

        const response: ApiResponse<Book> = {
            success: true,
            data: newBook,
            message: "책이 성공적으로 추가되었습니다."
        };

        res.status(201).json(response);
    } catch (error) {
        console.error("책 추가 오류:", error);
        
        if (error instanceof z.ZodError) {
            const response: ApiResponse = {
                success: false,
                error: "입력 데이터가 올바르지 않습니다.",
                message: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(", ")
            };
            return res.status(400).json(response);
        }

        const response: ApiResponse = {
            success: false,
            error: "책 추가 중 오류가 발생했습니다.",
            message: error instanceof Error ? error.message : "알 수 없는 오류"
        };

        res.status(500).json(response);
    }
});

// 책 목록 조회 API - GET /api/books
router.get("/", async (req, res) => {
    try {
        let books = db.getAllBooks();
        
        // 쿼리 파라미터 추출
        const { 
            sortBy = 'createdAt', 
            order = 'desc',
            author,
            category,
            search
        } = req.query;

        // 필터링
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

        if (search) {
            const searchTerm = (search as string).toLowerCase();
            books = books.filter(book => 
                book.title.toLowerCase().includes(searchTerm) ||
                book.author.toLowerCase().includes(searchTerm) ||
                book.description?.toLowerCase().includes(searchTerm)
            );
        }

        // 정렬
        books = sortBooks(books, sortBy as string, order as string);

        const response: ApiResponse<Book[]> = {
            success: true,
            data: books,
            message: `총 ${books.length}권의 책을 조회했습니다.`
        };

        res.json(response);
    } catch (error) {
        console.error("책 목록 조회 오류:", error);

        const response: ApiResponse = {
            success: false,
            error: "책 목록 조회 중 오류가 발생했습니다.",
            message: error instanceof Error ? error.message : "알 수 없는 오류"
        };

        res.status(500).json(response);
    }
});

// 특정 책 조회 API - GET /api/books/:id
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const book = db.getBookById(id);

        if (!book) {
            const response: ApiResponse = {
                success: false,
                error: "책을 찾을 수 없습니다.",
                message: `ID ${id}에 해당하는 책이 존재하지 않습니다.`
            };
            return res.status(404).json(response);
        }

        const response: ApiResponse<Book> = {
            success: true,
            data: book,
            message: "책 정보를 성공적으로 조회했습니다."
        };

        res.json(response);
    } catch (error) {
        console.error("책 조회 오류:", error);

        const response: ApiResponse = {
            success: false,
            error: "책 조회 중 오류가 발생했습니다.",
            message: error instanceof Error ? error.message : "알 수 없는 오류"
        };

        res.status(500).json(response);
    }
});

export default router;