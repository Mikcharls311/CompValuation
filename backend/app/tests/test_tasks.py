import pytest
from httpx import AsyncClient

pytestmark = pytest.mark.asyncio


async def test_create_task(client: AsyncClient, user_token: str):
    response = await client.post(
        "/api/v1/tasks",
        json={"title": "Test Task", "description": "A test task", "status": "todo", "priority": "medium"},
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Task"


async def test_list_tasks(client: AsyncClient, user_token: str):
    await client.post(
        "/api/v1/tasks",
        json={"title": "Task 1", "status": "todo", "priority": "low"},
        headers={"Authorization": f"Bearer {user_token}"},
    )
    response = await client.get(
        "/api/v1/tasks",
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1
    assert "items" in data


async def test_get_task(client: AsyncClient, user_token: str):
    create_resp = await client.post(
        "/api/v1/tasks",
        json={"title": "Fetch Me", "status": "todo", "priority": "high"},
        headers={"Authorization": f"Bearer {user_token}"},
    )
    task_id = create_resp.json()["id"]

    response = await client.get(
        f"/api/v1/tasks/{task_id}",
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert response.status_code == 200
    assert response.json()["id"] == task_id


async def test_update_task(client: AsyncClient, user_token: str):
    create_resp = await client.post(
        "/api/v1/tasks",
        json={"title": "Update Me", "status": "todo", "priority": "low"},
        headers={"Authorization": f"Bearer {user_token}"},
    )
    task_id = create_resp.json()["id"]

    response = await client.patch(
        f"/api/v1/tasks/{task_id}",
        json={"status": "done"},
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert response.status_code == 200
    assert response.json()["status"] == "done"


async def test_delete_task(client: AsyncClient, user_token: str):
    create_resp = await client.post(
        "/api/v1/tasks",
        json={"title": "Delete Me", "status": "todo", "priority": "low"},
        headers={"Authorization": f"Bearer {user_token}"},
    )
    task_id = create_resp.json()["id"]

    response = await client.delete(
        f"/api/v1/tasks/{task_id}",
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert response.status_code == 204


async def test_create_task_unauthenticated(client: AsyncClient):
    response = await client.post(
        "/api/v1/tasks",
        json={"title": "No Auth", "status": "todo", "priority": "low"},
    )
    assert response.status_code == 401
