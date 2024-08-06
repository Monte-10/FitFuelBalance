from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from user.models import CustomUser, Trainer
from sport.models import Exercise, Training, TrainingExercise
from datetime import date

User = get_user_model()

class SportTests(APITestCase):
    def setUp(self):
        self.trainer_data = {
            'username': 'testtrainer',
            'password': 'TestPassword123',
            'email': 'testtrainer@example.com',
            'first_name': 'Test',
            'last_name': 'Trainer',
        }
        self.trainer = Trainer.objects.create_user(**self.trainer_data)
        self.client.force_authenticate(user=self.trainer)

        self.exercise_data = {
            'name': 'Push Up',
            'description': 'Push up exercise',
            'type': 'FUERZA'
        }

        self.training_data = {
            'trainer': self.trainer,
            'name': 'Morning Workout',
            'date': date.today(),
        }

        self.user_data = {
            'username': 'testuser',
            'password': 'TestPassword123',
            'email': 'testuser@example.com',
            'first_name': 'Test',
            'last_name': 'User',
        }
        self.user = CustomUser.objects.create_user(**self.user_data)

    def test_create_exercise(self):
        url = reverse('exercise-list')
        response = self.client.post(url, self.exercise_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Exercise.objects.count(), 1)
        self.assertEqual(Exercise.objects.get().name, 'Push Up')

    def test_create_training(self):
        url = reverse('training-list')
        self.training_data['user'] = self.user.id
        response = self.client.post(url, self.training_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Training.objects.count(), 1)
        self.assertEqual(Training.objects.get().name, 'Morning Workout')

    def test_create_training_exercise(self):
        exercise = Exercise.objects.create(**self.exercise_data)
        training = Training.objects.create(trainer=self.trainer, name='Morning Workout', date=date.today(), user=self.user)
        training_exercise_data = {
            'training': training.id,
            'exercise': exercise.id,
            'repetitions': 10,
            'sets': 3,
            'weight': 50,
        }
        url = reverse('trainingexercise-list')
        response = self.client.post(url, training_exercise_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(TrainingExercise.objects.count(), 1)
        self.assertEqual(TrainingExercise.objects.get().repetitions, 10)

    def test_get_today_trainings(self):
        training = Training.objects.create(trainer=self.trainer, name='Morning Workout', date=date.today(), user=self.user)
        url = reverse('today-trainings')
        response = self.client.get(url, {'user': self.user.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Morning Workout')

    def test_get_trainings_by_date(self):
        training = Training.objects.create(trainer=self.trainer, name='Morning Workout', date=date.today(), user=self.user)
        url = reverse('training-by-date', args=[date.today().strftime('%Y-%m-%d')])
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Morning Workout')