from typing import Optional, Tuple
from uuid import UUID

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.base import CRUDBase
from app.models.task import Task, TaskStatus, TaskPriority


class TaskCRUD(CRUDBase[Task]):
    async def get_by_user(
        self,
        db: AsyncSession,
        *,
        user_id: UUID,
        skip: int = 0,
        limit: int = 20,
        status: Optional[str] = None,
        priority: Optional[str] = None,
    ) -> Tuple[list[Task], int]:
        """Get paginated tasks for a specific user, with optional filters."""
        query = select(Task).where(Task.user_id == user_id)
        count_query = select(func.count()).select_from(Task).where(Task.user_id == user_id)

        if status:
            query = query.where(Task.status == TaskStatus(status))
            count_query = count_query.where(Task.status == TaskStatus(status))
        if priority:
            query = query.where(Task.priority == TaskPriority(priority))
            count_query = count_query.where(Task.priority == TaskPriority(priority))

        total = (await db.execute(count_query)).scalar_one()
        items = list((await db.execute(query.offset(skip).limit(limit))).scalars().all())
        return items, total

    async def get_all_tasks(
        self,
        db: AsyncSession,
        *,
        skip: int = 0,
        limit: int = 20,
        status: Optional[str] = None,
        priority: Optional[str] = None,
    ) -> Tuple[list[Task], int]:
        """Get all tasks (admin view) with optional filters."""
        query = select(Task)
        count_query = select(func.count()).select_from(Task)

        if status:
            query = query.where(Task.status == TaskStatus(status))
            count_query = count_query.where(Task.status == TaskStatus(status))
        if priority:
            query = query.where(Task.priority == TaskPriority(priority))
            count_query = count_query.where(Task.priority == TaskPriority(priority))

        total = (await db.execute(count_query)).scalar_one()
        items = list((await db.execute(query.offset(skip).limit(limit))).scalars().all())
        return items, total

    async def get_stats(
        self, db: AsyncSession, *, user_id: Optional[UUID] = None
    ) -> dict:
        """Compute task counts grouped by status and priority."""
        base_filter = [Task.user_id == user_id] if user_id else []

        total_query = select(func.count()).select_from(Task)
        if base_filter:
            total_query = total_query.where(*base_filter)
        total = (await db.execute(total_query)).scalar_one()

        stats = {"total": total, "by_status": {}, "by_priority": {}}

        for s in TaskStatus:
            q = select(func.count()).select_from(Task).where(Task.status == s)
            if base_filter:
                q = q.where(*base_filter)
            stats["by_status"][s.value] = (await db.execute(q)).scalar_one()

        for p in TaskPriority:
            q = select(func.count()).select_from(Task).where(Task.priority == p)
            if base_filter:
                q = q.where(*base_filter)
            stats["by_priority"][p.value] = (await db.execute(q)).scalar_one()

        return stats


task_crud = TaskCRUD(Task)
