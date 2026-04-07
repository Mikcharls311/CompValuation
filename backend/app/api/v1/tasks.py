from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from uuid import UUID

from app.database import get_db
from app.crud.task import task_crud
from app.core.deps import get_current_user
from app.schemas.task import TaskCreate, TaskResponse, TaskUpdate
from app.models.user import User, UserRole
from app.utils.logger import logger

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.get("", response_model=dict)
async def list_tasks(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    status: Optional[str] = Query(default=None),
    priority: Optional[str] = Query(default=None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List tasks. Admins see all tasks; regular users see only their own."""
    skip = (page - 1) * page_size

    if current_user.role == UserRole.admin:
        tasks, total = await task_crud.get_all_tasks(
            db, skip=skip, limit=page_size, status=status, priority=priority
        )
    else:
        tasks, total = await task_crud.get_by_user(
            db, user_id=current_user.id, skip=skip, limit=page_size, status=status, priority=priority
        )

    return {
        "items": [TaskResponse.model_validate(t) for t in tasks],
        "total": total,
        "page": page,
        "page_size": page_size,
        "pages": (total + page_size - 1) // page_size,
    }


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_in: TaskCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new task for the current user."""
    task = await task_crud.create(db, obj_in={
        **task_in.model_dump(),
        "user_id": current_user.id,
    })
    logger.info(f"Task created: {task.title} by {current_user.email}")
    return task


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a task by ID. Owner or admin only."""
    task = await task_crud.get(db, id=task_id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    if current_user.role != UserRole.admin and task.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    return task


@router.patch("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: UUID,
    task_in: TaskUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a task. Owner or admin only."""
    task = await task_crud.get(db, id=task_id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    if current_user.role != UserRole.admin and task.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    update_data = task_in.model_dump(exclude_none=True)
    updated_task = await task_crud.update(db, db_obj=task, obj_in=update_data)
    logger.info(f"Task updated: {updated_task.title}")
    return updated_task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a task. Owner or admin only."""
    task = await task_crud.get(db, id=task_id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    if current_user.role != UserRole.admin and task.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    await task_crud.delete(db, id=task_id)
    logger.info(f"Task deleted: {task.title} by {current_user.email}")
