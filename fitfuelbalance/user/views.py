from django.shortcuts import render, redirect, get_object_or_404
from django.views import generic
from django.views.generic import TemplateView
from django.urls import reverse_lazy
from django.contrib.auth import authenticate, login
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseBadRequest
from .forms import *
from .models import *
from .serializers import *
from rest_framework import viewsets
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from sport.models import Training
from sport.serializers import TrainingSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
import json

# Vistas del usuario

class RegularUserSignUpView(generic.CreateView):
    form_class = RegularUserCreationForm
    success_url = reverse_lazy('profile')
    template_name = 'regularsignup.html'
    
    def form_valid(self, form):
        valid = super(RegularUserSignUpView, self).form_valid(form)
        username = form.cleaned_data['username']
        password = form.cleaned_data['password1']
        user = authenticate(username=username, password=password)
        login(self.request, user)
        return valid
    
class TrainerSignUpView(generic.CreateView):
    form_class = TrainerCreationForm
    success_url = reverse_lazy('profile')
    template_name = 'trainersignup.html'
    
    def form_valid(self, form):
        valid = super(TrainerSignUpView, self).form_valid(form)
        username = form.cleaned_data['username']
        password = form.cleaned_data['password1']
        user = authenticate(username=username, password=password)
        login(self.request, user)
        return valid

