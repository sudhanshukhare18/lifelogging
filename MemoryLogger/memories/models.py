from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Memory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text_content = models.TextField()
    emotion_label = models.CharField(max_length=50, blank=True, null=True)
    
    
    embedding = models.JSONField(blank=True, null=True) # Will store the list of floats
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Memory by {self.user.username} - {self.created_at.date()}"
