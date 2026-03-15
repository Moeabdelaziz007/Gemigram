import structlog
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List
from datetime import datetime
import asyncio

logger = structlog.get_logger("AetherOS.Memory.WAL")

class WALEntry(BaseModel):
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    detail: str
    traits: List[str]
    session_id: str

class WALProtocol:
    """
    Write-Ahead Logging (WAL) Protocol for AetherOS.
    Ensures critical state decisions are persisted before agent response.
    """
    def __init__(self, workspace_path: str = "workspace"):
        self.log_path = Path(workspace_path) / "SESSION-STATE.md"
        self.log_path.parent.mkdir(parents=True, exist_ok=True)
        if not self.log_path.exists():
            self.log_path.write_text("# AetherOS Session State (WAL)\n\n", encoding="utf-8")
        self._lock = asyncio.Lock()

    async def on_interaction(self, detail: str, traits: List[str], session_id: str):
        entry = WALEntry(detail=detail, traits=traits, session_id=session_id)
        await self._write_to_state(entry)

    async def _write_to_state(self, entry: WALEntry):
        async with self._lock:
            try:
                log_line = f"### [{entry.timestamp}] Session: {entry.session_id}\n**Detail**: {entry.detail}\n**Traits**: {', '.join(entry.traits)}\n\n"
                with open(self.log_path, "a", encoding="utf-8") as f:
                    f.write(log_line)
                logger.info("WAL_ENTRY_PERSISTED", session_id=entry.session_id)
            except Exception as e:
                logger.error("WAL_WRITE_FAILED", error=str(e))
                raise
