import pytest
import requests

BASE_URL = "http://localhost:5173/api"
ENDPOINT_LOGIN = "/auth/login"

@pytest.fixture
def login_payload():
    return {
        "username": "admin",
        "password": "password"
    }

def test_cookie_security_flags(login_payload):
    url = BASE_URL + ENDPOINT_LOGIN

    # Make the login request (simulate failed or successful login)
    response = requests.post(url, json=login_payload)

    # Collect Set-Cookie headers (could be multiple cookies)
    set_cookies = response.headers.get("Set-Cookie")

    assert set_cookies is not None, "No Set-Cookie header found in response"

    # If multiple cookies are set, you may need to split by comma
    cookies = [set_cookies] if isinstance(set_cookies, str) else set_cookies

    for cookie in cookies:
        assert "HttpOnly" in cookie, f"Missing HttpOnly in cookie: {cookie}"
        assert "Secure" in cookie, f"Missing Secure in cookie: {cookie}"
        assert "SameSite=" in cookie, f"Missing SameSite in cookie: {cookie}"