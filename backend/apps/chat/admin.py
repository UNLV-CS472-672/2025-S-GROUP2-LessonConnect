from django.contrib import admin
from .models import Chat, Message, MutedUser, BlockedUser, ReportedUser

admin.site.register(Chat)
admin.site.register(Message)
admin.site.register(MutedUser)
admin.site.register(BlockedUser)
admin.site.register(ReportedUser)