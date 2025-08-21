"""Command dispatcher for terminal input."""
from typing import Callable, Dict, Any

from labs import reset_all

CommandHandler = Callable[..., Any]

# Mapping of allowed command names to their handlers
COMMANDS: Dict[str, CommandHandler] = {}

def register_command(name: str, handler: CommandHandler) -> None:
    """Register a handler for a command."""
    COMMANDS[name] = handler

def dispatch(command: str, *args, **kwargs):
    """Dispatch a command to its handler."""
    try:
        handler = COMMANDS[command]
    except KeyError as exc:  # pragma: no cover - minimal error handling
        raise ValueError(f"Unsupported command: {command}") from exc
    return handler(*args, **kwargs)


def _reset_handler() -> str:
    """Reset all labs and return a confirmation message."""
    reset_all()
    return "Reset complete."

# Register built-in commands
register_command("reset", _reset_handler)
