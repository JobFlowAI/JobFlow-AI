"""Shared OpenRouter (OpenAI-compatible) client for the scraper service.

OpenRouter exposes the same surface as the OpenAI SDK. We point ``base_url``
at https://openrouter.ai/api/v1 and authenticate with ``OPENROUTER_API_KEY``.
"""

from __future__ import annotations

import os
from typing import Optional

from openai import OpenAI


OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"

_client: Optional[OpenAI] = None


def has_key() -> bool:
    return bool(os.getenv("OPENROUTER_API_KEY"))


def get_client() -> Optional[OpenAI]:
    """Lazy singleton OpenRouter client. Returns None when no key is set."""
    global _client
    if _client is not None:
        return _client
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        return None
    _client = OpenAI(
        api_key=api_key,
        base_url=OPENROUTER_BASE_URL,
        default_headers={
            "HTTP-Referer": os.getenv("OPENROUTER_SITE_URL", "https://jobflow.ai"),
            "X-Title": os.getenv("OPENROUTER_APP_NAME", "JobFlow AI Scraper"),
        },
    )
    return _client


def default_model() -> str:
    return os.getenv("OPENROUTER_MODEL", "openai/gpt-4o-mini")
