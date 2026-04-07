import pytest
from httpx import AsyncClient

pytestmark = pytest.mark.asyncio


async def test_register_success(client: AsyncClient):
    response = await client.post("/api/v1/auth/register", json={
        "email": "newuser@example.com",
        "password": "SecurePass123!",
        "full_name": "New User",
    })
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert "hashed_password" not in data


async def test_register_duplicate_email(client: AsyncClient):
    payload = {"email": "dup@example.com", "password": "SecurePass123!", "full_name": "User"}
    await client.post("/api/v1/auth/register", json=payload)
    response = await client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 409


async def test_login_success(client: AsyncClient, regular_user):
    response = await client.post("/api/v1/auth/login", data={
        "username": "user@test.com",
        "password": "UserPass123!",
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data


async def test_login_wrong_password(client: AsyncClient, regular_user):
    response = await client.post("/api/v1/auth/login", data={
        "username": "user@test.com",
        "password": "WrongPassword!",
    })
    assert response.status_code == 401


async def test_get_me(client: AsyncClient, user_token: str):
    response = await client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert response.status_code == 200
    assert response.json()["email"] == "user@test.com"


async def test_get_me_no_token(client: AsyncClient):
    response = await client.get("/api/v1/auth/me")
    assert response.status_code == 401
