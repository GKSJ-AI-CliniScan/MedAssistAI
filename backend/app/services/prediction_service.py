import httpx

TEAMMATE_API_BASE = "http://127.0.0.1:8001"
LOGIN_URL = f"{TEAMMATE_API_BASE}/api/auth/login"
CHECK_URL = f"{TEAMMATE_API_BASE}/api/history/check"

SERVICE_EMAIL = "test@medassist.local"
SERVICE_PASSWORD = "test123"

_cached_token: str | None = None


async def _login(client: httpx.AsyncClient) -> str:
    response = await client.post(
        LOGIN_URL,
        data={"username": SERVICE_EMAIL, "password": SERVICE_PASSWORD},
    )
    response.raise_for_status()
    token_data = response.json()
    return token_data["access_token"]


async def get_prediction(symptoms: list[str]) -> tuple[str, float]:
    global _cached_token

    async with httpx.AsyncClient(timeout=10.0) as client:
        if _cached_token is None:
            _cached_token = await _login(client)

        headers = {"Authorization": f"Bearer {_cached_token}"}
        response = await client.post(CHECK_URL, json={"symptoms": symptoms}, headers=headers)

        if response.status_code == 401:
            _cached_token = await _login(client)
            headers = {"Authorization": f"Bearer {_cached_token}"}
            response = await client.post(CHECK_URL, json={"symptoms": symptoms}, headers=headers)

        response.raise_for_status()
        data = response.json()

        predicted_diseases = data.get("predicted_diseases", [])
        if not predicted_diseases:
            return "Unknown", 0.0

        top = predicted_diseases[0]
        return top["disease"], top["probability"]