'use client';

import React from 'react';
import Link from 'next/link';

export default function PriorityPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">📚 읽고 싶은 책 우선순위</h1>
                        <Link href="/" className="text-blue-500 hover:text-blue-600">
                            ← 메인으로 돌아가기
                        </Link>
                    </div>

                    {/* 구현 가이드 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div className="bg-blue-50 p-6 rounded-lg">
                            <h3 className="font-semibold mb-4">🎯 개발 목표</h3>
                            <div className="space-y-3 text-sm">
                                <p>• 프론트엔드: Next.js + TypeScript</p>
                                <p>• 백엔드: Express.js + API 구현</p>
                                <p>• 데이터: 백엔드 API 또는 localStorage</p>
                            </div>
                        </div>

                        <div className="bg-green-50 p-6 rounded-lg">
                            <h3 className="font-semibold mb-4">💡 구현 힌트</h3>
                            <div className="text-sm space-y-2">
                                <p>• POST /api/books - 책 추가</p>
                                <p>• GET /api/books - 책 목록 조회</p>
                                <p>• 우선순위 계산 알고리즘</p>
                                <p>• 정렬 및 필터링 기능</p>
                            </div>
                        </div>
                    </div>

                    {/* 구현 영역 */}
                    <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <p className="text-gray-500">
                            이 영역에 읽고 싶은 책 우선순위 기능을 구현해주세요.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
} 