class ProfileView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        try:
            user = request.user
            profile = Profile.objects.get(user=user)
            profile_serializer = ProfileSerializer(profile)

            trainer_data = {}
            if user.is_trainer():
                trainer = user.trainer
                trainer_serializer = TrainerSerializer(trainer)
                trainer_data = trainer_serializer.data

            regular_user_data = {}
            if user.is_regular_user():
                regular_user = user.regularuser
                regular_user_serializer = RegularUserSerializer(regular_user)
                regular_user_data = regular_user_serializer.data

            return Response({
                "profile": profile_serializer.data,
                "trainer": trainer_data,
                "regular_user": regular_user_data,
                "username": user.username,
                "id": user.id,
                "role": "trainer" if user.is_trainer() else "regular_user",
                "personal_trainer": regular_user_data.get('personal_trainer') if regular_user_data else None
            }, status=status.HTTP_200_OK)

        except Profile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, *args, **kwargs):
        try:
            user = request.user
            profile = Profile.objects.get(user=user)
            profile_data = {
                'bio': request.data.get('bio'),
                'age': request.data.get('age'),
                'gender': request.data.get('gender'),
                'image': request.FILES.get('image')
            }
            profile_serializer = ProfileSerializer(profile, data=profile_data, partial=True)
            if profile_serializer.is_valid():
                profile_serializer.save()
            else:
                return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            trainer_serializer = None
            regular_user_serializer = None

            if user.is_trainer():
                trainer = user.trainer
                specialties = request.data.get('specialties')
                if specialties:
                    if isinstance(specialties, str):
                        specialties = json.loads(specialties)
                trainer_data = {
                    'trainer_type': request.data.get('trainer_type'),
                    'specialties': specialties,
                    'communication_email': request.data.get('communication_email'),
                    'phone': request.data.get('phone')
                }
                trainer_serializer = TrainerSerializer(trainer, data=trainer_data, partial=True)
                if trainer_serializer.is_valid():
                    trainer_serializer.save()
                else:
                    return Response(trainer_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            if user.is_regular_user():
                regular_user = user.regularuser
                regular_user_data = {
                    'weight': request.data.get('weight'),
                    'height': request.data.get('height'),
                    'neck': request.data.get('neck'),
                    'shoulder': request.data.get('shoulder'),
                    'chest': request.data.get('chest'),
                    'waist': request.data.get('waist'),
                    'hip': request.data.get('hip'),
                    'arm': request.data.get('arm'),
                    'glute': request.data.get('glute'),
                    'upper_leg': request.data.get('upper_leg'),
                    'middle_leg': request.data.get('middle_leg'),
                    'lower_leg': request.data.get('lower_leg'),
                    'communication_email': request.data.get('communication_email'),
                    'phone': request.data.get('phone')
                }
                regular_user_serializer = RegularUserSerializer(regular_user, data=regular_user_data, partial=True)
                if regular_user_serializer.is_valid():
                    regular_user_serializer.save()
                else:
                    return Response(regular_user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            return Response({
                "profile": profile_serializer.data,
                "trainer": trainer_serializer.data if trainer_serializer else None,
                "regular_user": regular_user_serializer.data if regular_user_serializer else None
            }, status=status.HTTP_200_OK)
        except Profile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SpecialtyView(viewsets.ModelViewSet):
    queryset = Specialty.objects.all()
    serializer_class = SpecialtySerializer
    permission_classes = [IsAuthenticated]

@login_required
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_trainers(request):
    if not request.user.is_regular_user:
        return HttpResponseBadRequest("Solo los usuarios regulares pueden enviar solicitudes.")
    
    trainers = Trainer.objects.all()
    serializer = TrainerSerializer(trainers, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_specialties(request):
    specialties = Specialty.objects.all()
    serializer = SpecialtySerializer(specialties, many=True)
    return Response(serializer.data)

@login_required
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_trainer(request):
    if not request.user.is_regular_user:
        return HttpResponseBadRequest("Solo los usuarios regulares pueden enviar solicitudes.")
    
    specialty = request.GET.get('specialty', None)
    trainer_type = request.GET.get('trainer_type', None)
    
    trainers = Trainer.objects.all()
    
    if specialty:
        trainers = trainers.filter(specialties__name__icontains=specialty)
    if trainer_type:
        trainers = trainers.filter(trainer_type__icontains=trainer_type)
    
    serializer = TrainerSerializer(trainers, many=True)
    return JsonResponse(serializer.data, safe=False)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_request(request):
    if not request.user.is_regular_user():
        return Response({"error": "Solo los usuarios regulares pueden enviar solicitudes."}, status=status.HTTP_400_BAD_REQUEST)
    
    trainer_id = request.data.get('trainerId')
    description = request.data.get('description')
    email = request.data.get('email')
    phone = request.data.get('phone')

    trainer = get_object_or_404(Trainer, id=trainer_id)
    regular_user = request.user.regularuser

    if regular_user.has_personal_trainer():
        return Response({"error": "Ya tienes un entrenador."}, status=status.HTTP_400_BAD_REQUEST)

    training_request, created = TrainingRequest.objects.get_or_create(
        regular_user=regular_user,
        trainer=trainer,
        defaults={
            'description': description,
            'email': email,
            'phone': phone,
        }
    )

    if created:
        return Response({"message": "Solicitud enviada con éxito"}, status=status.HTTP_201_CREATED)
    else:
        return Response({"error": "Ya has enviado una solicitud a este entrenador."}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def trainer_requests(request):
    if not request.user.is_trainer():
        return Response({"error": "Solo los entrenadores pueden ver las solicitudes."}, status=status.HTTP_400_BAD_REQUEST)
    
    trainer = request.user.trainer
    requests = TrainingRequest.objects.filter(trainer=trainer, is_accepted=False)
    serializer = TrainingRequestSerializer(requests, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def manage_request(request, request_id):
    if not request.user.is_trainer():
        return Response({"error": "Solo los entrenadores pueden gestionar las solicitudes."}, status=status.HTTP_400_BAD_REQUEST)
    
    training_request = get_object_or_404(TrainingRequest, id=request_id, trainer=request.user.trainer)
    action = request.data.get('action')
    
    if action == 'accept':
        training_request.is_accepted = True
        training_request.save()
        trainer = training_request.trainer
        regular_user = training_request.regular_user
        trainer.clients.add(regular_user)
        regular_user.personal_trainer = trainer
        regular_user.save()
        return Response({"message": "Solicitud aceptada."}, status=status.HTTP_200_OK)
    elif action == 'reject':
        training_request.delete()
        return Response({"message": "Solicitud rechazada."}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Acción inválida."}, status=status.HTTP_400_BAD_REQUEST)

# Vista para que los entrenadores vean sus solicitudes
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_requests(request):
    if not request.user.is_trainer:
        return Response({"error": "Solo los entrenadores pueden ver las solicitudes."}, status=status.HTTP_400_BAD_REQUEST)
    
    trainer = request.user.trainer
    requests = TrainingRequest.objects.filter(trainer=trainer, is_accepted=False)
    serializer = TrainingRequestSerializer(requests, many=True)
    
    return Response(serializer.data, status=status.HTTP_200_OK)

@login_required
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def trainer_clients(request):
    trainer = get_object_or_404(Trainer, id=request.user.id)
    clients = trainer.clients.all()
    serializer = RegularUserSerializer(clients, many=True)
    return Response(serializer.data)

@login_required
def requests(request):
    # Obtener el entrenador autenticado
    trainer = Trainer.objects.get(id=request.user.id)

    # Obtener todas las solicitudes relacionadas con este entrenador
    requests = TrainingRequest.objects.filter(trainer=trainer)

    context = {
        'requests': requests
    }

    return render(request, 'requests.html', context)

def accept_request(request, request_id):
    training_request = TrainingRequest.objects.get(pk=request_id)
    if training_request:
        # Comprueba si el RegularUser ya tiene un entrenador
        if TrainingRequest.objects.filter(regular_user=training_request.regular_user, is_accepted=True).exists():
            # Manejar el caso donde el usuario ya tiene un entrenador
            pass
        else:
            training_request.is_accepted = True
            training_request.save()
            trainer = training_request.trainer
            regular_user = training_request.regular_user
            trainer.clients.add(regular_user)
            trainer.save()
            regular_user.personal_trainer = trainer
            regular_user.save()
            # Opcional: cancelar otras solicitudes
    return redirect('profile')


def reject_request(request, request_id):
    training_request = get_object_or_404(TrainingRequest, id=request_id, trainer=request.user)
    training_request.delete()
    # Redireccionar a la página donde el entrenador ve todas las solicitudes
    return redirect('requests_page')

def cancel_request(request, request_id):
    training_request = get_object_or_404(TrainingRequest, id=request_id, regular_user=request.user)
    training_request.delete()
    # Redireccionar a la página donde el usuario puede ver o enviar nuevas solicitudes
    return redirect('search_trainer')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_trainer_clients(request):
    if not request.user.is_trainer():
        return Response({"error": "Solo los entrenadores pueden ver esta información."}, status=status.HTTP_400_BAD_REQUEST)
    
    trainer = request.user.trainer
    clients = trainer.clients.all()
    serializer = RegularUserSerializer(clients, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_trainer_details(request):
    user = request.user
    if hasattr(user, 'regularuser'):
        regular_user = user.regularuser
        if regular_user.personal_trainer:
            trainer = regular_user.personal_trainer
            serializer = TrainerSerializer(trainer)
            trainer_data = serializer.data
            trainer_data['communication_email'] = trainer.communication_email
            trainer_data['phone'] = trainer.phone
            return Response(trainer_data, status=status.HTTP_200_OK)
    return Response({"detail": "No tienes un entrenador asignado."}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_trainer(request):
    user = request.user
    if hasattr(user, 'regularuser'):
        regular_user = user.regularuser
        regular_user.personal_trainer = None
        regular_user.save()
        return Response({"message": "Entrenador eliminado exitosamente"}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "No tienes permiso para realizar esta acción"}, status=status.HTTP_403_FORBIDDEN)

class RegularUserViewSet(viewsets.ModelViewSet):
    queryset = RegularUser.objects.all()
    serializer_class = RegularUserSerializer

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
    
class TrainerViewSet(viewsets.ModelViewSet):
    queryset = Trainer.objects.all()
    serializer_class = TrainerSerializer
    
    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def clients(self, request, pk=None):
        trainer = self.get_object()
        clients = trainer.clients.all()
        serializer = CustomUserSerializer(clients, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def by_client(self, request):
        client_id = request.query_params.get('client_id')
        trainings = Training.objects.filter(user_id=client_id)
        serializer = TrainingSerializer(trainings, many=True)
        return Response(serializer.data)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    user = request.user
    profile_data = {
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
    }

    if hasattr(user, 'trainer'):
        trainer = user.trainer
        profile_data.update({
            'role': 'trainer',
            'trainer_type': trainer.trainer_type,
            'specialties': [specialty.name for specialty in trainer.specialties.all()],
            'clients': [client.username for client in trainer.clients.all()],
            'communication_email': trainer.communication_email,
            'phone': trainer.phone,
        })
    elif hasattr(user, 'regularuser'):
        regular_user = user.regularuser
        trainer_data = {}
        if regular_user.personal_trainer:
            trainer = regular_user.personal_trainer
            trainer_data = {
                'username': trainer.username,
                'communication_email': trainer.communication_email,
                'phone': trainer.phone,
                'specialties': [specialty.name for specialty in trainer.specialties.all()],
                'trainer_type': trainer.trainer_type,
            }
        profile_data.update({
            'role': 'regular_user',
            'weight': regular_user.weight,
            'height': regular_user.height,
            'neck': regular_user.neck,
            'shoulder': regular_user.shoulder,
            'chest': regular_user.chest,
            'waist': regular_user.waist,
            'hip': regular_user.hip,
            'arm': regular_user.arm,
            'glute': regular_user.glute,
            'upper_leg': regular_user.upper_leg,
            'middle_leg': regular_user.middle_leg,
            'lower_leg': regular_user.lower_leg,
            'personal_trainer': trainer_data,
        })

    return Response(profile_data, status=status.HTTP_200_OK)
    
class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

class LoginView(APIView):
    authentication_classes = []  # No authentication required
    permission_classes = []  # No permission required

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'userId': user.id}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class TrainerSignUpAPIView(APIView):
    authentication_classes = []  # No authentication required
    permission_classes = []  # No permission required

    def post(self, request, *args, **kwargs):
        serializer = TrainerSignUpSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            login(request, user)  # Inicia sesión al usuario
            return Response({'token': token.key, 'userId': user.id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegularUserSignUpAPIView(APIView):
    authentication_classes = []  # No authentication required
    permission_classes = []  # No permission required

    def post(self, request, *args, **kwargs):
        serializer = RegularUserSignUpSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            login(request, user)  # Inicia sesión al usuario
            return Response({'token': token.key, 'userId': user.id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action

class RegularUserMeasurementViewSet(viewsets.ModelViewSet):
    queryset = RegularUserMeasurement.objects.all()
    serializer_class = RegularUserMeasurementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_regular_user():
            return self.queryset.filter(user=user)
        elif user.is_trainer():
            return self.queryset.filter(user__in=user.trainer.clients.all())
        return self.queryset.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'], url_path='history/(?P<user_id>\d+)', permission_classes=[permissions.IsAuthenticated])
    def history(self, request, user_id=None):
        if not user_id:
            return Response({"error": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        measurements = RegularUserMeasurement.objects.filter(user_id=user_id)
        serializer = RegularUserMeasurementSerializer(measurements, many=True)
        return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def regular_user_details(request, pk):
    try:
        regular_user = RegularUser.objects.get(pk=pk)
        serializer = RegularUserSerializer(regular_user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except RegularUser.DoesNotExist:
        return Response({'error': 'RegularUser not found'}, status=status.HTTP_404_NOT_FOUND)
