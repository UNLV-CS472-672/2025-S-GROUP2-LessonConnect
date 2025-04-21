# https://medium.com/@josephmiracle119/authentication-in-websocket-with-django-and-django-rest-framework-drf-50406ef95f3c
from channels.middleware import BaseMiddleware
from rest_framework_simplejwt.tokens import AccessToken
from channels.db import database_sync_to_async

class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        # Get the token from the subprotocols
        token = self.get_token_from_subprotocol(scope)

        if token:
            user_id = await self.get_user_from_token(token)
            if user_id:
                # Attach the user_id to the scope if the token is valid
                scope['user_id'] = user_id
            else:
                scope['error'] = 'Invalid token'
        else:
            scope['error'] = 'Provide an auth token'

        return await super().__call__(scope, receive, send)

    def get_token_from_subprotocol(self, scope):
        # Extract token from subprotocols sent during the WebSocket handshake.
        # WebSocket subprotocols are sent as a list of protocols during the handshake.

        subprotocols = scope.get("subprotocols", [])
        if len(subprotocols) > 1:
            # Assuming the token is the second protocol (after the real protocol)
            return subprotocols[1]  # The access token is the second subprotocol
        return None

    @database_sync_to_async
    def get_user_from_token(self, token):
        # Validate and get the user from the provided JWT token
        try:
            access_token = AccessToken(token)
            return access_token['user_id']
        except:
            return None
