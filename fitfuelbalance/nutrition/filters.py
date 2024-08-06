# nutrition/filters.py

import django_filters
from .models import *
from django import forms
import django_filters
from django_filters import rest_framework as filters

class FoodFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(lookup_expr='icontains')
    unit_weight = django_filters.RangeFilter()
    calories = django_filters.RangeFilter()
    protein = django_filters.RangeFilter()
    carbohydrates = django_filters.RangeFilter()
    sugar = django_filters.RangeFilter()
    fiber = django_filters.RangeFilter()
    fat = django_filters.RangeFilter()
    saturated_fat = django_filters.RangeFilter()
    gluten_free = django_filters.BooleanFilter()
    lactose_free = django_filters.BooleanFilter()
    vegan = django_filters.BooleanFilter()
    vegetarian = django_filters.BooleanFilter()
    pescetarian = django_filters.BooleanFilter()
    contains_meat = django_filters.BooleanFilter()
    contains_vegetables = django_filters.BooleanFilter()
    contains_fish_shellfish_canned_preserved = django_filters.BooleanFilter()
    cereal = django_filters.BooleanFilter()
    pasta_or_rice = django_filters.BooleanFilter()
    dairy_yogurt_cheese = django_filters.BooleanFilter()
    fruit = django_filters.BooleanFilter()
    nuts = django_filters.BooleanFilter()
    legume = django_filters.BooleanFilter()
    sauce_or_condiment = django_filters.BooleanFilter()
    deli_meat = django_filters.BooleanFilter()
    bread_or_toast = django_filters.BooleanFilter()
    egg = django_filters.BooleanFilter()
    special_drink_or_supplement = django_filters.BooleanFilter()
    tuber = django_filters.BooleanFilter()
    other = django_filters.BooleanFilter()

    class Meta:
        model = Food
        fields = {
            'name': ['icontains'],
            'unit_weight': ['lt', 'gt'],
            'calories': ['lt', 'gt'],
            'protein': ['lt', 'gt'],
            'carbohydrates': ['lt', 'gt'],
            'sugar': ['lt', 'gt'],
            'fiber': ['lt', 'gt'],
            'fat': ['lt', 'gt'],
            'saturated_fat': ['lt', 'gt'],
            'gluten_free': ['exact'],
            'lactose_free': ['exact'],
            'vegan': ['exact'],
            'vegetarian': ['exact'],
            'pescetarian': ['exact'],
            'contains_meat': ['exact'],
            'contains_vegetables': ['exact'],
            'contains_fish_shellfish_canned_preserved': ['exact'],
            'cereal': ['exact'],
            'pasta_or_rice': ['exact'],
            'dairy_yogurt_cheese': ['exact'],
            'fruit': ['exact'],
            'nuts': ['exact'],
            'legume': ['exact'],
            'sauce_or_condiment': ['exact'],
            'deli_meat': ['exact'],
            'bread_or_toast': ['exact'],
            'egg': ['exact'],
            'special_drink_or_supplement': ['exact'],
            'tuber': ['exact'],
            'other': ['exact'],
        }


class DishFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(field_name="name", lookup_expr='icontains')
    min_calories = django_filters.NumberFilter(method='filter_min_calories')
    max_calories = django_filters.NumberFilter(method='filter_max_calories')
    min_protein = django_filters.NumberFilter(method='filter_min_protein')
    max_protein = django_filters.NumberFilter(method='filter_max_protein')
    min_carbohydrates = django_filters.NumberFilter(method='filter_min_carbohydrates')
    max_carbohydrates = django_filters.NumberFilter(method='filter_max_carbohydrates')
    min_fat = django_filters.NumberFilter(method='filter_min_fat')
    max_fat = django_filters.NumberFilter(method='filter_max_fat')
    min_sugar = django_filters.NumberFilter(method='filter_min_sugar')
    max_sugar = django_filters.NumberFilter(method='filter_max_sugar')
    min_fiber = django_filters.NumberFilter(method='filter_min_fiber')
    max_fiber = django_filters.NumberFilter(method='filter_max_fiber')
    min_saturated_fat = django_filters.NumberFilter(method='filter_min_saturated_fat')
    max_saturated_fat = django_filters.NumberFilter(method='filter_max_saturated_fat')

    class Meta:
        model = Dish
        fields = ['name']

    def filter_min_calories(self, queryset, name, value):
        return queryset.filter(ingredients__calories__gte=value).distinct()

    def filter_max_calories(self, queryset, name, value):
        return queryset.filter(ingredients__calories__lte=value).distinct()

    def filter_min_protein(self, queryset, name, value):
        return queryset.filter(ingredients__protein__gte=value).distinct()

    def filter_max_protein(self, queryset, name, value):
        return queryset.filter(ingredients__protein__lte=value).distinct()

    def filter_min_carbohydrates(self, queryset, name, value):
        return queryset.filter(ingredients__carbohydrates__gte=value).distinct()

    def filter_max_carbohydrates(self, queryset, name, value):
        return queryset.filter(ingredients__carbohydrates__lte=value).distinct()

    def filter_min_fat(self, queryset, name, value):
        return queryset.filter(ingredients__fat__gte=value).distinct()

    def filter_max_fat(self, queryset, name, value):
        return queryset.filter(ingredients__fat__lte=value).distinct()

    def filter_min_sugar(self, queryset, name, value):
        return queryset.filter(ingredients__sugar__gte=value).distinct()

    def filter_max_sugar(self, queryset, name, value):
        return queryset.filter(ingredients__sugar__lte=value).distinct()

    def filter_min_fiber(self, queryset, name, value):
        return queryset.filter(ingredients__fiber__gte=value).distinct()

    def filter_max_fiber(self, queryset, name, value):
        return queryset.filter(ingredients__fiber__lte=value).distinct()

    def filter_min_saturated_fat(self, queryset, name, value):
        return queryset.filter(ingredients__saturated_fat__gte=value).distinct()

    def filter_max_saturated_fat(self, queryset, name, value):
        return queryset.filter(ingredients__saturated_fat__lte=value).distinct()

class MealFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(field_name="name", lookup_expr='icontains')
    min_calories = django_filters.NumberFilter(method='filter_min_calories')
    max_calories = django_filters.NumberFilter(method='filter_max_calories')
    min_protein = django_filters.NumberFilter(method='filter_min_protein')
    max_protein = django_filters.NumberFilter(method='filter_max_protein')
    min_carbohydrates = django_filters.NumberFilter(method='filter_min_carbohydrates')
    max_carbohydrates = django_filters.NumberFilter(method='filter_max_carbohydrates')
    min_fat = django_filters.NumberFilter(method='filter_min_fat')
    max_fat = django_filters.NumberFilter(method='filter_max_fat')
    min_sugar = django_filters.NumberFilter(method='filter_min_sugar')
    max_sugar = django_filters.NumberFilter(method='filter_max_sugar')
    min_fiber = django_filters.NumberFilter(method='filter_min_fiber')
    max_fiber = django_filters.NumberFilter(method='filter_max_fiber')
    min_saturated_fat = django_filters.NumberFilter(method='filter_min_saturated_fat')
    max_saturated_fat = django_filters.NumberFilter(method='filter_max_saturated_fat')

    class Meta:
        model = Meal
        fields = ['name']

    def filter_min_calories(self, queryset, name, value):
        return queryset.filter(dishes__calories__gte=value).distinct()

    def filter_max_calories(self, queryset, name, value):
        return queryset.filter(dishes__calories__lte=value).distinct()

    def filter_min_protein(self, queryset, name, value):
        return queryset.filter(dishes__protein__gte=value).distinct()

    def filter_max_protein(self, queryset, name, value):
        return queryset.filter(dishes__protein__lte=value).distinct()

    def filter_min_carbohydrates(self, queryset, name, value):
        return queryset.filter(dishes__carbohydrates__gte=value).distinct()

    def filter_max_carbohydrates(self, queryset, name, value):
        return queryset.filter(dishes__carbohydrates__lte=value).distinct()

    def filter_min_fat(self, queryset, name, value):
        return queryset.filter(dishes__fat__gte=value).distinct()

    def filter_max_fat(self, queryset, name, value):
        return queryset.filter(dishes__fat__lte=value).distinct()

    def filter_min_sugar(self, queryset, name, value):
        return queryset.filter(dishes__sugar__gte=value).distinct()

    def filter_max_sugar(self, queryset, name, value):
        return queryset.filter(dishes__sugar__lte=value).distinct()

    def filter_min_fiber(self, queryset, name, value):
        return queryset.filter(dishes__fiber__gte=value).distinct()

    def filter_max_fiber(self, queryset, name, value):
        return queryset.filter(dishes__fiber__lte=value).distinct()

    def filter_min_saturated_fat(self, queryset, name, value):
        return queryset.filter(dishes__saturated_fat__gte=value).distinct()

    def filter_max_saturated_fat(self, queryset, name, value):
        return queryset.filter(dishes__saturated_fat__lte=value).distinct()

class DayOptionFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(field_name="name", lookup_expr='icontains')

    class Meta:
        model = DayOption
        fields = ['name']

class WeekOptionFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(field_name="name", lookup_expr='icontains')

    class Meta:
        model = WeekOption
        fields = ['name']