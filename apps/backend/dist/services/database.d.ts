import { Book, UserBook } from "@bookshelf/shared";
export declare class DatabaseService {
    private static instance;
    private db;
    private constructor();
    static getInstance(): DatabaseService;
    init(): void;
    private createTables;
    private seedData;
    getAllBooks(): Book[];
    getBookById(id: string): Book | null;
    addBook(book: Omit<Book, "id">): Book;
    getUserBooks(): UserBook[];
    getUserBookById(id: string): UserBook | null;
    addUserBook(userBook: Omit<UserBook, "id" | "createdAt" | "updatedAt">): UserBook;
    updateUserBook(id: string, updates: Partial<UserBook>): UserBook | null;
    private mapBookFromDb;
    private mapUserBookFromDb;
}
//# sourceMappingURL=database.d.ts.map