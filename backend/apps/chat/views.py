from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import Message
from .forms import MessageForm

@login_required
def send_message(request):
  if request.method == "POST":
    form = MessageForm(request.POST)
    if form.is_valid():
      message = form.save(commit=False)
      message.sender = request.user
      message.save()
      return redirect('inbox')
  else:
    form = MessageForm()
  
  return render(request, 'send_message.html', {'form': form})

@login_required
def inbox(request):
  messages = Message.objects.filter(receiver=request.user)
  return render(request, 'inbox.html', {'messages': messages})

