import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database import Base, get_db
from app.core.security import create_access_token
from app.crud.user import user_crud

# Use in-memory SQLite for tests
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"


@pytest_asyncio.fixture(scope="function")
async def db_session():
    engine = create_async_engine(
        TEST_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    TestSession = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

    async with TestSession() as session:
        yield session

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()


@pytest_asyncio.fixture(scope="function")
async def client(db_session: AsyncSession):
    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()


@pytest_asyncio.fixture
async def admin_user(db_session: AsyncSession):
    return await user_crud.create_with_password(
        db_session,
        email="admin@test.com",
        password="AdminPass123!",
        full_name="Test Admin",
        role="admin",
    )


@pytest_asyncio.fixture
async def regular_user(db_session: AsyncSession):
    return await user_crud.create_with_password(
        db_session,
        email="user@test.com",
        password="UserPass123!",
        full_name="Test User",
        role="user",
    )


@pytest.fixture
def admin_token(admin_user):
    return create_access_token(data={"sub": str(admin_user.id)})


@pytest.fixture
def user_token(regular_user):
    return create_access_token(data={"sub": str(regular_user.id)})
