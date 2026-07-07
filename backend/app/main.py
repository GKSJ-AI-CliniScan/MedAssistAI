from fastapi import FastAPI
from app.config.settings import settings
from app.routers import home, auth

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG
)

app.include_router(home.router)
app.include_router(auth.router)