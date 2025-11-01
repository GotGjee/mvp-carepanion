from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from app.database import init_db, engine
from app.routers import auth, profile, label
from sqlalchemy import text


# Initialize FastAPI app
app = FastAPI(
    title="Carepanion API",
    description="Backend API for Carepanion - Web3 Emotional Data Platform",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://mvp-carepanion.vercel.app",
        "https://*.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
try:
    app.mount("/static", StaticFiles(directory="static"), name="static")
except RuntimeError:
    # Static directory doesn't exist, skip mounting
    pass

# Include routers
app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(label.router)

@app.on_event("startup")
def startup_event():
    """Initialize database and create mock data on startup"""
    print("🚀 Starting up Carepanion API...")
    
    try:
        init_db()
        print("✅ Carepanion API is ready!")
    except Exception as e:
        print(f"⚠️  Startup warning: {e}")
        print("API will continue running, but database may not be available")

@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Carepanion API",
        "version": "1.0.0",
        "status": "running"
    }

@app.head("/health")
def health_check():
    """Health check endpoint with database connection test"""
    try:
        # Test database connection
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        
        return {
            "status": "healthy",
            "database": "connected",
            "version": "1.0.0"
        }
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "unhealthy",
                "database": "disconnected",
                "error": str(e),
                "version": "1.0.0"
            }
        )
    
