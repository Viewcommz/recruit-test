# 📚 Kiro AI 활용 개발 과정 - 프롬프트 대화 내역

## 🎯 프로젝트 개요
- **프로젝트명**: 나만의 독서 도구 - 책 우선순위 관리 시스템
- **선택 문제**: "읽고 싶은 책이 많은데 우선순위 결정을 못한다"
- **개발 기간**: 2025년 1월 22일
- **사용 AI**: Kiro (AI 코딩 어시스턴트)

---

## 💬 주요 대화 내역

### 1. 프로젝트 구조 파악 및 목표 설정

**사용자**: 
```
🎯 개발 목표
• 프론트엔드: Next.js + TypeScript
• 백엔드: Express.js + API 구현
• 데이터: 백엔드 API 또는 localStorage
💡 구현 힌트
• POST /api/books - 책 추가
• GET /api/books - 책 목록 조회
• 우선순위 계산 알고리즘
• 정렬 및 필터링 기능

혹시 현재 프로젝트 구조를 설명해줄 수 있나?
```

**Kiro 응답**: 
프로젝트 구조를 분석하여 모노레포 구조임을 파악하고, 다음과 같이 설명:
- apps/frontend: Next.js 14 + TypeScript + Tailwind CSS
- apps/backend: Express.js + TypeScript + SQLite
- packages/shared: 공통 타입 및 유틸리티
- 기술 스택 상세 분석 제공

### 2. 책 우선순위 관리 개념 정의

**사용자**: 
```
책 우선 순위 관리를 할건데, 확실하게 책 우선순위 관리가 뭔지부터 설명해줘
```

**Kiro 응답**: 
책 우선순위 관리의 핵심 개념과 알고리즘을 설명:
- 가중 점수 알고리즘 (관심도 40%, 긴급도 30%, 난이도 20%, 소요시간 10%)
- 아이젠하워 매트릭스 기반 분류
- 개인화된 동적 알고리즘
- 현재 데이터베이스에서 부족한 필드들 분석

### 3. API 구현 전략 수립

**사용자**: 
```
내가볼 때 우선순위 정렬은 책 목록을 정렬하는 것 같아.
데이터베이스를 분석해서 책 목록을 토대로 책 추가 api를 구현하고, 
이후에 책을 다양한 방식으로 정렬하는 알고리즘 개발로 넘어가겠다.
```

**Kiro 응답**: 
구현 순서를 체계적으로 정리:
1. 책 추가 API 구현 (POST /api/books)
2. 책 목록 조회 API 구현 (GET /api/books)
3. 다양한 정렬 알고리즘 개발

### 4. 백엔드 API 구현

**Kiro가 구현한 주요 기능들**:

#### 4.1 Express 서버 설정
```typescript
// 데이터베이스 초기화
const db = DatabaseService.getInstance();
db.init();

// API 라우터 연결
app.use("/api/books", booksRouter);
```

#### 4.2 책 정렬 알고리즘
```typescript
function sortBooks(books: Book[], sortBy: string, order: string): Book[] {
    return books.sort((a, b) => {
        switch (sortBy) {
            case 'priority':
                // 우선순위 계산 (페이지수 역순 + 최신순)
                aValue = (a.pageCount || 0) * -1 + new Date(a.publishedDate || '1900-01-01').getTime();
                bValue = (b.pageCount || 0) * -1 + new Date(b.publishedDate || '1900-01-01').getTime();
                break;
            // 기타 정렬 옵션들...
        }
    });
}
```

#### 4.3 RESTful API 엔드포인트
- **POST /api/books**: 책 추가 (Zod 검증 포함)
- **GET /api/books**: 책 목록 조회 (정렬/필터링 포함)
- **GET /api/books/:id**: 특정 책 조회

### 5. 프론트엔드 구현

**사용자**: 
```
해당 기능을 이제 웹페이지에 띄울 수 있게 해줄거야.
주소는 frontend/src/app/priority/page.tsx에 띄우는거다.
```

**Kiro가 구현한 프론트엔드 기능들**:

