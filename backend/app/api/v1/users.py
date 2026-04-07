from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.database import get_db
from app.crud.user import user_crud
from app.core.deps import get_current_user, get_admin_user
from app.schemas.user import UserCreate, UserResponse, UserUpdate
from app.models.user import User
from app.utils.logger import logger

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("", response_model=list[UserResponse])
async def list_users(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_admin_user),
):
    """List all users. Admin only."""
    users, _ = await user_crud.get_multi(db, skip=skip, limit=limit)
    return users


@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_admin_user),
):
    """Create a new user. Admin only."""
    existing = await user_crud.get_by_email(db, email=user_in.email)
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    user = await user_crud.create_with_password(
        db, email=user_in.email, password=user_in.password, full_name=user_in.full_name
    )
    logger.info(f"Admin created user: {user.email}")
    return user


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get user by ID. Admin or the user themselves."""
    from app.models.user import UserRole
    if current_user.role != UserRole.admin and current_user.id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    user = await user_crud.get(db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


@router.patch("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: UUID,
    user_in: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update user. Admin or the user themselves."""
    from app.models.user import UserRole
    if current_user.role != UserRole.admin and current_user.id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    user = await user_crud.get(db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    update_data = {}
    if user_in.full_name is not None:
        update_data["full_name"] = user_in.full_name
    if user_in.password is not None:
        from app.core.security import hash_password
        update_data["hashed_password"] = hash_password(user_in.password)

    updated_user = await user_crud.update(db, db_obj=user, obj_in=update_data)
    logger.info(f"User updated: {updated_user.email}")
    return updated_user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_admin_user),
):
    """Delete a user. Admin only."""
    user = await user_crud.delete(db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    logger.info(f"User deleted: {user.email}")
