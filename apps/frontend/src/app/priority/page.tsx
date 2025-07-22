'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

// 타입 정의
interface Book {
    id: string;
    title: string;
    author: string;
    isbn?: string;
    publishedDate?: string;
    description?: string;
    thumbnail?: string;
    pageCount?: number;
    categories?: string[];
    language?: string;
}

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export default function PriorityPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState('priority');
    const [order, setOrder] = useState('desc');
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newBook, setNewBook] = useState({
        title: '',
        author: '',
        pageCount: '',
        publishedDate: '',
        description: '',
        categories: ''
    });

    const API_BASE = 'http://localhost:8000/api';

    // 책 목록 조회
    const fetchBooks = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                sortBy,
                order,
                ...(searchTerm && { search: searchTerm })
            });

            const response = await axios.get<ApiResponse<Book[]>>(`${API_BASE}/books?${params}`);

            if (response.data.success && response.data.data) {
                setBooks(response.data.data);
            }
        } catch (error) {
            console.error('책 목록 조회 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    // 책 추가
    const addBook = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const bookData = {
                title: newBook.title,
                author: newBook.author,
                pageCount: newBook.pageCount ? parseInt(newBook.pageCount) : undefined,
                publishedDate: newBook.publishedDate || undefined,
                description: newBook.description || undefined,
                categories: newBook.categories ? newBook.categories.split(',').map(c => c.trim()) : []
            };

            const response = await axios.post<ApiResponse<Book>>(`${API_BASE}/books`, bookData);

            if (response.data.success) {
                setNewBook({ title: '', author: '', pageCount: '', publishedDate: '', description: '', categories: '' });
                setShowAddForm(false);
                fetchBooks(); // 목록 새로고침
            }
        } catch (error) {
            console.error('책 추가 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, [sortBy, order, searchTerm]);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold">📚 읽고 싶은 책 우선순위</h1>
                        <Link href="/" className="text-blue-500 hover:text-blue-600">
                            ← 메인으로 돌아가기
                        </Link>
                    </div>

                    {/* 컨트롤 패널 */}
                    <div className="bg-gray-50 p-6 rounded-lg mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            {/* 검색 */}
                            <div>
                                <label className="block text-sm font-medium mb-2">🔍 검색</label>
                                <input
                                    type="text"
                                    placeholder="제목, 저자, 설명 검색..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* 정렬 기준 */}
                            <div>
                                <label className="block text-sm font-medium mb-2">📊 정렬 기준</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="priority">🎯 우선순위</option>
                                    <option value="title">📖 제목순</option>
                                    <option value="author">👤 저자순</option>
                                    <option value="pageCount">📄 페이지수</option>
                                    <option value="publishedDate">📅 출간일</option>
                                </select>
                            </div>

                            {/* 정렬 순서 */}
                            <div>
                                <label className="block text-sm font-medium mb-2">🔄 정렬 순서</label>
                                <select
                                    value={order}
                                    onChange={(e) => setOrder(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="desc">⬇️ 내림차순</option>
                                    <option value="asc">⬆️ 오름차순</option>
                                </select>
                            </div>

                            {/* 책 추가 버튼 */}
                            <div className="flex items-end">
                                <button
                                    onClick={() => setShowAddForm(!showAddForm)}
                                    className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                                >
                                    ➕ 책 추가
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 책 추가 폼 */}
                    {showAddForm && (
                        <div className="bg-blue-50 p-6 rounded-lg mb-6">
                            <h3 className="text-lg font-semibold mb-4">📚 새 책 추가</h3>
                            <form onSubmit={addBook} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="책 제목 *"
                                    value={newBook.title}
                                    onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                                    required
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="text"
                                    placeholder="저자 *"
                                    value={newBook.author}
                                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                                    required
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="number"
                                    placeholder="페이지 수"
                                    value={newBook.pageCount}
                                    onChange={(e) => setNewBook({ ...newBook, pageCount: e.target.value })}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="date"
                                    placeholder="출간일"
                                    value={newBook.publishedDate}
                                    onChange={(e) => setNewBook({ ...newBook, publishedDate: e.target.value })}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="text"
                                    placeholder="카테고리 (쉼표로 구분)"
                                    value={newBook.categories}
                                    onChange={(e) => setNewBook({ ...newBook, categories: e.target.value })}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <textarea
                                    placeholder="책 설명"
                                    value={newBook.description}
                                    onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <div className="md:col-span-2 flex gap-2">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50"
                                    >
                                        {loading ? '추가 중...' : '✅ 추가'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddForm(false)}
                                        className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
                                    >
                                        ❌ 취소
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* 책 목록 */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">
                                📋 책 목록 ({books.length}권)
                            </h2>
                            {loading && <div className="text-blue-500">🔄 로딩 중...</div>}
                        </div>

                        {books.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                📚 등록된 책이 없습니다. 첫 번째 책을 추가해보세요!
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {books.map((book, index) => (
                                    <div key={book.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                                                        #{index + 1}
                                                    </span>
                                                    <h3 className="text-lg font-semibold text-gray-900">{book.title}</h3>
                                                </div>
                                                <p className="text-gray-600 mb-2">👤 {book.author}</p>
                                                {book.description && (
                                                    <p className="text-gray-500 text-sm mb-3">{book.description}</p>
                                                )}
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                                    {book.pageCount && (
                                                        <span>📄 {book.pageCount}페이지</span>
                                                    )}
                                                    {book.publishedDate && (
                                                        <span>📅 {book.publishedDate}</span>
                                                    )}
                                                    {book.categories && book.categories.length > 0 && (
                                                        <span>🏷️ {book.categories.join(', ')}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 