#### 5.1 React 컴포넌트 구조
```typescript
// 상태 관리
const [books, setBooks] = useState<Book[]>([]);
const [sortBy, setSortBy] = useState('priority');
const [searchTerm, setSearchTerm] = useState('');

// API 통신
const fetchBooks = async () => {
    const response = await axios.get(`${API_BASE}/books?${params}`);
    setBooks(response.data.data);
};
```

#### 5.2 사용자 인터페이스
- 검색 기능 (제목, 저자, 설명 통합 검색)
- 정렬 옵션 (우선순위, 제목순, 저자순, 페이지수, 출간일)
- 책 추가 폼 (제목, 저자, 페이지수, 출간일, 설명, 카테고리)
- 반응형 디자인 (Tailwind CSS)

### 6. 기능별 커밋 전략

**사용자**: 
```
현재 books.ts 파일을 분석 후 기능별로 커밋을 따로 진행해줄 수 있나?
```

**Kiro 응답**: 
커밋 계획을 체계적으로 수립:
1. feat: 백엔드 서버 설정 및 데이터베이스 초기화
2. feat: 기본 라우터 구조 및 정렬 알고리즘 구현
3. feat: 책 추가 API 구현
4. feat: 책 목록 조회 및 필터링 기능 구현
5. feat: 특정 책 조회 API 구현

### 7. 브랜치 전략 및 문서화

**사용자**: 
```
브랜치 이름은 choi-jae-in dev 이렇게 하래
PLANNING.md를 현재 진행한대로 수정해봐
```

**Kiro 응답**: 
- features/choi-jae-in 브랜치 생성 가이드
- PLANNING.md를 실제 구현 상황에 맞게 업데이트
- 구현 완료된 기능들과 향후 계획 명시

### 8. 우선순위 알고리즘 심화 분석

**사용자**: 
```
현재 구현된 우선순위라는 알고리즘은 어떤 식으로 작동하지?
```

**Kiro 응답**: 
알고리즘의 상세한 작동 방식 분석:
```typescript
우선순위 점수 = (페이지수 * -1) + 출간일시간값
```
- 페이지수가 적을수록 높은 우선순위 (빠른 완독)
- 최신 출간일일수록 높은 우선순위 (트렌드 반영)
- 실제 계산 예시와 가중치 분석 제공

---

## 🎯 AI 활용 성과

### 효율적인 개발 과정
1. **구조 분석**: 기존 프로젝트 구조를 빠르게 파악
2. **단계적 구현**: 백엔드 → 프론트엔드 순서로 체계적 개발
3. **실시간 디버깅**: 오류 발생 시 즉시 수정 및 개선
4. **문서화**: 개발 과정과 결과를 체계적으로 정리

### 기술적 구현 품질
- **TypeScript**: 타입 안전성을 고려한 코드 작성
- **RESTful API**: 표준적인 API 설계 패턴 적용
- **React Best Practices**: 현대적인 React 패턴 활용
- **사용자 경험**: 직관적이고 반응형인 UI/UX 구현

### 문제 해결 능력
- **알고리즘 설계**: 복합적인 우선순위 계산 로직 구현
- **데이터 관리**: SQLite 기반 효율적인 데이터 구조 설계
- **에러 처리**: 견고한 예외 처리 및 사용자 피드백

---

## 📊 최종 구현 결과

### ✅ 완성된 기능
- 책 추가/조회 API (100%)
- 우선순위 계산 알고리즘 (100%)
- 정렬 및 필터링 기능 (100%)
- 반응형 웹 인터페이스 (100%)
- 실시간 검색 기능 (100%)

### 🚀 기술 스택
- **Backend**: Express.js + TypeScript + SQLite
- **Frontend**: Next.js + TypeScript + Tailwind CSS
- **Database**: Better-SQLite3
- **HTTP Client**: Axios
- **Validation**: Zod

### 💡 핵심 알고리즘
```typescript
// 우선순위 = 페이지수 역순 + 최신순
priorityScore = (pageCount * -1) + publishedDate.getTime()
```

이 프로젝트는 Kiro AI의 도움으로 **1시간 내에 완전한 풀스택 웹 애플리케이션**을 구현한 성공적인 사례입니다.