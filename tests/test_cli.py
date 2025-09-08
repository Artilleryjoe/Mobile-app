import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))

from terminal import cli
from scores.manager import ScoreManager


def _setup(tmp_path):
    cli.COMMANDS.clear()
    cli._scores = ScoreManager(storage=tmp_path / "scores.json")


def test_dispatch_records_exploit(tmp_path):
    _setup(tmp_path)

    def sample():
        return "ok"

    cli.register_command("sample", sample)
    result = cli.dispatch("sample")

    assert result.output == "ok"
    assert cli._scores.scores["exploits"] == 1
    assert cli._scores.scores["fixes"] == 0


def test_dispatch_records_fix(tmp_path):
    _setup(tmp_path)

    def patch():
        return "done"

    cli.register_command("patch", patch, category="fix")
    cli.dispatch("patch")

    assert cli._scores.scores["fixes"] == 1
    assert cli._scores.scores["exploits"] == 0
