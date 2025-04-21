import pytest
import asyncio
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken
from channels.db import database_sync_to_async
from channels.testing import ApplicationCommunicator
from .jwt_middleware import JWTAuthMiddleware
from apps.users.models import Profile
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class DummyASGIApp:
    async def __call__(self, scope, receive, send):
        await send({
            'type': 'websocket.scope',
            'scope': scope
        })


@pytest.mark.asyncio
class TestJWTAuthMiddleware:

    @pytest.fixture(autouse=True)
    def setup(self, db):
        self.user = get_user_model().objects.create_user(
            username='testuser',
            password='password',
            first_name='John',
            last_name='Doe',
            email='testuser1@example.com'
        )
        self.profile = Profile.objects.create(user=self.user, role=2)
        self.token = self.get_jwt_token(self.user)

    def get_jwt_token(self, user):
        refresh = RefreshToken.for_user(user)
        return str(refresh.access_token)

    async def test_jwt_auth_middleware_valid_token(self):
        scope = {
            "type": "websocket",
            "subprotocols": ["chat", self.token],
        }

        middleware = JWTAuthMiddleware(DummyASGIApp())
        communicator = ApplicationCommunicator(middleware, scope)
        await communicator.send_input({'type': 'websocket.connect'})
        await communicator.wait()
        response = await communicator.receive_output()

        assert response["scope"]["user_id"] == self.user.id
        assert "error" not in response["scope"]

    async def test_jwt_auth_middleware_invalid_token(self):
        scope = {
            "type": "websocket",
            "subprotocols": ["chat", "invalid.token.here"],
        }

        middleware = JWTAuthMiddleware(DummyASGIApp())
        communicator = ApplicationCommunicator(middleware, scope)
        await communicator.send_input({'type': 'websocket.connect'})
        await communicator.wait()
        response = await communicator.receive_output()

        assert response["scope"].get("error") == "Invalid token"
        assert "user_id" not in response["scope"]

    async def test_jwt_auth_middleware_missing_token(self):
        scope = {
            "type": "websocket",
            "subprotocols": ["chat"],
        }

        middleware = JWTAuthMiddleware(DummyASGIApp())
        communicator = ApplicationCommunicator(middleware, scope)
        await communicator.send_input({'type': 'websocket.connect'})
        await communicator.wait()
        response = await communicator.receive_output()

        assert response["scope"].get("error") == "Provide an auth token"
        assert "user_id" not in response["scope"]

