from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.crud.task import task_crud
from app.core.deps import get_current_user
from app.models.user import User, UserRole

router = APIRouter(prefix="/stats", tags=["Statistics"])


@router.get("")
async def get_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get dashboard statistics. Admins see global stats; users see personal stats."""
    if current_user.role == UserRole.admin:
        stats = await task_crud.get_stats(db)
    else:
        stats = await task_crud.get_stats(db, user_id=current_user.id)

    return stats
