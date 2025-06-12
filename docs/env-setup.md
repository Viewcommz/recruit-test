# 🔧 환경변수 설정 가이드

## 백엔드 환경변수

`apps/backend/.env` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# 서버 설정
PORT=8000
NODE_ENV=development

# 프론트엔드 URL (CORS용)
FRONTEND_URL=http://localhost:3000

# OpenAI API (선택사항 - AI 기능용)
OPENAI_API_KEY=your_openai_api_key_here

# Google Books API (선택사항 - 도서 검색용)
GOOGLE_BOOKS_API_KEY=your_google_books_api_key_here
```

## 프론트엔드 환경변수

`apps/frontend/.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# 백엔드 API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# OpenAI API (클라이언트 측 AI 기능용 - 선택사항)
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
```

## API 키 발급 방법

### 1. OpenAI API 키 (선택사항)

1. [OpenAI 웹사이트](https://platform.openai.com/) 접속
2. 계정 생성 후 로그인
3. API Keys 섹션에서 새 키 생성
4. 생성된 키를 환경변수에 추가

### 2. Google Books API 키 (선택사항)

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. "APIs & Services" > "Library"에서 "Books API" 검색 후 활성화
4. "APIs & Services" > "Credentials"에서 API 키 생성
5. 생성된 키를 환경변수에 추가

## 주의사항

-   ⚠️ **환경변수 파일(.env)을 절대 커밋하지 마세요!**
-   🔑 **API 키는 개인정보이므로 안전하게 관리하세요**
-   🧪 **AI 기능은 선택사항입니다. API 키 없이도 기본 기능은 모두 동작합니다**

## 테스트 방법

환경변수가 제대로 설정되었는지 확인:

```bash
# 백엔드 헬스체크
curl http://localhost:8000/api/health

# 응답 예시:
# {
#   "status": "ok",
#   "timestamp": "2024-01-01T00:00:00.000Z",
#   "environment": "development"
# }
```
