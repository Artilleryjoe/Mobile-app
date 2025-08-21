"""Utilities for managing lab state."""
import importlib
import pkgutil
from types import ModuleType
from typing import List


def _iter_state_modules() -> List[ModuleType]:
    """Yield each lab's state module if it defines `reset`."""
    modules = []
    for pkg in pkgutil.iter_modules(__path__):
        try:
            mod = importlib.import_module(f"{__name__}.{pkg.name}.state")
        except ModuleNotFoundError:
            continue
        if hasattr(mod, "reset") and callable(mod.reset):
            modules.append(mod)
    return modules


def reset_all() -> None:
    """Call `reset()` for every lab that defines it."""
    for mod in _iter_state_modules():
        mod.reset()
