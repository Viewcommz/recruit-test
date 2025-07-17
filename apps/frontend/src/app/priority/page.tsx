'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Book {
    id: string;
    title: string;
    author: string;
    isbn?: string;
    publishedDate?: string;
    description?: string;
    thumbnail?: string;
    pageCount?: number;
    categories: string[];
    language?: string;
}

interface BookFilters {
    search: string;
    author: string;
    category: string;
    sortBy: string;
    order: string;
}

export default function PriorityPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<BookFilters>({
        search: '',
        author: '',
        category: '',
        sortBy: 'title',
        order: 'asc'
    });
    const [showAddForm, setShowAddForm] = useState(false);
    const [newBook, setNewBook] = useState({
        title: '',
        author: '',
        description: '',
        categories: '',
        pageCount: ''
    });

    // API 호출 함수
    const fetchBooks = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams();
            
            if (filters.search) queryParams.append('search', filters.search);
            if (filters.author) queryParams.append('author', filters.author);
            if (filters.category) queryParams.append('category', filters.category);
            queryParams.append('sortBy', filters.sortBy);
            queryParams.append('order', filters.order);
            
            const response = await fetch(`http://localhost:8000/api/books?${queryParams}`);
            const data = await response.json();
            
            if (data.success) {
                setBooks(data.data);
                setError(null);
            } else {
                setError(data.error || 'Failed to fetch books');
            }
        } catch (err) {
            setError('API 서버에 연결할 수 없습니다. localStorage를 사용합니다.');
            // localStorage 폴백
            const localBooks = localStorage.getItem('books');
            if (localBooks) {
                setBooks(JSON.parse(localBooks));
            }
        } finally {
            setLoading(false);
        }
    };

    // 책 추가 함수
    const addBook = async () => {
        try {
            const bookData = {
                ...newBook,
                categories: newBook.categories.split(',').map(c => c.trim()).filter(c => c),
                pageCount: newBook.pageCount ? parseInt(newBook.pageCount) : undefined,
                publishedDate: new Date().toISOString().split('T')[0],
                language: 'ko'
            };

            const response = await fetch('http://localhost:8000/api/books', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookData)
            });

            const data = await response.json();
            
            if (data.success) {
                setNewBook({ title: '', author: '', description: '', categories: '', pageCount: '' });
                setShowAddForm(false);
                fetchBooks();
            } else {
                setError(data.error || 'Failed to add book');
            }
        } catch (err) {
            // localStorage 폴백
            const book: Book = {
                id: `book-${Date.now()}`,
                title: newBook.title,
                author: newBook.author,
                description: newBook.description,
                categories: newBook.categories.split(',').map(c => c.trim()).filter(c => c),
                pageCount: newBook.pageCount ? parseInt(newBook.pageCount) : undefined,
                publishedDate: new Date().toISOString().split('T')[0],
                language: 'ko'
            };
            
            const currentBooks = [...books, book];
            setBooks(currentBooks);
            localStorage.setItem('books', JSON.stringify(currentBooks));
            
            setNewBook({ title: '', author: '', description: '', categories: '', pageCount: '' });
            setShowAddForm(false);
        }
    };

    // 우선순위 계산 (간단한 알고리즘)
    const calculatePriority = (book: Book): number => {
        let score = 0;
        
        // 페이지 수가 적을수록 높은 점수 (읽기 쉬움)
        if (book.pageCount) {
            score += Math.max(0, 500 - book.pageCount) / 10;
        }
        
        // 프로그래밍 관련 카테고리 가산점
        if (book.categories.some(cat => 
            cat.includes('프로그래밍') || cat.includes('개발') || cat.includes('코드')
        )) {
            score += 20;
        }
        
        // 최신 출간일 가산점
        if (book.publishedDate) {
            const publishYear = new Date(book.publishedDate).getFullYear();
            const currentYear = new Date().getFullYear();
            score += Math.max(0, 10 - (currentYear - publishYear));
        }
        
        return Math.round(score);
    };

    useEffect(() => {
        fetchBooks();
    }, [filters]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p>책 목록을 불러오는 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">📚 읽고 싶은 책 우선순위</h1>
                        <Link href="/" className="text-blue-500 hover:text-blue-600">
                            ← 메인으로 돌아가기
                        </Link>
                    </div>

                    {error && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                            <p className="text-yellow-800">⚠️ {error}</p>
                        </div>
                    )}

                    {/* 필터 및 검색 */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <input
                            type="text"
                            placeholder="책 제목, 저자 검색..."
                            className="border rounded-lg px-3 py-2"
                            value={filters.search}
                            onChange={(e) => setFilters({...filters, search: e.target.value})}
                        />
                        <input
                            type="text"
                            placeholder="저자 필터..."
                            className="border rounded-lg px-3 py-2"
                            value={filters.author}
                            onChange={(e) => setFilters({...filters, author: e.target.value})}
                        />
                        <select
                            className="border rounded-lg px-3 py-2"
                            value={filters.sortBy}
                            onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                        >
                            <option value="title">제목순</option>
                            <option value="author">저자순</option>
                            <option value="publishedDate">출간일순</option>
                            <option value="pageCount">페이지수순</option>
                        </select>
                        <select
                            className="border rounded-lg px-3 py-2"
                            value={filters.order}
                            onChange={(e) => setFilters({...filters, order: e.target.value})}
                        >
                            <option value="asc">오름차순</option>
                            <option value="desc">내림차순</option>
                        </select>
                    </div>

                    {/* 책 추가 버튼 */}
                    <div className="mb-6">
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                            {showAddForm ? '취소' : '+ 새 책 추가'}
                        </button>
                    </div>

                    {/* 책 추가 폼 */}
                    {showAddForm && (
                        <div className="bg-gray-50 p-6 rounded-lg mb-6">
                            <h3 className="font-semibold mb-4">새 책 추가</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="책 제목"
                                    className="border rounded-lg px-3 py-2"
                                    value={newBook.title}
                                    onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                                />
                                <input
                                    type="text"
                                    placeholder="저자"
                                    className="border rounded-lg px-3 py-2"
                                    value={newBook.author}
                                    onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                                />
                                <input
                                    type="text"
                                    placeholder="카테고리 (쉼표로 구분)"
                                    className="border rounded-lg px-3 py-2"
                                    value={newBook.categories}
                                    onChange={(e) => setNewBook({...newBook, categories: e.target.value})}
                                />
                                <input
                                    type="number"
                                    placeholder="페이지 수"
                                    className="border rounded-lg px-3 py-2"
                                    value={newBook.pageCount}
                                    onChange={(e) => setNewBook({...newBook, pageCount: e.target.value})}
                                />
                                <textarea
                                    placeholder="책 설명"
                                    className="border rounded-lg px-3 py-2 md:col-span-2"
                                    rows={3}
                                    value={newBook.description}
                                    onChange={(e) => setNewBook({...newBook, description: e.target.value})}
                                />
                            </div>
                            <div className="mt-4">
                                <button
                                    onClick={addBook}
                                    disabled={!newBook.title || !newBook.author}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-300"
                                >
                                    책 추가
                                </button>
                            </div>
                        </div>
                    )}

                    {/* 책 목록 */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">
                            📖 책 목록 ({books.length}권)
                        </h2>
                        
                        {books.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <p>등록된 책이 없습니다.</p>
                                <p>새 책을 추가해보세요!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {books.map((book) => {
                                    const priority = calculatePriority(book);
                                    return (
                                        <div key={book.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-semibold text-lg line-clamp-2">{book.title}</h3>
                                                <span className={`px-2 py-1 rounded text-sm font-medium ${
                                                    priority >= 40 ? 'bg-red-100 text-red-800' :
                                                    priority >= 25 ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                    우선순위: {priority}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 mb-2">저자: {book.author}</p>
                                            {book.pageCount && (
                                                <p className="text-sm text-gray-500 mb-2">{book.pageCount}페이지</p>
                                            )}
                                            {book.categories.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mb-2">
                                                    {book.categories.map((category, idx) => (
                                                        <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                                            {category}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            {book.description && (
                                                <p className="text-sm text-gray-600 line-clamp-3">{book.description}</p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}