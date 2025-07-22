# 기획서

## 선택한 문제
- 읽고 싶은 책이 많은데 우선순위 결정을 못한다

## 핵심 기능
1. 책 추가/조회/관리
2. 우선순위 자동 계산 (페이지수 + 출간일 기반)
3. 다양한 정렬 및 필터링 (제목, 저자, 카테고리, 검색)
4. 실시간 반응형 웹 인터페이스

## 데이터 구조/주요 API 설계

### 주요 타입
```typescript
Book: {
  id, title, author, pageCount, publishedDate, 
  description, categories, isbn, thumbnail, language
}

ApiResponse: {
  success, data, error, message
}
```

### API 엔드포인트
- `POST /api/books` - 책 추가
- `GET /api/books` - 책 목록 조회 (정렬/필터링 포함)
- `GET /api/books/:id` - 특정 책 조회
- `GET /api/health` - 헬스체크

### 우선순위 알고리즘
```typescript
priorityScore = (pageCount * -1) + publishedDate.getTime()
// 페이지수 적을수록 + 최신일수록 높은 우선순위
```

## 기대 효과 및 차별화 포인트

### 해결하는 문제
- 많은 책 중에서 어떤 것을 먼저 읽을지 결정하는 어려움
- 개인 상황(시간, 관심사)을 고려하지 않은 단순한 책 추천
- 완독하지 못하고 중도 포기하는 문제

### 차별화 포인트
- **복합 알고리즘**: 페이지수와 출간일을 동시 고려한 우선순위 계산
- **실시간 정렬**: 다양한 기준으로 즉시 재정렬 가능
- **직관적 UI**: 이모지와 색상을 활용한 사용자 친화적 인터페이스
- **확장성**: 향후 AI 추천, 소셜 기능 추가 용이한 구조