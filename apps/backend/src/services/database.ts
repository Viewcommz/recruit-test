import Database from "better-sqlite3";
import path from "path";
import { Book, UserBook, ReadingStatus } from "@bookshelf/shared";

export class DatabaseService {
    private static instance: DatabaseService;
    private db: Database.Database | null = null;

    private constructor() {}

    public static getInstance(): DatabaseService {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }

    public init(): void {
        const dbPath = path.join(process.cwd(), "data", "bookshelf.db");

        // data 디렉터리가 없으면 생성
        const fs = require("fs");
        const dataDir = path.dirname(dbPath);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        this.db = new Database(dbPath);
        this.createTables();
        this.seedData();

        console.log("📄 Database initialized:", dbPath);
    }

    private createTables(): void {
        if (!this.db) throw new Error("Database not initialized");

        // Users 테이블
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        nickname TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `);

        // Books 테이블 (keyword 필드 제거)
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS books (
        bookId TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        isbn TEXT,
        publishedDate TEXT,
        description TEXT,
        thumbnail TEXT,
        pageCount INTEGER,
        language TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `);

        // User_Book 중간테이블 (tagId 추가, Tag와 1:N 관계)
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS user_books (
        id TEXT PRIMARY KEY,
        readerId TEXT NOT NULL,
        readBookId TEXT NOT NULL,
        st_read TEXT, -- 읽기 시작한 날짜
        end_read TEXT, -- 다 읽은 날짜
        tagId TEXT, -- 유저가 등록한 태그ID (FK)
        review TEXT, -- 감상평
        rate INTEGER, -- 별점
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (readerId) REFERENCES users (id),
        FOREIGN KEY (readBookId) REFERENCES books (bookId),
        FOREIGN KEY (tagId) REFERENCES tags (tagId)
      )
    `);

        // Tag 테이블 (커스텀 키워드) - user와 1:N
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS tags (
        tagId TEXT PRIMARY KEY,
        tagName TEXT NOT NULL,
        tagUserId TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (tagUserId) REFERENCES users (id)
      )
    `);

        // 인덱스 생성
        this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_user_books_reader ON user_books(readerId);
      CREATE INDEX IF NOT EXISTS idx_user_books_book ON user_books(readBookId);
      CREATE INDEX IF NOT EXISTS idx_user_books_tag ON user_books(tagId);
      CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
      CREATE INDEX IF NOT EXISTS idx_tags_user ON tags(tagUserId);
    `);
    }

    private seedData(): void {
        if (!this.db) return;

        // 샘플 데이터가 이미 있는지 확인
        const userCount = this.db
            .prepare("SELECT COUNT(*) as count FROM users")
            .get() as { count: number };
        if (userCount.count > 0) return;

        console.log("🌱 Seeding sample data...");

        const now = new Date().toISOString();

        // 샘플 사용자 데이터
        const sampleUser = {
            id: "user-1",
            nickname: "독서가",
            createdAt: now,
            updatedAt: now,
        };

        this.db.prepare(`
            INSERT INTO users (id, nickname, createdAt, updatedAt)
            VALUES (?, ?, ?, ?)
        `).run(sampleUser.id, sampleUser.nickname, sampleUser.createdAt, sampleUser.updatedAt);

        // 샘플 태그 데이터 먼저 생성 (user_books에서 참조하기 위해)
        const sampleTags = [
            {
                tagId: "tag-1",
                tagName: "개발서적",
                tagUserId: "user-1",
                createdAt: now,
                updatedAt: now,
            },
            {
                tagId: "tag-2",
                tagName: "필독서",
                tagUserId: "user-1",
                createdAt: now,
                updatedAt: now,
            },
        ];

        const insertTag = this.db.prepare(`
            INSERT INTO tags (tagId, tagName, tagUserId, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?)
        `);

        for (const tag of sampleTags) {
            insertTag.run(
                tag.tagId,
                tag.tagName,
                tag.tagUserId,
                tag.createdAt,
                tag.updatedAt
            );
        }

        // 샘플 도서 데이터 (keyword 필드 제거)
        const sampleBooks = [
            {
                bookId: "book-1",
                title: "클린 코드",
                author: "로버트 C. 마틴",
                isbn: "9788966260959",
                publishedDate: "2013-12-24",
                description: "애자일 소프트웨어 장인 정신",
                thumbnail: "https://via.placeholder.com/150x200?text=Clean+Code",
                pageCount: 584,
                language: "ko",
                createdAt: now,
                updatedAt: now,
            },
            {
                bookId: "book-2",
                title: "이펙티브 타입스크립트",
                author: "댄 밴더캄",
                isbn: "9791158392246",
                publishedDate: "2021-06-30",
                description: "동작 원리의 이해와 구체적인 조언 62가지",
                thumbnail: "https://via.placeholder.com/150x200?text=Effective+TypeScript",
                pageCount: 312,
                language: "ko",
                createdAt: now,
                updatedAt: now,
            },
        ];

        const insertBook = this.db.prepare(`
            INSERT INTO books (bookId, title, author, isbn, publishedDate, description, thumbnail, pageCount, language, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        for (const book of sampleBooks) {
            insertBook.run(
                book.bookId,
                book.title,
                book.author,
                book.isbn,
                book.publishedDate,
                book.description,
                book.thumbnail,
                book.pageCount,
                book.language,
                book.createdAt,
                book.updatedAt
            );
        }

        // 샘플 사용자-책 관계 데이터 (tagId 추가)
        const sampleUserBooks = [
            {
                id: "userbook-1",
                readerId: "user-1",
                readBookId: "book-1",
                st_read: "2024-01-01",
                end_read: "2024-01-15",
                tagId: "tag-1", // 개발서적 태그
                review: "정말 좋은 책입니다. 코드 품질에 대해 많이 배웠어요.",
                rate: 5,
                createdAt: now,
                updatedAt: now,
            },
            {
                id: "userbook-2",
                readerId: "user-1",
                readBookId: "book-2",
                st_read: "2024-02-01",
                end_read: null,
                tagId: "tag-2", // 필독서 태그
                review: null,
                rate: null,
                createdAt: now,
                updatedAt: now,
            },
        ];

        const insertUserBook = this.db.prepare(`
            INSERT INTO user_books (id, readerId, readBookId, st_read, end_read, tagId, review, rate, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        for (const userBook of sampleUserBooks) {
            insertUserBook.run(
                userBook.id,
                userBook.readerId,
                userBook.readBookId,
                userBook.st_read,
                userBook.end_read,
                userBook.tagId,
                userBook.review,
                userBook.rate,
                userBook.createdAt,
                userBook.updatedAt
            );
        }



        console.log("✅ Sample data seeded successfully");
    }

    // Users CRUD
    public getAllUsers() {
        if (!this.db) throw new Error("Database not initialized");
        return this.db.prepare("SELECT * FROM users ORDER BY createdAt DESC").all();
    }

    public getUserById(id: string) {
        if (!this.db) throw new Error("Database not initialized");
        return this.db.prepare("SELECT * FROM users WHERE id = ?").get(id);
    }

    // Books CRUD (새 스키마에 맞게 수정)
    public getAllBooks() {
        if (!this.db) throw new Error("Database not initialized");
        return this.db.prepare("SELECT * FROM books ORDER BY createdAt DESC").all();
    }

    public getBookById(bookId: string) {
        if (!this.db) throw new Error("Database not initialized");
        return this.db.prepare("SELECT * FROM books WHERE bookId = ?").get(bookId);
    }

    public addBook(book: { title: string; author: string; isbn?: string; publishedDate?: string; description?: string; thumbnail?: string; pageCount?: number; language?: string }) {
        if (!this.db) throw new Error("Database not initialized");

        const bookId = `book-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const now = new Date().toISOString();

        const stmt = this.db.prepare(`
            INSERT INTO books (bookId, title, author, isbn, publishedDate, description, thumbnail, pageCount, language, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            bookId,
            book.title,
            book.author,
            book.isbn || null,
            book.publishedDate || null,
            book.description || null,
            book.thumbnail || null,
            book.pageCount || null,
            book.language || null,
            now,
            now
        );

        return this.getBookById(bookId);
    }

    // User_Books CRUD (기획서에 맞게 수정)
    public getUserBooks(userId: string, sortBy?: 'TimeDesc' | 'RateDesc') {
        if (!this.db) throw new Error("Database not initialized");
        
        let query = `
            SELECT ub.*, b.title, b.author, b.thumbnail 
            FROM user_books ub 
            JOIN books b ON ub.readBookId = b.bookId 
            WHERE ub.readerId = ?
        `;
        
        if (sortBy === 'TimeDesc') {
            query += " ORDER BY ub.end_read DESC, ub.st_read DESC";
        } else if (sortBy === 'RateDesc') {
            query += " ORDER BY ub.rate DESC";
        } else {
            query += " ORDER BY ub.updatedAt DESC";
        }

        return this.db.prepare(query).all(userId);
    }

    public getUserBookById(id: string) {
        if (!this.db) throw new Error("Database not initialized");
        return this.db.prepare(`
            SELECT ub.*, b.title, b.author, b.thumbnail 
            FROM user_books ub 
            JOIN books b ON ub.readBookId = b.bookId 
            WHERE ub.id = ?
        `).get(id);
    }

    public addUserBook(userBook: { readerId: string; readBookId: string; st_read?: string; end_read?: string; tagId?: string; review?: string; rate?: number }) {
        if (!this.db) throw new Error("Database not initialized");

        const id = `userbook-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const now = new Date().toISOString();

        const stmt = this.db.prepare(`
            INSERT INTO user_books (id, readerId, readBookId, st_read, end_read, tagId, review, rate, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            id,
            userBook.readerId,
            userBook.readBookId,
            userBook.st_read || null,
            userBook.end_read || null,
            userBook.tagId || null,
            userBook.review || null,
            userBook.rate || null,
            now,
            now
        );

        return this.getUserBookById(id);
    }

    public updateUserBook(id: string, updates: { st_read?: string; end_read?: string; tagId?: string | null; review?: string; rate?: number }) {
        if (!this.db) throw new Error("Database not initialized");

        const existing = this.getUserBookById(id);
        if (!existing) return null;

        const now = new Date().toISOString();

        const stmt = this.db.prepare(`
            UPDATE user_books 
            SET st_read = ?, end_read = ?, tagId = ?, review = ?, rate = ?, updatedAt = ?
            WHERE id = ?
        `);

        stmt.run(
            updates.st_read !== undefined ? updates.st_read : existing.st_read,
            updates.end_read !== undefined ? updates.end_read : existing.end_read,
            'tagId' in updates ? updates.tagId : existing.tagId, // null 값도 허용하도록 수정
            updates.review !== undefined ? updates.review : existing.review,
            updates.rate !== undefined ? updates.rate : existing.rate,
            now,
            id
        );

        return this.getUserBookById(id);
    }

    public deleteUserBook(id: string) {
        if (!this.db) throw new Error("Database not initialized");
        
        // user_book 삭제 (tagId는 직접 연결되어 있으므로 별도 삭제 불필요)
        const result = this.db.prepare("DELETE FROM user_books WHERE id = ?").run(id);
        return result.changes > 0;
    }

    // Tags CRUD
    public getUserTags(userId: string) {
        if (!this.db) throw new Error("Database not initialized");
        return this.db.prepare("SELECT * FROM tags WHERE tagUserId = ? ORDER BY createdAt DESC").all(userId);
    }

    public getTagById(tagId: string) {
        if (!this.db) throw new Error("Database not initialized");
        return this.db.prepare("SELECT * FROM tags WHERE tagId = ?").get(tagId);
    }

    public addTag(tag: { tagName: string; tagUserId: string }) {
        if (!this.db) throw new Error("Database not initialized");

        const tagId = `tag-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const now = new Date().toISOString();

        const stmt = this.db.prepare(`
            INSERT INTO tags (tagId, tagName, tagUserId, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?)
        `);

        stmt.run(tagId, tag.tagName, tag.tagUserId, now, now);
        return this.getTagById(tagId);
    }

    public updateTag(tagId: string, tagName: string) {
        if (!this.db) throw new Error("Database not initialized");

        const stmt = this.db.prepare(`
            UPDATE tags SET tagName = ?, updatedAt = ? WHERE tagId = ?
        `);

        const result = stmt.run(tagName, new Date().toISOString(), tagId);
        return result.changes > 0 ? this.getTagById(tagId) : null;
    }

    public deleteTag(tagId: string) {
        if (!this.db) throw new Error("Database not initialized");
        
        // 먼저 해당 태그를 사용하는 user_books의 tagId를 null로 설정
        this.db.prepare("UPDATE user_books SET tagId = NULL WHERE tagId = ?").run(tagId);
        
        // 그 다음 태그 삭제
        const result = this.db.prepare("DELETE FROM tags WHERE tagId = ?").run(tagId);
        return result.changes > 0;
    }

    // 태그별 책 조회 (새로운 1:N 관계에 맞게 수정)
    public getUserBooksByTag(userId: string, tagId: string) {
        if (!this.db) throw new Error("Database not initialized");
        
        return this.db.prepare(`
            SELECT ub.*, b.title, b.author, b.thumbnail, t.tagName
            FROM user_books ub 
            JOIN books b ON ub.readBookId = b.bookId 
            LEFT JOIN tags t ON ub.tagId = t.tagId
            WHERE ub.readerId = ? AND ub.tagId = ?
            ORDER BY ub.updatedAt DESC
        `).all(userId, tagId);
    }

    // 태그 정보와 함께 사용자 책 조회
    public getUserBooksWithTags(userId: string, sortBy?: 'TimeDesc' | 'RateDesc') {
        if (!this.db) throw new Error("Database not initialized");
        
        let query = `
            SELECT ub.*, b.title, b.author, b.thumbnail, t.tagName
            FROM user_books ub 
            JOIN books b ON ub.readBookId = b.bookId 
            LEFT JOIN tags t ON ub.tagId = t.tagId
            WHERE ub.readerId = ?
        `;
        
        if (sortBy === 'TimeDesc') {
            query += " ORDER BY ub.end_read DESC, ub.st_read DESC";
        } else if (sortBy === 'RateDesc') {
            query += " ORDER BY ub.rate DESC";
        } else {
            query += " ORDER BY ub.updatedAt DESC";
        }

        return this.db.prepare(query).all(userId);
    }
}
