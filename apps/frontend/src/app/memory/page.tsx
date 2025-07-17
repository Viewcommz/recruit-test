'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Book {
    bookId: string;
    title: string;
    author: string;
    isbn?: string;
    publishedDate?: string;
    description?: string;
    thumbnail?: string;
    pageCount?: number;
    language?: string;
}

interface Tag {
    tagId: string;
    tagName: string;
    tagUserId: string;
    createdAt: string;
    updatedAt: string;
}

interface UserBook {
    id: string;
    readerId: string;
    readBookId: string;
    st_read?: string;
    end_read?: string;
    tagId?: string;
    review?: string;
    rate?: number;
    createdAt: string;
    updatedAt: string;
    title?: string;
    author?: string;
    thumbnail?: string;
    tagName?: string;
}

const API_BASE_URL = 'http://localhost:8000/api';

export default function MemoryPage() {
    const [books, setBooks] = useState<UserBook[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showTagForm, setShowTagForm] = useState(false);
    const [selectedTag, setSelectedTag] = useState<string>('');
    const [sortBy, setSortBy] = useState<'TimeDesc' | 'RateDesc' | ''>('');
    const [searchQuery, setSearchQuery] = useState('');

    // 폼 데이터
    const [bookForm, setBookForm] = useState({
        title: '',
        author: '',
        isbn: '',
        description: '',
        st_read: '',
        end_read: '',
        review: '',
        rate: 0,
        tagId: ''
    });

    const [tagForm, setTagForm] = useState({
        tagName: ''
    });

    // 데이터 로드
    useEffect(() => {
        loadBooks();
        loadTags();
    }, [selectedTag, sortBy]);

    const loadBooks = async () => {
        try {
            setLoading(true);
            let url = `${API_BASE_URL}/books?userId=user-1`;
            if (selectedTag) {
                url += `&tagId=${selectedTag}`;
            }
            if (sortBy) {
                url += `&sort=${sortBy}`;
            }

            const response = await fetch(url);
            const data = await response.json();
            
            if (data.success) {
                setBooks(data.data || []);
            }
        } catch (error) {
            console.error('Failed to load books:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadTags = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/tags?userId=user-1`);
            const data = await response.json();
            
            if (data.success) {
                setTags(data.data || []);
            }
        } catch (error) {
            console.error('Failed to load tags:', error);
        }
    };

    // 책 추가
    const handleAddBook = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const response = await fetch(`${API_BASE_URL}/books`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    readerId: 'user-1',
                    bookData: {
                        title: bookForm.title,
                        author: bookForm.author,
                        isbn: bookForm.isbn,
                        description: bookForm.description,
                    },
                    userBookData: {
                        st_read: bookForm.st_read,
                        end_read: bookForm.end_read,
                        review: bookForm.review,
                        rate: bookForm.rate || null,
                        tagId: bookForm.tagId || null,
                    }
                }),
            });

            const data = await response.json();
            
            if (data.success) {
                setShowAddForm(false);
                setBookForm({
                    title: '',
                    author: '',
                    isbn: '',
                    description: '',
                    st_read: '',
                    end_read: '',
                    review: '',
                    rate: 0,
                    tagId: ''
                });
                loadBooks();
            } else {
                alert('책 추가에 실패했습니다.');
            }
        } catch (error) {
            console.error('Failed to add book:', error);
            alert('책 추가 중 오류가 발생했습니다.');
        }
    };

    // 태그 추가
    const handleAddTag = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const response = await fetch(`${API_BASE_URL}/tags`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tagName: tagForm.tagName,
                    tagUserId: 'user-1'
                }),
            });

            const data = await response.json();
            
            if (data.success) {
                setShowTagForm(false);
                setTagForm({ tagName: '' });
                loadTags();
            } else {
                alert('태그 추가에 실패했습니다.');
            }
        } catch (error) {
            console.error('Failed to add tag:', error);
            alert('태그 추가 중 오류가 발생했습니다.');
        }
    };

    // 책 삭제
    const handleDeleteBook = async (bookId: string) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;
        
        try {
            const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
                method: 'DELETE',
            });

            const data = await response.json();
            
            if (data.success) {
                loadBooks();
            } else {
                alert('책 삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('Failed to delete book:', error);
            alert('책 삭제 중 오류가 발생했습니다.');
        }
    };

    // 검색 필터링
    const filteredBooks = books.filter(book => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            book.title?.toLowerCase().includes(query) ||
            book.author?.toLowerCase().includes(query) ||
            book.review?.toLowerCase().includes(query) ||
            book.tagName?.toLowerCase().includes(query)
        );
    });

    // 별점 표시
    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                ★
            </span>
        ));
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* 헤더 */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">📚 읽은 책 기억 도구</h1>
                        <Link href="/" className="text-blue-500 hover:text-blue-600 font-medium">
                            ← 메인으로 돌아가기
                        </Link>
                    </div>
                </div>

                {/* 컨트롤 패널 */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        {/* 검색 */}
                        <div className="flex-1 max-w-md">
                            <input
                                type="text"
                                placeholder="책 제목, 작가, 리뷰, 태그로 검색..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* 필터 및 정렬 */}
                        <div className="flex flex-wrap gap-2">
                            <select
                                value={selectedTag}
                                onChange={(e) => setSelectedTag(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">모든 태그</option>
                                {tags.map(tag => (
                                    <option key={tag.tagId} value={tag.tagId}>
                                        {tag.tagName}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as 'TimeDesc' | 'RateDesc' | '')}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">기본 정렬</option>
                                <option value="TimeDesc">최신순</option>
                                <option value="RateDesc">평점순</option>
                            </select>

                            <button
                                onClick={() => setShowTagForm(true)}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                                태그 추가
                            </button>

                            <button
                                onClick={() => setShowAddForm(true)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                책 추가
                            </button>
                        </div>
                    </div>
                </div>

                {/* 통계 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{books.length}</div>
                        <div className="text-gray-600">총 읽은 책</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">
                            {books.filter(book => book.end_read).length}
                        </div>
                        <div className="text-gray-600">완독한 책</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">{tags.length}</div>
                        <div className="text-gray-600">사용 중인 태그</div>
                    </div>
                </div>

                {/* 책 목록 */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        내 독서 기록 ({filteredBooks.length}권)
                    </h2>

                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-2 text-gray-600">로딩 중...</p>
                        </div>
                    ) : filteredBooks.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <p>아직 등록된 책이 없습니다.</p>
                            <p>첫 번째 책을 추가해보세요!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredBooks.map((book) => (
                                <div key={book.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg text-gray-800 mb-1">
                                                {book.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-2">
                                                by {book.author}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteBook(book.id)}
                                            className="text-red-500 hover:text-red-700 text-sm"
                                        >
                                            삭제
                                        </button>
                                    </div>

                                    {/* 태그 */}
                                    {book.tagName && (
                                        <div className="mb-3">
                                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                {book.tagName}
                                            </span>
                                        </div>
                                    )}

                                    {/* 읽기 기간 */}
                                    <div className="text-sm text-gray-600 mb-3">
                                        {book.st_read && (
                                            <p>시작: {new Date(book.st_read).toLocaleDateString()}</p>
                                        )}
                                        {book.end_read && (
                                            <p>완료: {new Date(book.end_read).toLocaleDateString()}</p>
                                        )}
                                        {!book.end_read && book.st_read && (
                                            <p className="text-orange-600">읽는 중...</p>
                                        )}
                                    </div>

                                    {/* 평점 */}
                                    {book.rate && (
                                        <div className="mb-3">
                                            <div className="flex items-center gap-1">
                                                {renderStars(book.rate)}
                                                <span className="text-sm text-gray-600 ml-1">
                                                    ({book.rate}/5)
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* 리뷰 */}
                                    {book.review && (
                                        <div className="bg-gray-50 p-3 rounded text-sm">
                                            <p className="text-gray-700">{book.review}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 책 추가 모달 */}
                {showAddForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                            <h3 className="text-lg font-semibold mb-4">새 책 추가</h3>
                            <form onSubmit={handleAddBook} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">책 제목 *</label>
                                    <input
                                        type="text"
                                        required
                                        value={bookForm.title}
                                        onChange={(e) => setBookForm({...bookForm, title: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">작가 *</label>
                                    <input
                                        type="text"
                                        required
                                        value={bookForm.author}
                                        onChange={(e) => setBookForm({...bookForm, author: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">ISBN</label>
                                    <input
                                        type="text"
                                        value={bookForm.isbn}
                                        onChange={(e) => setBookForm({...bookForm, isbn: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">설명</label>
                                    <textarea
                                        value={bookForm.description}
                                        onChange={(e) => setBookForm({...bookForm, description: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                        rows={3}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">읽기 시작일</label>
                                        <input
                                            type="date"
                                            value={bookForm.st_read}
                                            onChange={(e) => setBookForm({...bookForm, st_read: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">완독일</label>
                                        <input
                                            type="date"
                                            value={bookForm.end_read}
                                            onChange={(e) => setBookForm({...bookForm, end_read: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">태그</label>
                                    <select
                                        value={bookForm.tagId}
                                        onChange={(e) => setBookForm({...bookForm, tagId: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">태그 선택</option>
                                        {tags.map(tag => (
                                            <option key={tag.tagId} value={tag.tagId}>
                                                {tag.tagName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">평점</label>
                                    <select
                                        value={bookForm.rate}
                                        onChange={(e) => setBookForm({...bookForm, rate: Number(e.target.value)})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value={0}>평점 없음</option>
                                        <option value={1}>⭐ 1점</option>
                                        <option value={2}>⭐⭐ 2점</option>
                                        <option value={3}>⭐⭐⭐ 3점</option>
                                        <option value={4}>⭐⭐⭐⭐ 4점</option>
                                        <option value={5}>⭐⭐⭐⭐⭐ 5점</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">감상평</label>
                                    <textarea
                                        value={bookForm.review}
                                        onChange={(e) => setBookForm({...bookForm, review: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                        rows={4}
                                        placeholder="이 책에 대한 생각을 자유롭게 적어보세요..."
                                    />
                                </div>
                                <div className="flex gap-2 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
                                    >
                                        추가
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddForm(false)}
                                        className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition-colors"
                                    >
                                        취소
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* 태그 추가 모달 */}
                {showTagForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-sm">
                            <h3 className="text-lg font-semibold mb-4">새 태그 추가</h3>
                            <form onSubmit={handleAddTag} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">태그 이름 *</label>
                                    <input
                                        type="text"
                                        required
                                        value={tagForm.tagName}
                                        onChange={(e) => setTagForm({...tagForm, tagName: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                        placeholder="예: 소설, 자기계발, 기술서적"
                                    />
                                </div>
                                <div className="flex gap-2 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors"
                                    >
                                        추가
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowTagForm(false)}
                                        className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition-colors"
                                    >
                                        취소
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 