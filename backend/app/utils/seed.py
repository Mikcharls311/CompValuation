from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import AsyncSessionLocal
from app.crud.user import user_crud
from app.crud.task import task_crud
from app.models.user import User
from app.utils.logger import logger


async def seed_database() -> None:
    """Seed the database with default users and sample tasks (idempotent)."""
    async with AsyncSessionLocal() as db:
        # Check if admin already exists
        existing = await user_crud.get_by_email(db, email="admin@example.com")
        if existing:
            logger.info("Database already seeded, skipping.")
            return

        logger.info("Seeding database with default users and tasks...")

        # Create users
        admin = await user_crud.create_with_password(
            db,
            email="admin@example.com",
            password="AdminPass123!",
            full_name="System Admin",
            role="admin",
        )

        user = await user_crud.create_with_password(
            db,
            email="user@example.com",
            password="UserPass123!",
            full_name="Demo User",
            role="user",
        )

        viewer = await user_crud.create_with_password(
            db,
            email="viewer@example.com",
            password="ViewerPass123!",
            full_name="Viewer Account",
            role="user",
        )

        # Create sample tasks for demo user
        sample_tasks = [
            {
                "title": "Set up project structure",
                "description": "Initialize the project folder structure and install dependencies.",
                "status": "done",
                "priority": "high",
                "user_id": user.id,
            },
            {
                "title": "Design database schema",
                "description": "Define tables for users and tasks with proper relationships.",
                "status": "done",
                "priority": "high",
                "user_id": user.id,
            },
            {
                "title": "Implement authentication",
                "description": "Add JWT-based login and registration endpoints.",
                "status": "in_progress",
                "priority": "high",
                "user_id": user.id,
            },
            {
                "title": "Build task CRUD API",
                "description": "Create endpoints for managing tasks.",
                "status": "in_progress",
                "priority": "medium",
                "user_id": user.id,
            },
            {
                "title": "Write unit tests",
                "description": "Add pytest tests for all API endpoints.",
                "status": "todo",
                "priority": "medium",
                "user_id": user.id,
            },
            {
                "title": "Set up frontend with React",
                "description": "Bootstrap Vite + React + TypeScript project.",
                "status": "todo",
                "priority": "medium",
                "user_id": viewer.id,
            },
            {
                "title": "Deploy to Railway",
                "description": "Configure Railway deployment for backend and frontend.",
                "status": "todo",
                "priority": "low",
                "user_id": admin.id,
            },
        ]

        for task_data in sample_tasks:
            await task_crud.create(db, obj_in=task_data)

        await db.commit()
        logger.info(f"Seeded {len(sample_tasks)} tasks and 3 users successfully.")
