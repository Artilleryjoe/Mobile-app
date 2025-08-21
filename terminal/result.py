from dataclasses import dataclass

@dataclass
class CommandResult:
    """Response returned by a command handler."""
    output: str
    explanation: str
