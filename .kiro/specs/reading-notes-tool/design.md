# 설계 문서

## 개요

읽은 책 기억 도구는 기존의 BookShelf 시스템에 독서 노트 관리 기능을 추가하는 것입니다. 현재 `user_books` 테이블에 있는 `notes` 필드를 활용하되, 더 체계적인 노트 관리를 위해 별도의 `reading_notes` 테이블을 추가하여 구조화된 독서 노트 기능을 제공합니다.

## 아키텍처

### 데이터베이스 설계

현재 데이터베이스 구조를 확장하여 독서 노트 전용 테이블을 추가합니다:

```sql
CREATE TABLE IF NOT EXISTS reading_notes (
  id TEXT PRIMARY KEY,
  bookId TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT, -- JSON array
  pageNumber INTEGER,
  chapter TEXT,
  noteType TEXT DEFAULT 'general', -- 'quote', 'summary', 'thought', 'general'
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  FOREIGN KEY (bookId) REFERENCES books (id)
);

-- 검색 성능을 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_reading_notes_book ON reading_notes(bookId);
CREATE INDEX IF NOT EXISTS idx_reading_notes_tags ON reading_notes(tags);
CREATE INDEX IF NOT EXISTS idx_reading_notes_created ON reading_notes(createdAt);
```

### API 엔드포인트 설계

#### 1. POST /api/notes
독서 노트 생성

**요청 본문:**
```typescript
{
  bookId: string;
  title: string;
  content: string;
  tags?: string[];
  pageNumber?: number;
  chapter?: string;
  noteType?: 'quote' | 'summary' | 'thought' | 'general';
}
```

**응답:**
```typescript
{
  success: boolean;
  data: ReadingNote;
  message: string;
}
```

#### 2. GET /api/notes
독서 노트 조회 (검색 및 필터링 포함)

**쿼리 파라미터:**
- `search`: 키워드 검색 (제목, 내용에서 검색)
- `tags`: 태그 필터링 (쉼표로 구분된 태그 목록)
- `bookId`: 특정 책의 노트만 조회
- `noteType`: 노트 타입별 필터링
- `sort`: 정렬 기준 ('newest', 'oldest', 'title')
- `limit`: 페이지당 항목 수
- `offset`: 페이지네이션 오프셋

**응답:**
```typescript
{
  success: boolean;
  data: {
    notes: ReadingNote[];
    total: number;
    hasMore: boolean;
  };
}
```

#### 3. PUT /api/notes/:id
독서 노트 수정

#### 4. DELETE /api/notes/:id
독서 노트 삭제

#### 5. GET /api/notes/tags
사용 가능한 태그 목록 조회

## 컴포넌트 및 인터페이스

### 백엔드 컴포넌트

#### 1. ReadingNotesService
독서 노트 비즈니스 로직 처리
- 노트 CRUD 작업
- 검색 및 필터링 로직
- 태그 관리

#### 2. ReadingNotesController
HTTP 요청/응답 처리
- API 엔드포인트 핸들러
- 요청 유효성 검사
- 응답 포맷팅

#### 3. DatabaseService 확장
기존 DatabaseService에 독서 노트 관련 메서드 추가
- `createReadingNotesTable()`
- `addReadingNote()`
- `getReadingNotes()`
- `updateReadingNote()`
- `deleteReadingNote()`
- `searchReadingNotes()`

### 프론트엔드 컴포넌트

#### 1. ReadingNotesPage
독서 노트 메인 페이지
- 노트 목록 표시
- 검색 및 필터링 UI
- 정렬 옵션

#### 2. NoteForm
노트 작성/수정 폼
- 제목, 내용, 태그 입력
- 책 선택 드롭다운
- 페이지 번호, 챕터 입력

#### 3. NoteCard
개별 노트 표시 컴포넌트
- 노트 내용 미리보기
- 수정/삭제 버튼
- 태그 표시

#### 4. SearchAndFilter
검색 및 필터링 컴포넌트
- 키워드 검색 입력
- 태그 필터 드롭다운
- 정렬 옵션 선택

## 데이터 모델

### ReadingNote 타입 정의

```typescript
export interface ReadingNote {
  id: string;
  bookId: string;
  title: string;
  content: string;
  tags: string[];
  pageNumber?: number;
  chapter?: string;
  noteType: 'quote' | 'summary' | 'thought' | 'general';
  createdAt: string;
  updatedAt: string;
}

export interface ReadingNoteWithBook extends ReadingNote {
  book: {
    title: string;
    author: string;
    thumbnail?: string;
  };
}

export interface ReadingNotesQuery {
  search?: string;
  tags?: string[];
  bookId?: string;
  noteType?: string;
  sort?: 'newest' | 'oldest' | 'title';
  limit?: number;
  offset?: number;
}
```

## 에러 처리

### API 에러 응답 형식
```typescript
{
  success: false;
  error: string;
  message: string;
  details?: any;
}
```

### 주요 에러 케이스
1. **400 Bad Request**: 잘못된 요청 데이터
2. **404 Not Found**: 존재하지 않는 노트 또는 책
3. **500 Internal Server Error**: 서버 내부 오류

### 클라이언트 에러 처리
- 네트워크 오류 시 재시도 로직
- 사용자 친화적인 에러 메시지 표시
- 폼 유효성 검사 오류 표시

## 테스팅 전략

### 백엔드 테스트
1. **단위 테스트**
   - DatabaseService 메서드 테스트
   - ReadingNotesService 로직 테스트
   - 유효성 검사 테스트

2. **통합 테스트**
   - API 엔드포인트 테스트
   - 데이터베이스 연동 테스트
   - 검색 및 필터링 기능 테스트

### 프론트엔드 테스트
1. **컴포넌트 테스트**
   - 노트 폼 렌더링 및 제출 테스트
   - 검색 기능 테스트
   - 필터링 기능 테스트

2. **E2E 테스트**
   - 노트 생성부터 조회까지 전체 플로우 테스트
   - 검색 및 필터링 시나리오 테스트

## 성능 고려사항

### 데이터베이스 최적화
- 검색 성능을 위한 인덱스 설정
- 페이지네이션을 통한 대용량 데이터 처리
- 태그 검색 최적화

### 프론트엔드 최적화
- 검색 결과 캐싱
- 무한 스크롤 또는 페이지네이션
- 디바운싱을 통한 실시간 검색 최적화

## 보안 고려사항

### 입력 데이터 검증
- XSS 방지를 위한 HTML 이스케이핑
- SQL 인젝션 방지 (Prepared Statements 사용)
- 입력 길이 제한

### API 보안
- 요청 속도 제한 (Rate Limiting)
- 입력 데이터 유효성 검사
- 적절한 HTTP 상태 코드 사용