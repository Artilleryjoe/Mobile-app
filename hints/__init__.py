"""Hint loading utilities."""

import json
from pathlib import Path

from typing import List

PROFILE_PATH = Path(__file__).resolve().parents[1] / "user" / "profile.json"
HINTS_DIR = Path(__file__).resolve().parent


def load_hints(lab_name: str) -> List[str]:
    """Load hints for the given lab based on the user's proficiency level."""
    profile = json.loads(PROFILE_PATH.read_text())
    proficiency = profile.get("proficiency", "beginner")

    hints_file = HINTS_DIR / f"{lab_name}.json"
    data = json.loads(hints_file.read_text())
    return data.get(proficiency, [])
