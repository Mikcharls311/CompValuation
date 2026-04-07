from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.base import CRUDBase
from app.models.user import User, UserRole
from app.core.security import hash_password, verify_password


class UserCRUD(CRUDBase[User]):
    async def get_by_email(self, db: AsyncSession, *, email: str) -> Optional[User]:
        """Fetch a user by email address."""
        result = await db.execute(select(User).where(User.email == email))
        return result.scalars().first()

    async def authenticate(
        self, db: AsyncSession, *, email: str, password: str
    ) -> Optional[User]:
        """Return the user if email and password are valid, else None."""
        user = await self.get_by_email(db, email=email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    async def create_with_password(
        self,
        db: AsyncSession,
        *,
        email: str,
        password: str,
        full_name: str,
        role: str = "user",
    ) -> User:
        """Create a user, hashing the provided plaintext password."""
        return await self.create(db, obj_in={
            "email": email,
            "hashed_password": hash_password(password),
            "full_name": full_name,
            "role": UserRole(role),
        })


user_crud = UserCRUD(User)
