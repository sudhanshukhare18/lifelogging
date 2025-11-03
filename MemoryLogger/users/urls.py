# users/urls.py (Create this file if it doesn't exist)
from django.urls import path
from .views import RegisterView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
]