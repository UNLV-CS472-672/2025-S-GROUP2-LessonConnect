from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, StudentProfile, TutorProfile, ParentProfile

class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model=User
    fields=["first_name", "last_name", "username", "password",  "email"]
    extra_kwargs= {"password": {"write_only": True}}

  def create(self, validated_data):
    user=User.objects.create_user(**validated_data)
    return user

  def update(self, instance, validated_data):
    instance.username = validated_data.get('username', instance.username)
    instance.save()
    return instance

# https://chatgpt.com/share/67f1b472-b004-8005-8550-62871c22bef9
class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Profile
        fields = ['user', 'role', 'phone_number', 'date_of_birth', 'preferred_contact_method']


# === STUDENT PROFILE ===
class StudentProfileSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()

    class Meta:
        model = StudentProfile
        fields = ['profile', 'grade_level', 'emergency_contact_name', 'emergency_contact_phone_number']

    def update(self, instance, validated_data):
        self._update_user_profile(instance.profile, validated_data)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

    def _update_user_profile(self, profile, validated_data):
        profile_data = validated_data.pop('profile', {})
        user_data = profile_data.pop('user', {})
        for attr, value in user_data.items():
            setattr(profile.user, attr, value)
        profile.user.save()
        for attr, value in profile_data.items():
            setattr(profile, attr, value)
        profile.save()


# === TUTOR PROFILE ===
class TutorProfileSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()

    class Meta:
        model = TutorProfile
        fields = ['profile', 'city', 'state', 'bio', 'hourly_rate', 'rating']

    def update(self, instance, validated_data):
        self._update_user_profile(instance.profile, validated_data)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

    def _update_user_profile(self, profile, validated_data):
        profile_data = validated_data.pop('profile', {})
        user_data = profile_data.pop('user', {})
        for attr, value in user_data.items():
            setattr(profile.user, attr, value)
        profile.user.save()
        for attr, value in profile_data.items():
            setattr(profile, attr, value)
        profile.save()


# === PARENT PROFILE ===
class ParentProfileSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()

    class Meta:
        model = ParentProfile
        fields = ['profile']

    def update(self, instance, validated_data):
        self._update_user_profile(instance.profile, validated_data)
        instance.save()
        return instance

    def _update_user_profile(self, profile, validated_data):
        profile_data = validated_data.pop('profile', {})
        user_data = profile_data.pop('user', {})
        for attr, value in user_data.items():
            setattr(profile.user, attr, value)
        profile.user.save()
        for attr, value in profile_data.items():
            setattr(profile, attr, value)
        profile.save()