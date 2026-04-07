import pytest
from httpx import AsyncClient

pytestmark = pytest.mark.asyncio


async def test_list_users_admin(client: AsyncClient, admin_token: str):
    response = await client.get(
        "/api/v1/users",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)


async def test_list_users_forbidden_for_regular_user(client: AsyncClient, user_token: str):
    response = await client.get(
        "/api/v1/users",
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert response.status_code == 403


async def test_get_own_profile(client: AsyncClient, user_token: str, regular_user):
    response = await client.get(
        f"/api/v1/users/{regular_user.id}",
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert response.status_code == 200
    assert response.json()["email"] == "user@test.com"


async def test_update_own_profile(client: AsyncClient, user_token: str, regular_user):
    response = await client.patch(
        f"/api/v1/users/{regular_user.id}",
        json={"full_name": "Updated Name"},
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert response.status_code == 200
    assert response.json()["full_name"] == "Updated Name"


async def test_delete_user_admin(client: AsyncClient, admin_token: str, regular_user):
    response = await client.delete(
        f"/api/v1/users/{regular_user.id}",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert response.status_code == 204
