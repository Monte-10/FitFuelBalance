from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import *

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['bio', 'age', 'gender', 'image']

class TrainerSerializer(serializers.ModelSerializer):
    clients = serializers.SlugRelatedField(slug_field='username', queryset=RegularUser.objects.all(), many=True)
    class Meta:
        model = Trainer
        fields = ['id', 'username', 'specialties', 'trainer_type', 'communication_email', 'phone', 'clients']

class SpecialtySerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialty
        fields = ['id', 'name']

class RegularUserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()
    personal_trainer = TrainerSerializer()

    class Meta:
        model = RegularUser
        fields = [
            'username', 'id', 'weight', 'height', 'neck', 'shoulder', 'chest', 'waist',
            'hip', 'arm', 'glute', 'upper_leg', 'middle_leg', 'lower_leg',
            'communication_email', 'phone', 'personal_trainer', 'profile'
        ]
        extra_kwargs = {
            'username': {'read_only': True},
            'id': {'read_only': True},
            'profile': {'required': False},
            'personal_trainer': {'required': False},
        }

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', None)
        personal_trainer_data = validated_data.pop('personal_trainer', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if profile_data:
            profile_serializer = ProfileSerializer(instance.profile, data=profile_data, partial=True)
            if profile_serializer.is_valid():
                profile_serializer.save()
        
        if personal_trainer_data:
            trainer_serializer = TrainerSerializer(instance.personal_trainer, data=personal_trainer_data, partial=True)
            if trainer_serializer.is_valid():
                trainer_serializer.save()

        instance.save()
        return instance
        
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'

class RegularUserSignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegularUser
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_username(self, value):
        if RegularUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("Este nombre de usuario ya está en uso.")
        return value

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        user = RegularUser.objects.create(**validated_data)
        Profile.objects.create(user=user)  # Aquí se crea el perfil
        return user

class TrainerSignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trainer
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_username(self, value):
        if Trainer.objects.filter(username=value).exists():
            raise serializers.ValidationError("Este nombre de usuario ya está en uso.")
        return value

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        user = Trainer.objects.create(**validated_data)
        Profile.objects.create(user=user)  # Aquí se crea el perfil
        return user

    
class TrainingRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingRequest
        fields = ['id', 'regular_user', 'trainer', 'is_accepted', 'description', 'email', 'phone']
        read_only_fields = ['id', 'is_accepted']
        
class RegularUserMeasurementSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegularUserMeasurement
        fields = ['id', 'user', 'date', 'weight', 'height', 'neck', 'shoulder', 'chest', 'waist', 'hip', 'arm', 'glute', 'upper_leg', 'middle_leg', 'lower_leg']
        read_only_fields = ['id', 'date', 'user']
