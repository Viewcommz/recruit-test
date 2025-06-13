'use client';

import React from 'react';
import Link from 'next/link';

export default function SocialPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">👥 친구들 독서 현황</h1>
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
                                <p>• POST /api/friends - 친구 추가</p>
                                <p>• GET /api/reading-status - 독서 현황</p>
                                <p>• 실시간 피드 구현</p>
                                <p>• 진행률 표시</p>
                            </div>
                        </div>
                    </div>

                    {/* 구현 영역 */}
                    <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <p className="text-gray-500">
                            이 영역에 친구들 독서 현황 기능을 구현해주세요.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
} 