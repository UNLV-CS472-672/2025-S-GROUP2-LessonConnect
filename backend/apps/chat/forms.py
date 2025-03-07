from django import forms
from .models import Message

# https://docs.djangoproject.com/en/5.1/topics/forms/modelforms/
class MessageForm(forms.ModelForm):
  class Meta:
    model = Message
    fields = ['content']
