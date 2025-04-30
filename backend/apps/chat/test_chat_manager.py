import pytest
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from .models import Chat, BlockedUser, MutedUser
from apps.users.models import Profile

@pytest.mark.django_db
def test_ensure_user_allowed_blocks_as_expected():
    User = get_user_model()
    u1 = User.objects.create_user("u1","p")
    u2 = User.objects.create_user("u2","p")
    Profile.objects.create(user=u1, role=1)
    Profile.objects.create(user=u2, role=1)
    chat, _ = Chat.objects.get_or_create_chat(u1, u2)

    BlockedUser.objects.create(blocked_by=u2.profile, blocked_user=u1.profile)
    with pytest.raises(PermissionError, match="You are blocked by this user."):
        Chat.objects.user_blocked_or_muted(chat, u1)

@pytest.mark.django_db
def test_user_blocked_or_muted_mutes_as_expected():
    u1 = User.objects.create_user("u1_muted", password="pass")
    u2 = User.objects.create_user("u2_muted", password="pass")
    Profile.objects.create(user=u1, role=1)
    Profile.objects.create(user=u2, role=1)
    chat, _ = Chat.objects.get_or_create_chat(u1, u2)

    # mute u1 by u2
    MutedUser.objects.create(muted_by=u2.profile, muted_user=u1.profile)
    with pytest.raises(PermissionError, match="You are muted by this user."):
        Chat.objects.user_blocked_or_muted(chat, u1)

@pytest.mark.django_db
def test_user_blocked_or_muted_allows_when_clear():
    u1 = User.objects.create_user("u1_clear", password="pass")
    u2 = User.objects.create_user("u2_clear", password="pass")
    Profile.objects.create(user=u1, role=1)
    Profile.objects.create(user=u2, role=1)
    chat, _ = Chat.objects.get_or_create_chat(u1, u2)
    Chat.objects.user_blocked_or_muted(chat, u1) # should not raise error

@pytest.mark.django_db
def test_get_other_user_returns_correct_partner():
    u1 = User.objects.create_user("u1_other", password="pass")
    u2 = User.objects.create_user("u2_other", password="pass")
    # profiles must exist but not used here
    Profile.objects.create(user=u1, role=1)
    Profile.objects.create(user=u2, role=1)

    chat, _ = Chat.objects.get_or_create_chat(u1, u2)
    # whoever you pass in, you get the other one back
    assert Chat.objects.get_other_user(chat, u1) == u2
    assert Chat.objects.get_other_user(chat, u2) == u1