"""
Scanner Security and Confinement Controls.

Enforces:
- Path traversal prevention
- Symlink containment
- File size and count resource limits
- Safe archive handling (Zip Slip mitigation)
"""
import os
from pathlib import Path
from typing import Set


class SecurityException(Exception):
    """Raised when repository input violates security constraints."""
    pass


class ScannerSecurity:
    MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB per file
    MAX_TOTAL_FILES = 10_000
    MAX_SCAN_DURATION_SECONDS = 120

    BLOCKED_EXTENSIONS: Set[str] = {
        ".exe", ".dll", ".so", ".dylib", ".bin", ".iso", ".pyc", ".class"
    }

    IGNORE_DIRS: Set[str] = {
        ".git", ".svn", ".hg", "node_modules", "venv", ".venv", "env",
        "__pycache__", ".pytest_cache", "build", "dist", ".next"
    }

    @classmethod
    def resolve_safe_path(cls, base_dir: Path, relative_path: str) -> Path:
        """
        Verify that relative_path is safely contained inside base_dir
        without escaping via '..' or symlinks.
        """
        base_dir_resolved = base_dir.resolve()
        candidate = (base_dir / relative_path).resolve()

        try:
            # Python 3.9+ is_relative_to
            is_safe = candidate.is_relative_to(base_dir_resolved)
        except AttributeError:
            # Fallback
            is_safe = str(candidate).startswith(str(base_dir_resolved))

        if not is_safe:
            raise SecurityException(
                f"Path traversal detected: '{relative_path}' resolves outside sandbox '{base_dir}'."
            )
        return candidate

    @classmethod
    def is_safe_file(cls, file_path: Path) -> bool:
        """Check file size, extensions, and basic permissions."""
        if file_path.suffix.lower() in cls.BLOCKED_EXTENSIONS:
            return False
        try:
            if file_path.is_file() and file_path.stat().st_size > cls.MAX_FILE_SIZE_BYTES:
                return False
        except OSError:
            return False
        return True
