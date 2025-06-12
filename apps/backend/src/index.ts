import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

// 환경변수 로드
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// 미들웨어 설정
app.use(helmet());
app.use(
    cors({
        origin:
            process.env.NODE_ENV === "production"
                ? process.env.FRONTEND_URL
                : "http://localhost:3000",
        credentials: true,
    })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// 헬스체크 엔드포인트
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        message: "BookShelf API Server is running",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
    });
});

// 기본 API 정보
app.get("/api", (req, res) => {
    res.json({
        name: "BookShelf API",
        version: "1.0.0",
        description: "1시간 AI 개발 테스트용 백엔드",
        endpoints: {
            health: "/api/health",
            info: "/api",
        },
    });
});

// 404 핸들러
app.use("*", (req, res) => {
    res.status(404).json({
        success: false,
        error: "Route not found",
        message:
            "이 테스트에서는 프론트엔드 구현에 집중하세요. localStorage를 사용하세요.",
    });
});

// 에러 핸들러
app.use(
    (
        err: Error,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        console.error("Error:", err);
        res.status(500).json({
            success: false,
            error:
                process.env.NODE_ENV === "production"
                    ? "Internal server error"
                    : err.message,
        });
    }
);

// 서버 시작
app.listen(PORT, () => {
    console.log(`🚀 BookShelf API Server running on port ${PORT}`);
    console.log(`📚 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
    console.log(`💡 이 테스트에서는 프론트엔드 구현에 집중하세요!`);
});
