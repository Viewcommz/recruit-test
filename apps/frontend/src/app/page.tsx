"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const [selectedProblem, setSelectedProblem] = useState<string>("");
    const [backendStatus, setBackendStatus] = useState<
        "checking" | "connected" | "disconnected"
    >("checking");
    const [showImplementation, setShowImplementation] = useState(false);
    const router = useRouter();

    // 백엔드 연결 상태 확인
    useEffect(() => {
        const checkBackendConnection = async () => {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);

                const response = await fetch(
                    "http://localhost:8000/api/health",
                    {
                        signal: controller.signal,
                        headers: {
                            Accept: "application/json",
                        },
                    }
                );

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const contentType = response.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    throw new Error("Response is not JSON");
                }

                const data = await response.json();
                if (data && data.status === "ok") {
                    setBackendStatus("connected");
                } else {
                    setBackendStatus("disconnected");
                }
            } catch (error) {
                console.error("Backend connection check failed:", error);
                setBackendStatus("disconnected");
            }
        };

        checkBackendConnection();
        const interval = setInterval(checkBackendConnection, 5000);
        return () => clearInterval(interval);
    }, []);

    const problems = [
        {
            id: "priority",
            title: "📖 읽고 싶은 책 우선순위",
            description: "많은 책 중에서 뭘 먼저 읽을지 결정하는 도구",
            emoji: "🎯",
        },
        {
            id: "memory",
            title: "📚 읽은 책 기억 도구",
            description: "읽은 책 내용을 기록하고 검색하는 도구",
            emoji: "🧠",
        },
        {
            id: "social",
            title: "👥 친구들 독서 현황",
            description: "친구들이 무엇을 읽는지 공유하는 도구",
            emoji: "🤝",
        },
        {
            id: "analysis",
            title: "📊 독서 패턴 분석",
            description: "나의 독서 습관을 분석하고 통계를 보는 도구",
            emoji: "📈",
        },
        {
            id: "custom",
            title: "✨ 자유 주제",
            description: "본인만의 독창적인 독서 도구를 자유롭게 구현",
            emoji: "💡",
            isCustom: true,
        },
    ];

    if (showImplementation) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold">
                                구현 중:{" "}
                                {
                                    problems.find(
                                        (p) => p.id === selectedProblem
                                    )?.title
                                }
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
                                <h3 className="font-semibold mb-4">
                                    🎯 개발 목표
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`w-3 h-3 rounded-full ${
                                                backendStatus === "connected"
                                                    ? "bg-green-500"
                                                    : "bg-red-500"
                                            }`}
                                        ></span>
                                        <span>
                                            백엔드 연결:{" "}
                                            {backendStatus === "connected"
                                                ? "정상"
                                                : "실패"}
                                        </span>
                                    </div>
                                    <p>• 프론트엔드: Next.js + TypeScript</p>
                                    <p>• 백엔드: Express.js + API 구현</p>
                                    <p>
                                        • 데이터: 백엔드 API 또는 localStorage
                                    </p>
                                    <p>• 시간: 60분 내 완성</p>
                                </div>
                            </div>

                            {/* 구현 힌트 */}
                            <div className="bg-green-50 p-6 rounded-lg">
                                <h3 className="font-semibold mb-4">
                                    💡 구현 힌트
                                </h3>
                                <div className="text-sm space-y-2">
                                    {selectedProblem === "priority" && (
                                        <>
                                            <p>• POST /api/books - 책 추가</p>
                                            <p>
                                                • GET /api/books - 책 목록 조회
                                            </p>
                                            <p>• 우선순위 계산 알고리즘</p>
                                            <p>• 정렬 및 필터링 기능</p>
                                        </>
                                    )}
                                    {selectedProblem === "memory" && (
                                        <>
                                            <p>
                                                • POST /api/reading-notes - 독서
                                                노트 저장
                                            </p>
                                            <p>
                                                • GET /api/reading-notes - 노트
                                                조회
                                            </p>
                                            <p>• 검색 및 태그 기능</p>
                                            <p>• 카드 형태 UI</p>
                                        </>
                                    )}
                                    {selectedProblem === "social" && (
                                        <>
                                            <p>
                                                • POST /api/friends - 친구 추가
                                            </p>
                                            <p>
                                                • GET /api/reading-status - 독서
                                                현황
                                            </p>
                                            <p>• 실시간 피드 구현</p>
                                            <p>• 진행률 표시</p>
                                        </>
                                    )}
                                    {selectedProblem === "analysis" && (
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
                            <h3 className="font-semibold mb-3">
                                🚀 이제 구현을 시작하세요!
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="font-medium">
                                        프론트엔드 개발:
                                    </p>
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
                        📚 AI툴 활용 개발 테스트
                    </h1>
                    <p className="text-xl text-gray-600 mb-2">
                        나만의 독서 도구 만들기 (풀스택)
                    </p>
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mx-auto max-w-2xl">
                        <p className="text-yellow-800">
                            ⏰ <strong>시간 제한: 60분</strong> | 🎯{" "}
                            <strong>목표: 1-2개 문제 해결</strong> | 🤖{" "}
                            <strong>AI 도구 적극 활용</strong>
                        </p>
                    </div>

                    {/* 백엔드 연결 상태 */}
                    <div className="mt-4">
                        <div
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
                                backendStatus === "connected"
                                    ? "bg-green-100 text-green-800"
                                    : backendStatus === "disconnected"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                        >
                            <span
                                className={`w-2 h-2 rounded-full ${
                                    backendStatus === "connected"
                                        ? "bg-green-500"
                                        : backendStatus === "disconnected"
                                        ? "bg-red-500"
                                        : "bg-gray-500"
                                }`}
                            ></span>
                            백엔드 서버:{" "}
                            {backendStatus === "connected"
                                ? "연결됨"
                                : backendStatus === "disconnected"
                                ? "연결 실패"
                                : "확인 중..."}
                        </div>
                    </div>
                </div>

                {/* 문제 선택 */}
                {!selectedProblem && (
                    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                        <h2 className="text-2xl font-semibold mb-6 text-center">
                            해결하고 싶은 문제를 선택하세요
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            {problems.map((problem) => (
                                <div
                                    key={problem.id}
                                    onClick={() =>
                                        setSelectedProblem(problem.id)
                                    }
                                    className={`p-6 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                                        selectedProblem === problem.id
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    <div className="text-4xl mb-3">
                                        {problem.emoji}
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">
                                        {problem.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        {problem.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 선택된 문제 상세 */}
                {selectedProblem && (
                    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                        <h2 className="text-2xl font-semibold mb-4">
                            선택된 문제:{" "}
                            {
                                problems.find((p) => p.id === selectedProblem)
                                    ?.title
                            }
                        </h2>

                        <div className="bg-blue-50 p-6 rounded-lg mb-6">
                            <h3 className="font-semibold mb-3">
                                💡 풀스택 구현 아이디어:
                            </h3>
                            {selectedProblem === "priority" && (
                                <ul className="text-sm space-y-1">
                                    <li>
                                        • <strong>프론트엔드:</strong> 책 입력
                                        폼, 우선순위 목록 표시
                                    </li>
                                    <li>
                                        • <strong>백엔드:</strong> POST
                                        /api/books, GET /api/books
                                    </li>
                                    <li>
                                        • <strong>로직:</strong> 우선순위 계산
                                        알고리즘
                                    </li>
                                    <li>
                                        • <strong>데이터:</strong> 메모리 저장
                                        또는 간단한 JSON 파일
                                    </li>
                                </ul>
                            )}
                            {selectedProblem === "memory" && (
                                <ul className="text-sm space-y-1">
                                    <li>
                                        • <strong>프론트엔드:</strong> 독서 노트
                                        입력, 검색/필터 UI
                                    </li>
                                    <li>
                                        • <strong>백엔드:</strong> POST
                                        /api/notes, GET /api/notes
                                    </li>
                                    <li>
                                        • <strong>로직:</strong> 키워드 검색,
                                        태그 필터링
                                    </li>
                                    <li>
                                        • <strong>데이터:</strong> 노트 데이터
                                        CRUD 구현
                                    </li>
                                </ul>
                            )}
                            {selectedProblem === "social" && (
                                <ul className="text-sm space-y-1">
                                    <li>
                                        • <strong>프론트엔드:</strong> 친구
                                        목록, 독서 현황 피드
                                    </li>
                                    <li>
                                        • <strong>백엔드:</strong> POST
                                        /api/friends, GET /api/status
                                    </li>
                                    <li>
                                        • <strong>로직:</strong> 친구 관계, 독서
                                        상태 관리
                                    </li>
                                    <li>
                                        • <strong>데이터:</strong> 사용자별 독서
                                        현황 저장
                                    </li>
                                </ul>
                            )}
                            {selectedProblem === "analysis" && (
                                <ul className="text-sm space-y-1">
                                    <li>
                                        • <strong>프론트엔드:</strong> 차트
                                        표시, 통계 대시보드
                                    </li>
                                    <li>
                                        • <strong>백엔드:</strong> GET
                                        /api/stats, 데이터 집계
                                    </li>
                                    <li>
                                        • <strong>로직:</strong> 독서 패턴 분석,
                                        통계 계산
                                    </li>
                                    <li>
                                        • <strong>데이터:</strong> 독서 기록
                                        데이터 분석
                                    </li>
                                </ul>
                            )}
                            {selectedProblem === "custom" && (
                                <ul className="text-sm space-y-1">
                                    <li>• 어떠한 기술스택을 써도 무방</li>
                                    <li>• 본인만의 자유로운 아이디어 구현</li>
                                </ul>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() =>
                                    router.push(`/${selectedProblem}`)
                                }
                                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
                                    backendStatus === "connected"
                                        ? "bg-blue-600 text-white hover:bg-blue-700"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                            >
                                🚀 구현 시작하기
                                {backendStatus !== "connected" &&
                                    " (백엔드 연결 필요)"}
                            </button>

                            <button
                                onClick={() => setSelectedProblem("")}
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
                        <h2 className="text-2xl font-semibold">
                            📖 개발 가이드
                        </h2>
                    </div>

                    <div className="prose max-w-none">
                        {/* 테스트 개요 */}
                        <div className="bg-blue-50 p-6 rounded-lg mb-6">
                            <h3 className="text-lg font-semibold my-2">
                                🧭 테스트 개요
                            </h3>
                            <ul className="text-sm list-disc pl-5">
                                <li>
                                    Next.js(프론트엔드) + Express.js(백엔드)
                                    기반 풀스택 개발 테스트
                                </li>
                                <li>
                                    문제 정의, 기획, 구현, 회고까지 실무와
                                    유사한 전과정 경험
                                </li>
                                <li>
                                    AI 도구는 기본 제공되는 <b>Kiro</b> 사용
                                    (본인이 사용하는 도구 사용 가능)
                                </li>
                                <li>
                                    <b>목표</b>: 창의적 문제 해결, AI 협업,
                                    풀스택 구현 역량
                                </li>
                                <li>
                                    <b>주요 도구</b>: Next.js, Express.js,
                                    TypeScript, Tailwind CSS
                                </li>
                            </ul>
                        </div>

                        {/* 평가 기준 */}
                        <div className="bg-purple-50 p-6 rounded-lg mb-6">
                            <h3 className="text-lg font-semibold my-2">
                                📊 평가 기준
                            </h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold w-24">
                                        창의적 기획
                                    </span>
                                    <span className="text-purple-700">25%</span>
                                    <span className="text-gray-600">
                                        문제 정의, 해결 방법의 참신함
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold w-24">
                                        AI 활용도
                                    </span>
                                    <span className="text-purple-700">35%</span>
                                    <span className="text-gray-600">
                                        AI 프롬프트 품질, 활용 효율성
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold w-24">
                                        풀스택 구현
                                    </span>
                                    <span className="text-purple-700">30%</span>
                                    <span className="text-gray-600">
                                        프론트-백엔드 연동, API 설계
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold w-24">
                                        코드 품질
                                    </span>
                                    <span className="text-purple-700">10%</span>
                                    <span className="text-gray-600">
                                        가독성, 구조화
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 기본 실행 가이드 */}
                        <div className="bg-green-50 p-6 rounded-lg mb-6">
                            <h3 className="text-lg font-semibold my-2">
                                ⚡️ 기본 실행 가이드
                            </h3>
                            <ul className="text-sm list-disc pl-5 mb-2">
                                <li>아래 명령어로 개발 환경을 실행하세요.</li>
                            </ul>
                            <div className="bg-white p-4 rounded border text-xs">
                                <pre className="whitespace-pre-wrap">
                                    {`cd recruit-test
npm install
npm run dev
# 프론트엔드: http://localhost:3000
# 백엔드: http://localhost:8000`}
                                </pre>
                            </div>
                        </div>

                        {/* 브랜치 전략 */}
                        <div className="bg-yellow-50 p-6 rounded-lg mb-6">
                            <h3 className="text-lg font-semibold my-2">
                                🌳 브랜치 전략
                            </h3>
                            <ul className="text-sm list-disc pl-5">
                                <li>dev 브랜치에서 직접 작업/커밋/푸시 금지</li>
                                <li>
                                    반드시 <code>features/지원자이름</code>{" "}
                                    브랜치 생성 후 해당 브랜치에서만 작업
                                </li>
                                <li>
                                    예시:{" "}
                                    <code>
                                        git checkout -b features/hong-gil-dong
                                        dev
                                    </code>
                                </li>
                            </ul>
                        </div>

                        {/* 커밋 가이드 */}
                        <div className="bg-orange-50 p-6 rounded-lg mb-6">
                            <h3 className="text-lg font-semibold my-2">
                                💾 커밋 가이드
                            </h3>
                            <ul className="text-sm list-disc pl-5">
                                <li>
                                    기능 단위로 커밋 (예:{" "}
                                    <code>feat: 책 추가 API 구현</code>)
                                </li>
                                <li>
                                    의미 없는 <code>fix</code>,{" "}
                                    <code>update</code> 단독 커밋 금지
                                </li>
                                <li>커밋 메시지는 목적이 드러나게 작성</li>
                            </ul>
                        </div>

                        {/* PLANNING.md 안내 */}
                        <div className="bg-gray-50 p-6 rounded-lg mb-6">
                            <h3 className="text-lg font-semibold my-2">
                                📝 PLANNING.md 작성 안내
                            </h3>
                            <ul className="text-sm list-disc pl-5 mb-2">
                                <li>
                                    개발 시작 전, 본인이 선택한 문제와 해결
                                    전략을 간단히 정리
                                </li>
                                <li>
                                    아래 항목을 참고해 <b>docs/PLANNING.md</b>{" "}
                                    파일로 작성
                                </li>
                            </ul>
                            <div className="bg-white p-4 rounded border text-xs">
                                <b>예시 템플릿</b>
                                <br />
                                <pre className="whitespace-pre-wrap">
                                    {`# 기획서

## 선택한 문제
- (예시) 읽고 싶은 책 우선순위, 친구들 독서 현황

## 핵심 기능
1. (예시) 책 추가/삭제/수정
2. (예시) 우선순위 자동 계산
3. (예시) 친구별 독서 현황 피드

## 데이터 구조/주요 API 설계
- Book, User, Friend 등 주요 타입/엔드포인트 간단 정의

## 기대 효과 및 차별화 포인트
- 실제로 어떤 문제를 해결할지, 기존과 다른 점
`}
                                </pre>
                            </div>
                        </div>

                        {/* REPORT.md 안내 */}
                        <div className="bg-yellow-50 p-6 rounded-lg mb-6">
                            <h3 className="text-lg font-semibold my-2">
                                📝 REPORT.md 작성 안내
                            </h3>
                            <ul className="text-sm list-disc pl-5 mb-2">
                                <li>
                                    개발 완료 후, 본인의 개발 경험/회고/메시지를{" "}
                                    <b>docs/REPORT.md</b>로 자유롭게 작성
                                </li>
                                <li>
                                    아래 항목을 참고해 작성 (형식/분량 자유)
                                </li>
                            </ul>
                            <div className="bg-white p-4 rounded border text-xs">
                                <b>예시 템플릿</b>
                                <br />
                                <pre className="whitespace-pre-wrap">
                                    {`## 1. 개발 결과 요약
- 어떤 문제를 선택했고, 어떻게 해결했는지 간단히 요약
- 구현한 주요 기능(3~4개)
- 본인이 생각하는 완성도/만족도

## 2. 개발 과정에서 느낀 점/회고
- 개발 중 어려웠던 점, 극복 방법
- 시간 배분/우선순위 결정에서의 고민
- 본인만의 개발/설계 전략
- (선택) AI 활용이 실제로 도움이 된 부분

## 3. 아쉬운 점 & 추가로 하고 싶었던 것
- 시간/역량상 미구현한 기능, 아쉬운 점
- 더 개선하고 싶은 부분, 남은 아이디어

## 4. 본인만의 인사이트/메시지 (자유)
- 이번 테스트를 통해 느낀 점, 배운 점
- AI와 협업하며 새롭게 얻은 개발 인사이트
- 채용 담당자에게 남기고 싶은 메시지
`}
                                </pre>
                            </div>
                        </div>

                        {/* AI 활용 내역 제출 */}
                        <div className="bg-indigo-50 p-6 rounded-lg mb-6">
                            <h3 className="text-lg font-semibold my-2">
                                🤖 AI 활용 내역 제출(PROMPT.md)
                            </h3>
                            <ul className="text-sm list-disc pl-5">
                                <li>
                                    출력창의{" "}
                                    <code>
                                        Kiro - LLM Prompt/Completion 콘솔
                                    </code>
                                    내 프롬프트 대화 내역 전체를 복사하여{" "}
                                    <b>docs/PROMPT.md</b>에 저장
                                </li>
                                <li>
                                    <img src="llm_example.png" />
                                </li>
                                <li>
                                    <b>assistant</b>의 내용은 보이지 않아도 무관
                                </li>
                                <li>
                                    Kiro 이외 지원자가 별도로 사용한 AI 활용
                                    내역이 있다면 해당 파일 내 같이 저장
                                </li>
                                <li>
                                    프롬프트 내역은 평가 기준 중{" "}
                                    <b>AI 활용도(35%)</b>에 반영
                                </li>
                            </ul>
                        </div>

                        {/* 유의사항 */}
                        <div className="bg-red-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold my-2">
                                ⚠️ 유의사항
                            </h3>
                            <ul className="text-sm list-disc pl-5">
                                <li>
                                    완벽보다 <b>작동하는 프로토타입</b> 완성이
                                    목표
                                </li>
                                <li>
                                    프론트-백엔드 연동, RESTful API, 최소한의
                                    UI/UX에 집중
                                </li>
                                <li>
                                    AI 도구 활용 흔적(프롬프트 내역) 반드시 포함
                                </li>
                                <li>dev 브랜치에 직접 push 금지</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
