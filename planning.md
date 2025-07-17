# 기획서

## 선택한 문제
- 읽은 책 기억 도구

## 핵심 기능
1. 읽은 책 추가/조회/삭제/수정
2. 평점 및 최신순 정렬
3. 키워드를 통한 책 검색

## 데이터 구조 / 주요 API 설계

1. 데이터 구조

- User
    - id : 유저id(pk)
    - nickname : 이름

- Book
    - bookId: 책 id(pk)
    - 키워드: enum 타입 (검색을 위해 필요)
    - author: 작가

- User_Book 중간테이블 (N:M)
    - readerId: 읽은 사람 ID(FK)
    - readBookId: 읽힌 책 ID(Fk)
    - st_read: 읽기 시작한 날짜 
    - end_read: 다 읽은 날짜
    - tagId: (Fk) 유저가 등록한 태그ID (tag: user_book=1:N)
    - review: 감상평
    - rate: 별점

- Tag (커스텀 키워드) - user와 1:N
    - tagId(pk)
    - tagName: 생성한 태그 이름
    - tagUserId: (Fk) 태그 주인의 아이디 

2. 주요 API 설계
- 읽은 책 등록 (POST /api/books)
- 읽은 책 조회 (GET /api/books)
- 읽은 책 수정 (PATCH /api/books/:id)
- 읽은 책 삭제 (DELETE /api/books/:id)
- 읽은 책 수정 (PATCH /api/books)

- 태그 등록 (POST /api/tags)
- 태그 이름 수정 (PATCH /api/tags/:id)
- 태그 삭제 (DELETE /api/tags)
- 책에 태그 추가 (POST /api/tags/:tagId/books/:bookId)
- 책에서 태그 제거 (DELETE /api/tags/:tagId/books/:bookId)
- 태그별 책 조회 (GET /api/tags/:id/books)
- 사용자 태그 조회 (GET /api/tags)

## 기대 효과 및 차별화 포인트
- 차별화 포인트
기존의 어플들은 카테고리나 키워드의 경우 지정되어 있는 것을 선택하는 것에 그침. 하지만, 사용자별 커스텀 카테고리를 생성하도록 하여 자신이 원하는 카테고리 별로 조회를 할 수 있도록하여 사용자의 독서 기록생활에 좀 더 편리성을 부여할 수 있도록 도모했다.