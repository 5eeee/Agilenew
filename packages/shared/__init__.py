"""Shared settings for Agile Business microservices."""
from __future__ import annotations

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Prefix avoids clashes with other projects' LEADS_URL / WEB_URL env vars
    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="AGILE_",
        extra="ignore",
    )

    app_name: str = "Agile Business"
    env: str = "development"

    gateway_host: str = "0.0.0.0"
    gateway_port: int = 8080

    web_url: str = "http://127.0.0.1:8081"
    content_url: str = "http://127.0.0.1:8082"
    leads_url: str = "http://127.0.0.1:8083"

    web_host: str = "0.0.0.0"
    web_port: int = 8081
    content_host: str = "0.0.0.0"
    content_port: int = 8082
    leads_host: str = "0.0.0.0"
    leads_port: int = 8083

    cors_origins: str = "http://localhost:8080,http://127.0.0.1:8080"


settings = Settings()
