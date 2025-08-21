"""Simple scoring system for tracking user progress."""

import json
from pathlib import Path
from typing import Dict


class ScoreManager:
    """Manage exploit and fix scores for a user."""

    def __init__(self, storage: Path | str | None = None) -> None:
        self.storage = Path(storage) if storage else Path(__file__).with_name("data.json")
        if self.storage.exists():
            self.scores: Dict[str, int] = json.loads(self.storage.read_text())
        else:
            self.scores = {"exploits": 0, "fixes": 0, "total": 0}
            self._save()

    def _save(self) -> None:
        self.storage.write_text(json.dumps(self.scores, indent=2))

    def record_success(self, kind: str) -> None:
        """Record a successful action and update the score."""
        if kind not in {"exploit", "fix"}:
            raise ValueError("kind must be 'exploit' or 'fix'")
        key = "exploits" if kind == "exploit" else "fixes"
        self.scores[key] += 1
        self.scores["total"] += 1
        self._save()
