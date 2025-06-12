/**
 * 공통 유틸리티 함수들
 */

// UUID 생성 함수 (간단한 버전)
export function generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// 날짜 포맷팅
export function formatDate(date: Date | string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("ko-KR");
}

// 현재 날짜를 ISO 문자열로 반환
export function getCurrentISOString(): string {
    return new Date().toISOString();
}

// 문자열을 슬러그로 변환
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w ]+/g, "")
        .replace(/ +/g, "-");
}

// 배열에서 중복 제거
export function unique<T>(array: T[]): T[] {
    return [...new Set(array)];
}

// 텍스트 자르기
export function truncate(text: string, length: number): string {
    if (text.length <= length) return text;
    return text.slice(0, length) + "...";
}

// 평점을 별 문자열로 변환
export function formatRating(rating: number): string {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        "★".repeat(fullStars) +
        (hasHalfStar ? "☆" : "") +
        "☆".repeat(emptyStars)
    );
}

// 페이지 수를 읽기 시간으로 변환 (분 단위)
export function estimateReadingTime(pageCount: number): number {
    // 평균적으로 1분에 1.5페이지 읽는다고 가정
    return Math.round(pageCount / 1.5);
}

// 독서 진행률 계산
export function calculateProgress(
    currentPage: number,
    totalPages: number
): number {
    if (totalPages === 0) return 0;
    return Math.round((currentPage / totalPages) * 100);
}

// 색상 유틸리티 (태그나 카테고리용)
export function getColorForTag(tag: string): string {
    const colors = [
        "bg-blue-100 text-blue-800",
        "bg-green-100 text-green-800",
        "bg-yellow-100 text-yellow-800",
        "bg-red-100 text-red-800",
        "bg-purple-100 text-purple-800",
        "bg-pink-100 text-pink-800",
        "bg-indigo-100 text-indigo-800",
    ];

    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
        hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
}
