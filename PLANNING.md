# PLANNING.md - 나만의 독서 도구: 읽고 싶은 책 우선순위 관리

## 1. 문제 정의

사용자는 읽고 싶은 책이 많지만, 어떤 책부터 읽어야 할지 결정하는 데 어려움을 겪습니다. 이로 인해 독서 계획을 세우고 실천하는 데 비효율이 발생합니다.

## 2. 해결 방안

사용자가 읽고 싶은 책과 각 책의 우선순위(상, 중, 하)를 입력할 수 있는 간단한 웹 애플리케이션을 개발합니다. 애플리케이션은 입력된 책 목록을 우선순위 순으로 정렬하여 보여줌으로써 사용자가 다음에 읽을 책을 쉽게 선택할 수 있도록 돕습니다.

## 3. 프론트엔드 / 백엔드 역할 분담

### 프론트엔드 (Next.js)

-   사용자 인터페이스 (UI) 제공
    -   책 제목, 저자, 우선순위를 입력할 수 있는 폼
    -   등록된 책 목록을 우선순위별로 정렬하여 표시
-   백엔드 API와 통신하여 데이터 CRUD 작업 요청

### 백엔드 (Express.js)

-   RESTful API 제공
    -   책 추가 기능
    -   책 목록 조회 기능 (우선순위 정렬 포함)
-   데이터 관리 (인메모리 저장소 사용)

## 4. API 설계 (엔드포인트 3-5개)

1.  **`POST /api/books`**: 새 책 추가
    *   **Request Body**:
        ```json
        {
          "title": "string",
          "author": "string",
          "priority": "High" | "Medium" | "Low"
        }
        ```
    *   **Response Body (Success 201)**:
        ```json
        {
          "id": "string",
          "title": "string",
          "author": "string",
          "priority": "string"
        }
        ```
    *   **Response Body (Error 400)**:
        ```json
        {
          "error": "Invalid input"
        }
        ```

2.  **`GET /api/books`**: 모든 책 목록 조회 (우선순위 정렬)
    *   **Request Query Parameters**: 없음
    *   **Response Body (Success 200)**:
        ```json
        [
          {
            "id": "string",
            "title": "string",
            "author": "string",
            "priority": "string"
          }
        ]
        ```
        *   **정렬 순서**: High -> Medium -> Low, 동일 우선순위 내에서는 추가된 순서대로 (또는 ID 순)

## 5. 기대 효과

-   사용자는 읽고 싶은 책 목록을 체계적으로 관리할 수 있습니다.
-   우선순위에 따라 다음에 읽을 책을 명확하게 파악하여 독서 계획을 효율적으로 세울 수 있습니다.
-   간단하고 직관적인 인터페이스를 통해 사용 편의성을 높입니다.
```
