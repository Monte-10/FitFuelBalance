# tests.py

from django.urls import reverse
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from .models import CustomUser

class UserTests(TestCase):
    def setUp(self):
        self.client = APIClient(enforce_csrf_checks=False)
        self.user_data = {
            'username': 'testuser',
            'password': 'TestPassword123',
            'email': 'testuser@example.com',
            'first_name': 'Test',
            'last_name': 'User',
        }
        self.trainer_data = {
            'username': 'testtrainer',
            'password': 'TestPassword123',
            'email': 'testtrainer@example.com',
            'first_name': 'Test',
            'last_name': 'Trainer',
            'trainer_type': 'trainer'
        }

    def test_create_regular_user(self):
        url = reverse('regularuser_signup')
        response = self.client.post(url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CustomUser.objects.count(), 1)
        self.assertEqual(CustomUser.objects.get().username, 'testuser')

    def test_create_trainer(self):
        url = reverse('trainer_signup')
        response = self.client.post(url, self.trainer_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CustomUser.objects.count(), 1)
        self.assertEqual(CustomUser.objects.get().username, 'testtrainer')

    def test_login_regular_user(self):
        self.test_create_regular_user()
        url = reverse('frontlogin')
        response = self.client.post(url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)

    def test_login_trainer(self):
        self.test_create_trainer()
        url = reverse('frontlogin')
        response = self.client.post(url, self.trainer_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)

    def test_profile_view(self):
        self.test_create_regular_user()
        url = reverse('frontlogin')
        response = self.client.post(url, self.user_data, format='json')
        token = response.data['token']
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token)
        profile_url = reverse('profile')
        response = self.client.get(profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_search_trainer(self):
        self.test_create_regular_user()
        self.test_create_trainer()
        url = reverse('frontlogin')
        response = self.client.post(url, self.user_data, format='json')
        token = response.data['token']
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token)
        search_url = reverse('search_trainer')
        response = self.client.get(search_url, {'trainer_type': 'trainer'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)
