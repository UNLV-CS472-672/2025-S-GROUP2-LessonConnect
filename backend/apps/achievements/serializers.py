from rest_framework import serializers
from .models import Achievement, StudentAchievement

class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ['id', 'name', 'description', 'difficulty', 'created_at']

class StudentAchievementSerializer(serializers.ModelSerializer):
    achievement = AchievementSerializer(read_only=True)
    achievement_id = serializers.PrimaryKeyRelatedField(
        queryset=Achievement.objects.all(), source='achievement', write_only=True
    )

    class Meta:
        model = StudentAchievement
        fields = [
            'id', 'student', 'achievement', 'achievement_id',
            'progress', 'unlocked', 'date_unlocked', 'created_at'
        ]
        read_only_fields = ['student', 'unlocked', 'date_unlocked', 'created_at']

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
