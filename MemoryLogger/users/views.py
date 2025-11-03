from django.shortcuts import render

# Create your views here.
# users/views.py
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .serializers import UserSerializer

class RegisterView(generics.CreateAPIView):
    # Allow ANY user (unauthenticated) to hit this endpoint
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer