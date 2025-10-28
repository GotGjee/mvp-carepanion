from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database import init_db, get_db, create_mock_audio_data
from app.routers import auth, profile, label

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
        "https://mvp-carepanion.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

# Include routers
app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(label.router)

@app.on_event("startup")
def startup_event():
    """Initialize database and create mock data on startup"""
    print("Starting up Carepanion API...")
    init_db()
    
    # Create mock audio data
    # db = next(get_db())
    # create_mock_audio_data(db)
    # db.close()
    
    print("Carepanion API is ready! 🚀")

@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Carepanion API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}