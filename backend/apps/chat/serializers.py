from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Chat, Message, MutedUser, BlockedUser, ReportedUser

# https://chatgpt.com/share/67fd9c70-d378-8005-8c39-b0453f0f790f
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'chat', 'sender', 'content', 'timestamp']
        read_only_fields = ['timestamp']

class ChatSerializer(serializers.ModelSerializer):
    user1 = UserSerializer(read_only=True)
    user2 = UserSerializer(read_only=True)
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Chat
        fields = ['id', 'user1', 'user2', 'createdAt', 'updatedAt', 'messages']

class MuteUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='muted_user.user.username', read_only=True)
    id = serializers.IntegerField(source='muted_user.id', read_only=True)

    class Meta:
        model = MutedUser
        fields = ['id', 'username', 'muted_user']
        extra_kwargs = {'muted_user': {'write_only': True}}

class BlockUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='blocked_user.user.username', read_only=True)
    id = serializers.IntegerField(source='blocked_user.id', read_only=True)

    class Meta:
        model = BlockedUser
        fields = ['id', 'username', 'blocked_user']
        extra_kwargs = {'blocked_user': {'write_only': True}}

class ReportUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='reported_user.user.username', read_only=True)
    id = serializers.IntegerField(source='reported_user.id', read_only=True)
    class Meta:
        model = ReportedUser
        fields = ['reported_user', 'reason']

    class Meta:
        model = ReportedUser
        fields = ['id', 'username', 'reported_user']
        extra_kwargs = {'reported_user': {'write_only': True}} 