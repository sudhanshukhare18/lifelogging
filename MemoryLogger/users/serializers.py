
from rest_framework import serializers
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    # This ensures password is only written (input) and not read (output)
    password = serializers.CharField(write_only=True) 

    class Meta:
        model = User
        # Only expose the fields needed for registration
        fields = ('id', 'username', 'email', 'password') 
        # Make username and email required inputs
        extra_kwargs = {'username': {'required': True}, 'email': {'required': True}}

    def create(self, validated_data):
        # Use Django's built-in method for security
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user