import { z } from "zod";

// 독서 상태 타입
export enum ReadingStatus {
    WANT_TO_READ = "want_to_read",
    CURRENTLY_READING = "currently_reading",
    READ = "read",
}

// 도서 정보 스키마
export const BookSchema = z.object({
    id: z.string(),
    title: z.string(),
    author: z.string(),
    isbn: z.string().optional(),
    publishedDate: z.string().optional(),
    description: z.string().optional(),
    thumbnail: z.string().optional(),
    pageCount: z.number().optional(),
    categories: z.array(z.string()).optional(),
    language: z.string().optional(),
});

// 사용자 도서 정보 스키마
export const UserBookSchema = z.object({
    id: z.string(),
    bookId: z.string(),
    status: z.nativeEnum(ReadingStatus),
    rating: z.number().min(1).max(5).optional(),
    review: z.string().optional(),
    notes: z.string().optional(),
    progress: z.number().min(0).max(100).default(0), // 독서 진행률 (%)
    startDate: z.string().optional(),
    finishDate: z.string().optional(),
    tags: z.array(z.string()).default([]),
    favorite: z.boolean().default(false),
    createdAt: z.string(),
    updatedAt: z.string(),
});

// AI 기능 관련 스키마
export const AIRecommendationSchema = z.object({
    bookId: z.string(),
    reason: z.string(),
    confidence: z.number().min(0).max(1),
});

export const AISummarySchema = z.object({
    id: z.string(),
    userBookId: z.string(),
    originalText: z.string(),
    summary: z.string(),
    keyPoints: z.array(z.string()),
    createdAt: z.string(),
});

// API 응답 스키마
export const ApiResponseSchema = z.object({
    success: z.boolean(),
    data: z.any().optional(),
    error: z.string().optional(),
    message: z.string().optional(),
});

// 타입 추출
export type Book = z.infer<typeof BookSchema>;
export type UserBook = z.infer<typeof UserBookSchema>;
export type AIRecommendation = z.infer<typeof AIRecommendationSchema>;
export type AISummary = z.infer<typeof AISummarySchema>;
export type ApiResponse<T = any> = z.infer<typeof ApiResponseSchema> & {
    data?: T;
};

// 도서 검색 관련 타입
export interface BookSearchQuery {
    query: string;
    author?: string;
    subject?: string;
    limit?: number;
    startIndex?: number;
}

export interface BookSearchResult {
    items: Book[];
    totalItems: number;
}

// 통계 관련 타입
export interface ReadingStats {
    totalBooks: number;
    booksRead: number;
    booksReading: number;
    booksWantToRead: number;
    averageRating: number;
    totalPages: number;
    genreDistribution: Record<string, number>;
    monthlyProgress: Array<{
        month: string;
        booksCompleted: number;
        pagesRead: number;
    }>;
}
