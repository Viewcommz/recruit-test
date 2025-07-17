import express from 'express';
import { DatabaseService } from '../services/database';

const router = express.Router();
const db = DatabaseService.getInstance();

// 태그 등록 (POST /api/tags)
router.post('/', async (req, res) => {
    try {
        const { tagName, tagUserId } = req.body;

        if (!tagName || !tagUserId) {
            return res.status(400).json({
                success: false,
                error: 'tagName and tagUserId are required'
            });
        }

        const tag = db.addTag({
            tagName,
            tagUserId
        });

        res.status(201).json({
            success: true,
            data: tag
        });
    } catch (error) {
        console.error('Error adding tag:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to add tag'
        });
    }
});

// 사용자 태그 조회 (GET /api/tags)
router.get('/', async (req, res) => {
    try {
        const { userId = 'user-1' } = req.query;

        const tags = db.getUserTags(userId as string);

        res.json({
            success: true,
            data: tags
        });
    } catch (error) {
        console.error('Error getting tags:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get tags'
        });
    }
});

// 태그 이름 수정 (PATCH /api/tags/:id)
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { tagName } = req.body;

        if (!tagName) {
            return res.status(400).json({
                success: false,
                error: 'tagName is required'
            });
        }

        const updatedTag = db.updateTag(id, tagName);
        
        if (!updatedTag) {
            return res.status(404).json({
                success: false,
                error: 'Tag not found'
            });
        }

        res.json({
            success: true,
            data: updatedTag
        });
    } catch (error) {
        console.error('Error updating tag:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update tag'
        });
    }
});

// 태그 삭제 (DELETE /api/tags/:id)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = db.deleteTag(id);
        
        if (!deleted) {
            return res.status(404).json({
                success: false,
                error: 'Tag not found'
            });
        }

        res.json({
            success: true,
            message: 'Tag deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting tag:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete tag'
        });
    }
});

// 태그별 책 조회 (GET /api/tags/:id/books)
router.get('/:id/books', async (req, res) => {
    try {
        const { id } = req.params;
        const { userId = 'user-1' } = req.query;

        const books = db.getUserBooksByTag(userId as string, id);

        res.json({
            success: true,
            data: books
        });
    } catch (error) {
        console.error('Error getting books by tag:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get books by tag'
        });
    }
});

// 책에 태그 설정 (PATCH /api/tags/:tagId/books/:bookId)
// 새로운 1:N 관계에서는 user_books 테이블의 tagId를 직접 업데이트
router.patch('/:tagId/books/:bookId', async (req, res) => {
    try {
        const { tagId, bookId } = req.params;

        // user_books 테이블에서 해당 책의 tagId를 업데이트
        const updatedBook = db.updateUserBook(bookId, { tagId });

        if (updatedBook) {
            res.json({
                success: true,
                message: 'Tag assigned to book successfully',
                data: updatedBook
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }
    } catch (error) {
        console.error('Error assigning tag to book:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to assign tag to book'
        });
    }
});

// 책에서 태그 제거 (DELETE /api/tags/books/:bookId)
// tagId를 null로 설정하여 태그 연결 해제
router.delete('/books/:bookId', async (req, res) => {
    try {
        const { bookId } = req.params;

        const updatedBook = db.updateUserBook(bookId, { tagId: null });

        if (updatedBook) {
            res.json({
                success: true,
                message: 'Tag removed from book successfully',
                data: updatedBook
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }
    } catch (error) {
        console.error('Error removing tag from book:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to remove tag from book'
        });
    }
});

export default router;