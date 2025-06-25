import requests
import pytest
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Access the variables
api_base_url = os.getenv('VITE_BACKEND_URL')
app_users_username = os.getenv('APP_USERS')
app_users_password = os.getenv('APP_PASSWORDS')

API_URL = f"{api_base_url}/auth/login"

def load_list(filename):
    with open(filename, "r") as f:
        return [line.strip() for line in f if line.strip()]

# Load brute force sample usernames and passwords from files
usernames = load_list(os.path.join(os.path.dirname(__file__), "../resources/usernames.txt"))
passwords = load_list(os.path.join(os.path.dirname(__file__), "../resources/passwords.txt"))


# Define the expected working combinations from environment variables
valid_combinations = list(zip(
    app_users_username.split(","),
    app_users_password.split(",")
))

@pytest.mark.parametrize("username", usernames)
@pytest.mark.parametrize("password", passwords)
def test_brute_force_login(username, password):
    payload = {"username": username, "password": password}
    try:
        response = requests.post(API_URL, json=payload)
        access_token = response.cookies.get("accessToken")
        print(access_token)
        is_success = response.status_code == 200 and ("id" in response.json() or "accessToken" == access_token)
        if (username, password) in valid_combinations:
            assert is_success, f"Expected SUCCESS for {username}/{password}, but got {response.status_code} and {response.text}"
        else:
            assert not is_success, f"Unexpected SUCCESS for {username}/{password}"
    except Exception as e:
        pytest.fail(f"Exception for {username}/{password}: {e}")