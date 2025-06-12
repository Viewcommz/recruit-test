"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
class DatabaseService {
    constructor() {
        this.db = null;
    }
    static getInstance() {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }
    init() {
        const dbPath = path_1.default.join(process.cwd(), "data", "bookshelf.db");
        // data 디렉터리가 없으면 생성
        const fs = require("fs");
        const dataDir = path_1.default.dirname(dbPath);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        this.db = new better_sqlite3_1.default(dbPath);
        this.createTables();
        this.seedData();
        console.log("📄 Database initialized:", dbPath);
    }
    createTables() {
        if (!this.db)
            throw new Error("Database not initialized");
        // Books 테이블
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS books (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        isbn TEXT,
        publishedDate TEXT,
        description TEXT,
        thumbnail TEXT,
        pageCount INTEGER,
        categories TEXT, -- JSON array
        language TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `);
        // UserBooks 테이블
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS user_books (
        id TEXT PRIMARY KEY,
        bookId TEXT NOT NULL,
        status TEXT NOT NULL,
        rating INTEGER,
        review TEXT,
        notes TEXT,
        progress INTEGER DEFAULT 0,
        startDate TEXT,
        finishDate TEXT,
        tags TEXT, -- JSON array
        favorite INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (bookId) REFERENCES books (id)
      )
    `);
        // AI Summaries 테이블
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS ai_summaries (
        id TEXT PRIMARY KEY,
        userBookId TEXT NOT NULL,
        originalText TEXT NOT NULL,
        summary TEXT NOT NULL,
        keyPoints TEXT, -- JSON array
        createdAt TEXT NOT NULL,
        FOREIGN KEY (userBookId) REFERENCES user_books (id)
      )
    `);
        // 인덱스 생성
        this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_user_books_status ON user_books(status);
      CREATE INDEX IF NOT EXISTS idx_user_books_favorite ON user_books(favorite);
      CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
    `);
    }
    seedData() {
        if (!this.db)
            return;
        // 샘플 데이터가 이미 있는지 확인
        const bookCount = this.db
            .prepare("SELECT COUNT(*) as count FROM books")
            .get();
        if (bookCount.count > 0)
            return;
        console.log("🌱 Seeding sample data...");
        // 샘플 도서 데이터
        const sampleBooks = [
            {
                id: "book-1",
                title: "클린 코드",
                author: "로버트 C. 마틴",
                isbn: "9788966260959",
                publishedDate: "2013-12-24",
                description: "애자일 소프트웨어 장인 정신",
                thumbnail: "https://via.placeholder.com/150x200?text=Clean+Code",
                pageCount: 584,
                categories: JSON.stringify(["프로그래밍", "소프트웨어 개발"]),
                language: "ko",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: "book-2",
                title: "이펙티브 타입스크립트",
                author: "댄 밴더캄",
                isbn: "9791158392246",
                publishedDate: "2021-06-30",
                description: "동작 원리의 이해와 구체적인 조언 62가지",
                thumbnail: "https://via.placeholder.com/150x200?text=Effective+TypeScript",
                pageCount: 312,
                categories: JSON.stringify([
                    "프로그래밍",
                    "TypeScript",
                    "웹개발",
                ]),
                language: "ko",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        ];
        const insertBook = this.db.prepare(`
      INSERT INTO books (id, title, author, isbn, publishedDate, description, thumbnail, pageCount, categories, language, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
        for (const book of sampleBooks) {
            insertBook.run(book.id, book.title, book.author, book.isbn, book.publishedDate, book.description, book.thumbnail, book.pageCount, book.categories, book.language, book.createdAt, book.updatedAt);
        }
        console.log("✅ Sample data seeded successfully");
    }
    // Books CRUD
    getAllBooks() {
        if (!this.db)
            throw new Error("Database not initialized");
        const rows = this.db
            .prepare("SELECT * FROM books ORDER BY createdAt DESC")
            .all();
        return rows.map(this.mapBookFromDb);
    }
    getBookById(id) {
        if (!this.db)
            throw new Error("Database not initialized");
        const row = this.db.prepare("SELECT * FROM books WHERE id = ?").get(id);
        return row ? this.mapBookFromDb(row) : null;
    }
    addBook(book) {
        if (!this.db)
            throw new Error("Database not initialized");
        const id = `book-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`;
        const now = new Date().toISOString();
        const bookData = {
            id,
            ...book,
            categories: JSON.stringify(book.categories || []),
            createdAt: now,
            updatedAt: now,
        };
        const stmt = this.db.prepare(`
      INSERT INTO books (id, title, author, isbn, publishedDate, description, thumbnail, pageCount, categories, language, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
        stmt.run(bookData.id, bookData.title, bookData.author, bookData.isbn, bookData.publishedDate, bookData.description, bookData.thumbnail, bookData.pageCount, bookData.categories, bookData.language, bookData.createdAt, bookData.updatedAt);
        return this.mapBookFromDb(bookData);
    }
    // UserBooks CRUD
    getUserBooks() {
        if (!this.db)
            throw new Error("Database not initialized");
        const rows = this.db
            .prepare("SELECT * FROM user_books ORDER BY updatedAt DESC")
            .all();
        return rows.map(this.mapUserBookFromDb);
    }
    getUserBookById(id) {
        if (!this.db)
            throw new Error("Database not initialized");
        const row = this.db
            .prepare("SELECT * FROM user_books WHERE id = ?")
            .get(id);
        return row ? this.mapUserBookFromDb(row) : null;
    }
    addUserBook(userBook) {
        if (!this.db)
            throw new Error("Database not initialized");
        const id = `userbook-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`;
        const now = new Date().toISOString();
        const userBookData = {
            id,
            ...userBook,
            tags: JSON.stringify(userBook.tags || []),
            favorite: userBook.favorite ? 1 : 0,
            createdAt: now,
            updatedAt: now,
        };
        const stmt = this.db.prepare(`
      INSERT INTO user_books (id, bookId, status, rating, review, notes, progress, startDate, finishDate, tags, favorite, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
        stmt.run(userBookData.id, userBookData.bookId, userBookData.status, userBookData.rating, userBookData.review, userBookData.notes, userBookData.progress, userBookData.startDate, userBookData.finishDate, userBookData.tags, userBookData.favorite, userBookData.createdAt, userBookData.updatedAt);
        return this.mapUserBookFromDb(userBookData);
    }
    updateUserBook(id, updates) {
        if (!this.db)
            throw new Error("Database not initialized");
        const existing = this.getUserBookById(id);
        if (!existing)
            return null;
        const updatedData = {
            ...existing,
            ...updates,
            tags: JSON.stringify(updates.tags || existing.tags || []),
            favorite: (updates.favorite !== undefined
                ? updates.favorite
                : existing.favorite)
                ? 1
                : 0,
            updatedAt: new Date().toISOString(),
        };
        const stmt = this.db.prepare(`
      UPDATE user_books
      SET status = ?, rating = ?, review = ?, notes = ?, progress = ?,
          startDate = ?, finishDate = ?, tags = ?, favorite = ?, updatedAt = ?
      WHERE id = ?
    `);
        stmt.run(updatedData.status, updatedData.rating, updatedData.review, updatedData.notes, updatedData.progress, updatedData.startDate, updatedData.finishDate, updatedData.tags, updatedData.favorite, updatedData.updatedAt, id);
        return this.getUserBookById(id);
    }
    // 매핑 헬퍼 함수들
    mapBookFromDb(row) {
        return {
            id: row.id,
            title: row.title,
            author: row.author,
            isbn: row.isbn,
            publishedDate: row.publishedDate,
            description: row.description,
            thumbnail: row.thumbnail,
            pageCount: row.pageCount,
            categories: row.categories ? JSON.parse(row.categories) : [],
            language: row.language,
        };
    }
    mapUserBookFromDb(row) {
        return {
            id: row.id,
            bookId: row.bookId,
            status: row.status,
            rating: row.rating,
            review: row.review,
            notes: row.notes,
            progress: row.progress || 0,
            startDate: row.startDate,
            finishDate: row.finishDate,
            tags: row.tags ? JSON.parse(row.tags) : [],
            favorite: Boolean(row.favorite),
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
        };
    }
}
exports.DatabaseService = DatabaseService;
//# sourceMappingURL=database.js.map