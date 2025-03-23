from django.contrib import admin

# Register your models here.
from .models import PomodoroSession, PetCatalog, PetCollection

# ai-gen start (ChatGPT-3.5, 0)
@admin.register(PomodoroSession)
class PomodoroSessionAdmin(admin.ModelAdmin):
    list_display = ('student', 'duration', 'is_completed', 'pet_earned', 'start_time', 'end_time')
    list_filter = ('is_completed', 'pet_earned', 'start_time')
    search_fields = ('student__username', 'task_description')
    ordering = ('-start_time',)

@admin.register(PetCatalog)
class PetCatalogAdmin(admin.ModelAdmin):
    list_display = ('name', 'pet_type', 'rarity', 'drop_rate', 'image_preview')
    list_filter = ('rarity',)
    search_fields = ('name', 'pet_type', 'description')
   
    def image_preview(self, obj):
        if obj.image:
            return f"{obj.image.url}"
        return "No Image"
    image_preview.short_description = "Image Preview"

@admin.register(PetCollection)
class PetCollectionAdmin(admin.ModelAdmin):
    list_display = ('student', 'pet_catalog', 'acquired_at', 'is_active')
    list_filter = ('is_active', 'acquired_at')
    search_fields = ('student__username', 'pet_catalog__name')
    ordering = ('-acquired_at',)
# ai-gen end
