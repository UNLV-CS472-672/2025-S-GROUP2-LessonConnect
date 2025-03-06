from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from .models import Chat, User
from .forms import MessageForm

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


