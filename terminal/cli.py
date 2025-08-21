"""Command dispatcher for terminal input."""
from typing import Callable, Dict, Any

from labs import reset_all
from scores.manager import ScoreManager
from .result import CommandResult

CommandHandler = Callable[..., Any]

# Mapping of allowed command names to their handlers
COMMANDS: Dict[str, CommandHandler] = {}

# Score manager instance shared across command executions
_scores = ScoreManager()


def register_command(name: str, handler: CommandHandler) -> None:
    """Register a handler for a command."""
    COMMANDS[name] = handler


def dispatch(command: str, *args, **kwargs) -> CommandResult:
    """Dispatch a command to its handler.

    Records a successful execution in the score manager and wraps the
    handler's output in a :class:`CommandResult`.
    """
    try:
        handler = COMMANDS[command]
    except KeyError as exc:  # pragma: no cover - minimal error handling
        raise ValueError(f"Unsupported command: {command}") from exc
    output = handler(*args, **kwargs)
    _scores.record_success("exploit")
    return CommandResult(output=output, explanation=f"Command '{command}' executed.")


def _reset_handler() -> str:
    """Reset all labs and return a confirmation message."""
    reset_all()
    return "Reset complete."


# Register built-in commands
register_command("reset", _reset_handler)
