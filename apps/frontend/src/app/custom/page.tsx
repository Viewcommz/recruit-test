'use client';

import React from 'react';
import Link from 'next/link';

export default function CustomPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">✨ 자유 주제</h1>
                        <Link href="/" className="text-blue-500 hover:text-blue-600">
                            ← 메인으로 돌아가기
                        </Link>
                    </div>

                    {/* 구현 가이드 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div className="bg-blue-50 p-6 rounded-lg">
                            <h3 className="font-semibold mb-4">🎯 개발 목표</h3>
                            <div className="space-y-3 text-sm">
                                <p>• 어떠한 기술스택을 써도 무방</p>
                                <p>• 본인만의 자유로운 아이디어 구현</p>
                                <p>• 창의성과 실용성 모두 고려</p>
                            </div>
                        </div>

                        <div className="bg-green-50 p-6 rounded-lg">
                            <h3 className="font-semibold mb-4">💡 구현 힌트</h3>
                            <div className="text-sm space-y-2">
                                <p>• 독서와 관련된 새로운 문제 정의</p>
                                <p>• 기존 4가지 주제와 차별화</p>
                                <p>• 실제 사용 가능한 수준의 기능</p>
                                <p>• 독창적인 UI/UX</p>
                            </div>
                        </div>
                    </div>

                    {/* 구현 영역 */}
                    <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <p className="text-gray-500">
                            이 영역에 본인만의 독창적인 독서 도구를 자유롭게 구현해주세요.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
} 