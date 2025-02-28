from rest_framework import serializers
from django.contrib.auth.models import User

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
  