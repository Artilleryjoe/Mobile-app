import json
import sys
from pathlib import Path

import pytest

# Allow importing manager.py by adding its directory to sys.path
sys.path.append(str(Path(__file__).parent))
from manager import ScoreManager


def test_initialization_creates_default_scores(tmp_path: Path):
    storage = tmp_path / "data.json"
    manager = ScoreManager(storage)
    assert storage.exists()
    assert manager.scores == {"exploits": 0, "fixes": 0, "total": 0}
    assert json.loads(storage.read_text()) == manager.scores


def test_record_success_updates_scores(tmp_path: Path):
    storage = tmp_path / "data.json"
    manager = ScoreManager(storage)

    manager.record_success("exploit")
    assert manager.scores == {"exploits": 1, "fixes": 0, "total": 1}

    manager.record_success("fix")
    assert manager.scores == {"exploits": 1, "fixes": 1, "total": 2}


def test_file_persistence(tmp_path: Path):
    storage = tmp_path / "data.json"
    manager = ScoreManager(storage)
    manager.record_success("exploit")

    new_manager = ScoreManager(storage)
    assert new_manager.scores == {"exploits": 1, "fixes": 0, "total": 1}
