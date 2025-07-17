import express from 'express';
import { DatabaseService } from '../services/database';

const router = express.Router();
const db = DatabaseService.getInstance();

// 읽은 책 등록 (POST /api/books)
router.post('/', async (req, res) => {
    try {
        const { readerId, bookData, userBookData } = req.body;
        
        // 책이 이미 존재하는지 확인
        let book = db.getBookById(bookData.bookId || `book-${Date.now()}`);
        
        // 책이 없으면 새로 추가 (keyword 필드 제거)
        if (!book) {
            book = db.addBook({
                title: bookData.title,
                author: bookData.author,
                isbn: bookData.isbn,
                publishedDate: bookData.publishedDate,
                description: bookData.description,
                thumbnail: bookData.thumbnail,
                pageCount: bookData.pageCount,
                language: bookData.language
            });
        }

        // 사용자-책 관계 추가 (tagId 포함)
        const userBook = db.addUserBook({
            readerId,
            readBookId: bookData.bookId,
            st_read: userBookData.st_read,
            end_read: userBookData.end_read,
            tagId: userBookData.tagId, // 태그 ID 추가
            review: userBookData.review,
            rate: userBookData.rate
        });

        res.status(201).json({
            success: true,
            data: userBook
        });
    } catch (error) {
        console.error('Error adding book:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to add book'
        });
    }
});

// 읽은 책 조회 (GET /api/books)
router.get('/', async (req, res) => {
    try {
        const { sort, tagId, userId = 'user-1' } = req.query;
        
        let books;
        
        if (tagId) {
            // 태그별 검색 (새로운 스키마에 맞게 수정)
            books = db.getUserBooksByTag(userId as string, tagId as string);
        } else {
            // 전체 조회 (태그 정보 포함, 정렬 옵션 적용)
            books = db.getUserBooksWithTags(userId as string, sort as 'TimeDesc' | 'RateDesc');
        }

        res.json({
            success: true,
            data: books
        });
    } catch (error) {
        console.error('Error getting books:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get books'
        });
    }
});

// 읽은 책 수정 (PATCH /api/books/:id)
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedBook = db.updateUserBook(id, updates);
        
        if (!updatedBook) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }

        res.json({
            success: true,
            data: updatedBook
        });
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update book'
        });
    }
});

// 읽은 책 삭제 (DELETE /api/books/:id)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = db.deleteUserBook(id);
        
        if (!deleted) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }

        res.json({
            success: true,
            message: 'Book deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete book'
        });
    }
});

export default router;