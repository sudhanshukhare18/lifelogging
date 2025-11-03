from rest_framework import serializers
from .models import Memory

class MemorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Memory
        fields = ['id','user', 'text_content', 'emotion_label', 'embedding','created_at','updated_at']
        read_only_fields = ['user', 'embedding', 'created_at', 'updated_at'] # Set by the server logic
