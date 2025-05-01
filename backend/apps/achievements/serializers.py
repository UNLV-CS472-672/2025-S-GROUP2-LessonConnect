from rest_framework import serializers
from .models import Achievement, StudentAchievement

class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ['id', 'name', 'description', 'difficulty', 'created_at']

class StudentAchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentAchievement
        fields = ['id', 'student', 'achievement', 'progress', 'unlocked', 'date_unlocked']
        read_only_fields = ['id', 'student', 'unlocked', 'date_unlocked']

class StudentAchievementUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentAchievement
        fields = ['progress', 'unlocked', 'date_unlocked']
        read_only_fields = ['date_unlocked']

    def update(self, instance, validated_data):
        progress = validated_data.get('progress', instance.progress)
        if not instance.unlocked and progress >= 100:  # Example unlock threshold
            instance.unlock()
        else:
            instance.progress = progress
            instance.save()
        return instance
