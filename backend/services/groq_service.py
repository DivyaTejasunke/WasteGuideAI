"""
groq_service.py
----------------
Wraps calls to the Groq chat-completions API and forces the model to
respond with strict JSON matching WasteGuide AI's waste-classification
schema.
"""

import os
import json
import requests

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

VALID_CATEGORIES = [
    "Plastic", "Paper", "Cardboard", "Glass", "Metal", "Organic", "Textile",
    "Rubber", "Medical", "Hazardous", "Electronic", "Mixed", "Construction",
    "Battery", "Chemicals",
]

SYSTEM_PROMPT = f"""You are WasteGuide AI, an expert waste classification assistant for a
smart-city recycling application.

Given the name of a waste item, classify it and respond with ONLY a raw
JSON object — no markdown, no code fences, no explanations, no extra text.

The JSON object MUST have exactly this shape:

{{
  "item": string,
  "category": one of {VALID_CATEGORIES},
  "recyclable": boolean,
  "hazard_level": "Low" | "Medium" | "High",
  "hazard_warning": string,
  "disposal_steps": [string, string, string, string],
  "recycling_steps": [string, string, string, string],
  "eco_suggestion": string
}}

Rules:
- Always return valid JSON that can be parsed with json.loads.
- Never wrap the JSON in markdown fences.
- disposal_steps and recycling_steps must each contain 3-5 short, practical
  steps.
- hazard_warning should be a short one-sentence caution (can be "None" for
  very safe items).
- eco_suggestion should be one actionable sustainability tip related to the
  item.
"""


class GroqServiceError(Exception):
    pass


def classify_waste_item(item_name: str) -> dict:
    if not GROQ_API_KEY:
        raise GroqServiceError(
            "GROQ_API_KEY is not configured on the server. "
            "Add it to backend/.env to enable AI classification."
        )

    payload = {
        "model": GROQ_MODEL,
        "temperature": 0.2,
        "response_format": {"type": "json_object"},
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Classify this waste item: {item_name}"},
        ],
    }

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }

    try:
        response = requests.post(GROQ_URL, headers=headers, json=payload, timeout=20)
    except requests.exceptions.Timeout:
        raise GroqServiceError("The AI service timed out. Please try again.")
    except requests.exceptions.ConnectionError:
        raise GroqServiceError("Could not reach the AI service. Check your internet connection.")

    if response.status_code == 429:
        raise GroqServiceError("Rate limit exceeded. Please wait a moment and try again.")
    if not response.ok:
        raise GroqServiceError(f"AI service error ({response.status_code}): {response.text[:200]}")

    try:
        data = response.json()
        content = data["choices"][0]["message"]["content"]
        parsed = json.loads(content)
    except (KeyError, IndexError, json.JSONDecodeError) as exc:
        raise GroqServiceError(f"AI returned an invalid response: {exc}")

    return _validate_and_normalize(parsed, item_name)


def _validate_and_normalize(parsed: dict, item_name: str) -> dict:
    normalized = {
        "item": parsed.get("item") or item_name,
        "category": parsed.get("category") if parsed.get("category") in VALID_CATEGORIES else "Mixed",
        "recyclable": bool(parsed.get("recyclable", False)),
        "hazard_level": parsed.get("hazard_level") if parsed.get("hazard_level") in ["Low", "Medium", "High"] else "Low",
        "hazard_warning": parsed.get("hazard_warning") or "None",
        "disposal_steps": parsed.get("disposal_steps") or [],
        "recycling_steps": parsed.get("recycling_steps") or [],
        "eco_suggestion": parsed.get("eco_suggestion") or "Reduce, reuse, and recycle whenever possible.",
    }
    return normalized
