# Dorian Akhavan 2/9/25
# this file serializes Python objects to/from JSON data
# in other words, we are translating backend objects for the frontend to understand
from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
  # meta class -> the targetted Django model and its keys 
  class Meta:
    model = User
    fields = ["id", "username", "password"]
    # do not return the password when we retrieve the object,
    # only when we create the object
    extra_kwargs = {"password": {"write_only": True}}
  
  # data should be validated before calling this function
  def create(self, validated_data):
    user = User.objects.create_user(**validated_data)
    return user
