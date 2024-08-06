from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from user.models import CustomUser, Trainer
from nutrition.models import Food, Ingredient, Dish, Meal, Diet, DailyDiet, Option, AssignedOption, WeekOption, DayOption
from datetime import date, timedelta
from django.utils import timezone

class NutritionTests(APITestCase):
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

        self.food_data = {
            'name': 'Apple',
            'unit_weight': 100,
            'calories': 52,
            'protein': 0.26,
            'carbohydrates': 14,
            'sugar': 10,
            'fiber': 2.4,
            'fat': 0.17,
            'saturated_fat': 0.03,
        }

        self.ingredient_data = {
            'name': 'Apple Slice',
            'food': Food.objects.create(**self.food_data).id,
            'quantity': 150
        }

        self.user_data = {
            'username': 'testuser',
            'password': 'TestPassword123',
            'email': 'testuser@example.com',
            'first_name': 'Test',
            'last_name': 'User',
        }
        self.user = CustomUser.objects.create_user(**self.user_data)

        self.dish_data = {
            'user': self.user.id,
            'name': 'Apple Salad'
        }

    def test_create_food(self):
        url = reverse('food-list')
        response = self.client.post(url, self.food_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Food.objects.count(), 1)
        self.assertEqual(Food.objects.get().name, 'Apple')

    def test_create_ingredient(self):
        url = reverse('ingredient-list')
        response = self.client.post(url, self.ingredient_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Ingredient.objects.count(), 1)
        self.assertEqual(Ingredient.objects.get().name, 'Apple Slice')

    def test_create_dish(self):
        ingredient = Ingredient.objects.create(**self.ingredient_data)
        dish_data = {
            'user': self.user.id,
            'name': 'Apple Salad',
            'ingredients': [ingredient.id]
        }
        url = reverse('dish-list')
        response = self.client.post(url, dish_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Dish.objects.count(), 1)
        self.assertEqual(Dish.objects.get().name, 'Apple Salad')

    def test_get_today_dailydiets(self):
        diet = Diet.objects.create(user=self.user, name='Weight Loss', start_date=timezone.now().date(), end_date=timezone.now().date() + timedelta(days=7))
        daily_diet = DailyDiet.objects.create(diet=diet, date=timezone.now().date())
        daily_diet.meals.add(Meal.objects.create(user=self.user, name='Breakfast'))
        url = reverse('today-dailydiets')
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['diet'], diet.id)

    def test_get_dailydiets_by_date(self):
        diet = Diet.objects.create(user=self.user, name='Weight Loss', start_date=timezone.now().date(), end_date=timezone.now().date() + timedelta(days=7))
        daily_diet = DailyDiet.objects.create(diet=diet, date=timezone.now().date())
        daily_diet.meals.add(Meal.objects.create(user=self.user, name='Breakfast'))
        url = reverse('dailydiet-by-date', args=[timezone.now().date().strftime('%Y-%m-%d')])
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['diet'], diet.id)

    def test_assign_option(self):
        week_option = WeekOption.objects.create(
            name='Week Plan',
            trainer=self.trainer,
            monday_option=DayOption.objects.create(name='Monday Plan', trainer=self.trainer, breakfast=Meal.objects.create(name='Breakfast', user=self.user)),
            tuesday_option=DayOption.objects.create(name='Tuesday Plan', trainer=self.trainer, breakfast=Meal.objects.create(name='Breakfast', user=self.user)),
            wednesday_option=DayOption.objects.create(name='Wednesday Plan', trainer=self.trainer, breakfast=Meal.objects.create(name='Breakfast', user=self.user)),
            thursday_option=DayOption.objects.create(name='Thursday Plan', trainer=self.trainer, breakfast=Meal.objects.create(name='Breakfast', user=self.user)),
            friday_option=DayOption.objects.create(name='Friday Plan', trainer=self.trainer, breakfast=Meal.objects.create(name='Breakfast', user=self.user)),
            saturday_option=DayOption.objects.create(name='Saturday Plan', trainer=self.trainer, breakfast=Meal.objects.create(name='Breakfast', user=self.user)),
            sunday_option=DayOption.objects.create(name='Sunday Plan', trainer=self.trainer, breakfast=Meal.objects.create(name='Breakfast', user=self.user)),
        )
        option = Option.objects.create(trainer=self.trainer, name='Nutrition Plan', week_option_one=week_option, week_option_two=week_option, week_option_three=week_option)
        assign_data = {
            'userId': self.user.id,
            'optionId': option.id
        }
        url = reverse('assignOption')
        response = self.client.post(url, assign_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(AssignedOption.objects.count(), 1)
        self.assertEqual(AssignedOption.objects.get().user, self.user)

    def test_adapt_diet_or_option(self):
        diet = Diet.objects.create(user=self.user, name='Weight Loss', start_date=timezone.now().date(), end_date=timezone.now().date() + timedelta(days=7))
        daily_diet = DailyDiet.objects.create(diet=diet, date=timezone.now().date())
        daily_diet.meals.add(Meal.objects.create(user=self.user, name='Breakfast'))
        adapt_data = {
            'user_id': self.user.id,
            'plan_id': diet.id,
            'plan_type': 'diet',
            'calories': 1500
        }
        url = reverse('adapt_diet_or_option')
        response = self.client.post(url, adapt_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
