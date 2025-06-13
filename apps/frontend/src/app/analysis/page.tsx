'use client';

import React from 'react';
import Link from 'next/link';

export default function AnalysisPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">📊 독서 패턴 분석</h1>
                        <Link href="/" className="text-blue-500 hover:text-blue-600">
                            ← 메인으로 돌아가기
                        </Link>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg mb-6">
                        <p className="text-sm text-gray-600">
                            이 페이지에서 독서 패턴 분석 기능을 구현해주세요.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
} 