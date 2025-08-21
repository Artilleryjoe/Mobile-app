"""State management for the example lab."""

class ExampleState:
    """Trivial state container used for demonstration."""
    def __init__(self) -> None:
        self.counter = 0

    def reset(self) -> None:
        """Reset the lab's internal state."""
        self.counter = 0

state = ExampleState()


def reset() -> None:
    """Module-level helper for resetting this lab's state."""
    state.reset()
