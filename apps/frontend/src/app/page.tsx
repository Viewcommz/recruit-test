'use client';

import React, { useState, useEffect } from 'react';

export default function Home() {
    const [selectedProblem, setSelectedProblem] = useState<string>('');
    const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
    const [showImplementation, setShowImplementation] = useState(false);
    const [showGuide, setShowGuide] = useState(false);

    // 백엔드 연결 상태 확인
    useEffect(() => {
        const checkBackendConnection = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/health');
                if (response.ok) {
                    setBackendStatus('connected');
                } else {
                    setBackendStatus('disconnected');
                }
            } catch (error) {
                setBackendStatus('disconnected');
            }
        };

        checkBackendConnection();
        // 5초마다 연결 상태 확인
        const interval = setInterval(checkBackendConnection, 5000);
        return () => clearInterval(interval);
    }, []);

    const problems = [
        {
            id: 'priority',
            title: '📖 읽고 싶은 책 우선순위',
            description: '많은 책 중에서 뭘 먼저 읽을지 결정하는 도구',
            emoji: '🎯'
        },
        {
            id: 'memory',
            title: '📚 읽은 책 기억 도구',
            description: '읽은 책 내용을 기록하고 검색하는 도구',
            emoji: '🧠'
        },
        {
            id: 'social',
            title: '👥 친구들 독서 현황',
            description: '친구들이 무엇을 읽는지 공유하는 도구',
            emoji: '🤝'
        },
        {
            id: 'analysis',
            title: '📊 독서 패턴 분석',
            description: '나의 독서 습관을 분석하고 통계를 보는 도구',
            emoji: '📈'
        }
    ];

    if (showImplementation) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold">
                                구현 중: {problems.find(p => p.id === selectedProblem)?.title}
                            </h1>
                            <button
                                onClick={() => setShowImplementation(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                ← 돌아가기
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* 개발 가이드 */}
                            <div className="bg-blue-50 p-6 rounded-lg">
                                <h3 className="font-semibold mb-4">🎯 개발 목표</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-3 h-3 rounded-full ${backendStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                        <span>백엔드 연결: {backendStatus === 'connected' ? '정상' : '실패'}</span>
                                    </div>
                                    <p>• 프론트엔드: Next.js + TypeScript</p>
                                    <p>• 백엔드: Express.js + API 구현</p>
                                    <p>• 데이터: 백엔드 API 또는 localStorage</p>
                                    <p>• 시간: 60분 내 완성</p>
                                </div>
                            </div>

                            {/* 구현 힌트 */}
                            <div className="bg-green-50 p-6 rounded-lg">
                                <h3 className="font-semibold mb-4">💡 구현 힌트</h3>
                                <div className="text-sm space-y-2">
                                    {selectedProblem === 'priority' && (
                                        <>
                                            <p>• POST /api/books - 책 추가</p>
                                            <p>• GET /api/books - 책 목록 조회</p>
                                            <p>• 우선순위 계산 알고리즘</p>
                                            <p>• 정렬 및 필터링 기능</p>
                                        </>
                                    )}
                                    {selectedProblem === 'memory' && (
                                        <>
                                            <p>• POST /api/reading-notes - 독서 노트 저장</p>
                                            <p>• GET /api/reading-notes - 노트 조회</p>
                                            <p>• 검색 및 태그 기능</p>
                                            <p>• 카드 형태 UI</p>
                                        </>
                                    )}
                                    {selectedProblem === 'social' && (
                                        <>
                                            <p>• POST /api/friends - 친구 추가</p>
                                            <p>• GET /api/reading-status - 독서 현황</p>
                                            <p>• 실시간 피드 구현</p>
                                            <p>• 진행률 표시</p>
                                        </>
                                    )}
                                    {selectedProblem === 'analysis' && (
                                        <>
                                            <p>• GET /api/stats - 독서 통계</p>
                                            <p>• 차트 라이브러리 활용</p>
                                            <p>• 데이터 시각화</p>
                                            <p>• 인사이트 생성</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 p-6 bg-yellow-50 rounded-lg">
                            <h3 className="font-semibold mb-3">🚀 이제 구현을 시작하세요!</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="font-medium">프론트엔드 개발:</p>
                                    <p>• apps/frontend/src/app/page.tsx 수정</p>
                                    <p>• 컴포넌트 분리 (선택사항)</p>
                                    <p>• API 호출 로직 구현</p>
                                </div>
                                <div>
                                    <p className="font-medium">백엔드 개발:</p>
                                    <p>• apps/backend/src/index.ts 수정</p>
                                    <p>• API 엔드포인트 추가</p>
                                    <p>• 데이터 처리 로직 구현</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-4xl mx-auto">
                {/* 헤더 */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        📚 1시간 AI 개발 테스트
                    </h1>
                    <p className="text-xl text-gray-600 mb-2">
                        나만의 독서 도구 만들기 (풀스택)
                    </p>
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mx-auto max-w-2xl">
                        <p className="text-yellow-800">
                            ⏰ <strong>시간 제한: 60분</strong> |
                            🎯 <strong>목표: 1-2개 문제 해결</strong> |
                            🤖 <strong>AI 도구 적극 활용</strong>
                        </p>
                    </div>

                    {/* 백엔드 연결 상태 */}
                    <div className="mt-4">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm ${backendStatus === 'connected'
                            ? 'bg-green-100 text-green-800'
                            : backendStatus === 'disconnected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                            <span className={`w-2 h-2 rounded-full ${backendStatus === 'connected'
                                ? 'bg-green-500'
                                : backendStatus === 'disconnected'
                                    ? 'bg-red-500'
                                    : 'bg-gray-500'
                                }`}></span>
                            백엔드 서버: {
                                backendStatus === 'connected' ? '연결됨' :
                                    backendStatus === 'disconnected' ? '연결 실패' : '확인 중...'
                            }
                        </div>
                    </div>
                </div>

                {/* 문제 선택 */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-semibold mb-6 text-center">
                        해결하고 싶은 문제를 선택하세요
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        {problems.map((problem) => (
                            <div
                                key={problem.id}
                                onClick={() => setSelectedProblem(problem.id)}
                                className={`p-6 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${selectedProblem === problem.id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="text-4xl mb-3">{problem.emoji}</div>
                                <h3 className="text-lg font-semibold mb-2">{problem.title}</h3>
                                <p className="text-gray-600 text-sm">{problem.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 선택된 문제 상세 */}
                {selectedProblem && (
                    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                        <h2 className="text-2xl font-semibold mb-4">
                            선택된 문제: {problems.find(p => p.id === selectedProblem)?.title}
                        </h2>

                        <div className="bg-blue-50 p-6 rounded-lg mb-6">
                            <h3 className="font-semibold mb-3">💡 풀스택 구현 아이디어:</h3>
                            {selectedProblem === 'priority' && (
                                <ul className="text-sm space-y-1">
                                    <li>• <strong>프론트엔드:</strong> 책 입력 폼, 우선순위 목록 표시</li>
                                    <li>• <strong>백엔드:</strong> POST /api/books, GET /api/books</li>
                                    <li>• <strong>로직:</strong> 우선순위 계산 알고리즘</li>
                                    <li>• <strong>데이터:</strong> 메모리 저장 또는 간단한 JSON 파일</li>
                                </ul>
                            )}
                            {selectedProblem === 'memory' && (
                                <ul className="text-sm space-y-1">
                                    <li>• <strong>프론트엔드:</strong> 독서 노트 입력, 검색/필터 UI</li>
                                    <li>• <strong>백엔드:</strong> POST /api/notes, GET /api/notes</li>
                                    <li>• <strong>로직:</strong> 키워드 검색, 태그 필터링</li>
                                    <li>• <strong>데이터:</strong> 노트 데이터 CRUD 구현</li>
                                </ul>
                            )}
                            {selectedProblem === 'social' && (
                                <ul className="text-sm space-y-1">
                                    <li>• <strong>프론트엔드:</strong> 친구 목록, 독서 현황 피드</li>
                                    <li>• <strong>백엔드:</strong> POST /api/friends, GET /api/status</li>
                                    <li>• <strong>로직:</strong> 친구 관계, 독서 상태 관리</li>
                                    <li>• <strong>데이터:</strong> 사용자별 독서 현황 저장</li>
                                </ul>
                            )}
                            {selectedProblem === 'analysis' && (
                                <ul className="text-sm space-y-1">
                                    <li>• <strong>프론트엔드:</strong> 차트 표시, 통계 대시보드</li>
                                    <li>• <strong>백엔드:</strong> GET /api/stats, 데이터 집계</li>
                                    <li>• <strong>로직:</strong> 독서 패턴 분석, 통계 계산</li>
                                    <li>• <strong>데이터:</strong> 독서 기록 데이터 분석</li>
                                </ul>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => setShowImplementation(true)}
                                disabled={backendStatus !== 'connected'}
                                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${backendStatus === 'connected'
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                🚀 구현 시작하기
                                {backendStatus !== 'connected' && ' (백엔드 연결 필요)'}
                            </button>

                            <button
                                onClick={() => setSelectedProblem('')}
                                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                            >
                                다시 선택하기
                            </button>
                        </div>
                    </div>
                )}

                {/* 개발 가이드 섹션 */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold">📖 개발 가이드</h2>
                        <button
                            onClick={() => setShowGuide(!showGuide)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {showGuide ? '가이드 숨기기' : '가이드 보기'}
                        </button>
                    </div>

                    {showGuide && (
                        <div className="prose max-w-none">
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold mb-4">🎯 테스트 개요</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                    <div>
                                        <p><strong>소요시간:</strong> 60분 (정확히 1시간)</p>
                                        <p><strong>테스트 형태:</strong> 개인 풀스택 프로토타이핑</p>
                                        <p><strong>평가 목적:</strong> AI 도구 활용한 빠른 풀스택 개발 능력</p>
                                    </div>
                                    <div>
                                        <p><strong>프론트엔드:</strong> Next.js 14 + TypeScript</p>
                                        <p><strong>백엔드:</strong> Express.js + TypeScript</p>
                                        <p><strong>데이터:</strong> 메모리 저장 또는 JSON 파일</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 bg-blue-50 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold mb-4">📊 평가 기준</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">25%</div>
                                        <div className="font-medium">창의적 기획</div>
                                        <div className="text-xs text-gray-600">문제 선택의 독창성</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-600">35%</div>
                                        <div className="font-medium">AI 활용도</div>
                                        <div className="text-xs text-gray-600">프롬프트 품질</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-purple-600">30%</div>
                                        <div className="font-medium">풀스택 구현</div>
                                        <div className="text-xs text-gray-600">프론트-백엔드 연동</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-orange-600">10%</div>
                                        <div className="font-medium">코드 품질</div>
                                        <div className="text-xs text-gray-600">가독성, 구조화</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 bg-yellow-50 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold mb-4">⏰ 시간 관리</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                    <div>
                                        <h4 className="font-medium mb-2">권장 시간 배분:</h4>
                                        <ul className="space-y-1">
                                            <li>• 기획: 5-10분</li>
                                            <li>• 백엔드 API 구현: 15-20분</li>
                                            <li>• 프론트엔드 구현: 15-20분</li>
                                            <li>• 연동 및 테스트: 5-10분</li>
                                            <li>• 정리: 5분</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-2">시간 체크포인트:</h4>
                                        <ul className="space-y-1">
                                            <li>• 15분: API 엔드포인트 1-2개 완성</li>
                                            <li>• 30분: 백엔드 기본 구조 완성</li>
                                            <li>• 45분: 프론트엔드-백엔드 연동 완료</li>
                                            <li>• 55분: 최종 테스트 및 정리</li>
                                            <li>• 60분: 제출 준비 완료</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 bg-green-50 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold mb-4">📤 제출 결과물</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <h4 className="font-medium mb-2">1. 작동하는 풀스택 앱</h4>
                                        <ul className="space-y-1 text-xs">
                                            <li>• npm run dev로 실행 가능</li>
                                            <li>• 프론트엔드(3000) 정상 작동</li>
                                            <li>• 백엔드(8000) 정상 작동</li>
                                            <li>• API 연동 정상 동작</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-2">2. 기획서 (PLANNING.md)</h4>
                                        <ul className="space-y-1 text-xs">
                                            <li>• 선택한 문제와 해결 방법</li>
                                            <li>• 프론트엔드/백엔드 역할 분담</li>
                                            <li>• API 엔드포인트 설계</li>
                                            <li>• 예상 사용 시나리오</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-2">3. AI 활용 리포트</h4>
                                        <ul className="space-y-1 text-xs">
                                            <li>• 사용한 AI 도구 목록</li>
                                            <li>• 주요 프롬프트 3-5개</li>
                                            <li>• AI 활용 효과 분석</li>
                                            <li>• 절약된 시간 추정</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 bg-red-50 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold mb-4">📝 참고사항</h3>
                                <ul className="text-sm space-y-2">
                                    <li>• 완벽한 구현보다는 <strong>작동하는 풀스택 프로토타입</strong> 완성이 목표</li>
                                    <li>• <strong>프론트엔드-백엔드 연동</strong>이 핵심 평가 요소</li>
                                    <li>• <strong>AI 도구 활용 능력</strong>이 가장 중요한 평가 기준</li>
                                    <li>• 시간 부족 시 <strong>우선순위</strong>를 정해서 핵심 기능부터 완성</li>
                                    <li>• 막히는 부분이 있어도 <strong>포기하지 말고</strong> AI의 도움을 적극 활용</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 