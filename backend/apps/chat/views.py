from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from .models import Chat, User
from .forms import MessageForm

# https://chatgpt.com/share/67fd9c70-d378-8005-8c39-b0453f0f790f
from rest_framework import viewsets, permissions, serializers
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth.models import User
from django.db.models import Q
from .models import Chat, Message
from .serializers import ChatSerializer, MessageSerializer

class ChatViewSet(viewsets.ModelViewSet):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Restrict to chats where the user is a participant."""
        user = self.request.user
        return Chat.objects.filter(Q(user1=user) | Q(user2=user)).order_by('-updatedAt')
        # return Chat.objects.filter(user1=user).union(Chat.objects.filter(user2=user)).order_by('-updatedAt')

    def perform_create(self, serializer):
        """Prevent duplicate chats, enforce user1-user2 ordering."""
        user1 = self.request.user
        user2_id = self.request.data.get('user2')
        if not user2_id:
            raise serializers.ValidationError({"user2": "This field is required."})

        try:
            user2 = User.objects.get(id=user2_id)
        except User.DoesNotExist:
            raise serializers.ValidationError({"user2": "User not found."})

        chat, created = Chat.get_or_create_chat(user1, user2)
        if not created:
            raise serializers.ValidationError("Chat already exists.")
        serializer.instance = chat

    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        """List messages for a chat."""
        chat = self.get_object()
        messages = chat.messages.all()
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

# =============================================
# NOTE: ENPOINTS BELOW ARE CONSIDERED LEGACY
# =============================================

@login_required
def select_send_message(request):
  """Allow the user to select a recipient for messaging."""
  if request.method == "POST":
    user_id = request.POST.get("receiver")
    return redirect(reverse('send_message', args=[user_id]))  # Redirect to send_message view

  users = User.objects.exclude(id=request.user.id)  # Exclude the logged-in user
  return render(request, 'select_send_message.html', {'users': users})

@login_required
def send_message(request, user_id):
  receiver = get_object_or_404(User, id=user_id)
  chat = Chat.get_or_create_chat(request.user, receiver)

  if request.method == "POST":
    form = MessageForm(request.POST)
    if form.is_valid():
      message = form.save(commit=False)
      message.sender = request.user
      message.chat = chat
      message.save()
      return redirect('chat_detail', chat_id=chat.id)
  # Handle GET request by preloading the message form
  else:
    form = MessageForm()

  return render(request, 'send_message.html', {'form': form, 'receiver': receiver})

@login_required
def chat_list(request):
  chats = Chat.objects.filter(user1=request.user) | Chat.objects.filter(user2=request.user)
  return render(request, 'chat_list.html', {'chats': chats})

@login_required
def chat_detail(request, chat_id):
  chat = get_object_or_404(Chat, id=chat_id)
  
  # Ensure the logged-in user is part of this chat
  if request.user != chat.user1 and request.user != chat.user2:
    return redirect('chat_list')

  messages = chat.messages.all()
  form = MessageForm()

  return render(request, 'chat_detail.html', {'chat': chat, 'messages': messages, 'form': form})


