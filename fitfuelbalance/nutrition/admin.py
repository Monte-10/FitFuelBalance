from collections.abc import Sequence
from django.contrib import admin
from django.http.request import HttpRequest
from user.models import *
from .models import *

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'date_joined')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    
@admin.register(Trainer)
class TrainerAdmin(admin.ModelAdmin):
    list_display = ('get_username', )
    search_fields = ('user__username', 'user__email', 'user__first_name', 'user__last_name')

    def get_username(self, obj):
        return obj.user.username
    get_username.short_description = 'Username'

@admin.register(RegularUser)
class RegularUserAdmin(admin.ModelAdmin):
    list_display = ('get_username', 'weight', 'height')
    search_fields = ('user__username', 'user__email', 'user__first_name', 'user__last_name')

    def get_username(self, obj):
        return obj.user.username
    get_username.short_description = 'Username'

@admin.register(Food)
class FoodAdmin(admin.ModelAdmin):
    list_display = ('name', 'unit_weight', 'calories', 'protein', 'carbohydrates', 'sugar', 'fiber', 'fat', 'saturated_fat', 'gluten_free', 'lactose_free', 'vegan', 'vegetarian', 'pescetarian', 'contains_meat', 'contains_vegetables', 'contains_fish_shellfish_canned_preserved', 'cereal', 'pasta_or_rice', 'dairy_yogurt_cheese', 'fruit', 'nuts', 'legume', 'sauce_or_condiment', 'deli_meat', 'bread_or_toast', 'egg', 'special_drink_or_supplement', 'tuber', 'other')
    search_fields = ('name',)
    
@admin.register(Ingredient)
class IngredientAdmin(admin.ModelAdmin):
    list_display = ('name', 'food', 'calories', 'protein', 'carbohydrates', 'sugar', 'fiber', 'fat', 'saturated_fat', 'gluten_free', 'lactose_free', 'vegan', 'vegetarian', 'pescetarian', 'contains_meat', 'contains_vegetables', 'contains_fish_shellfish_canned_preserved', 'cereal', 'pasta_or_rice', 'dairy_yogurt_cheese', 'fruit', 'nuts', 'legume', 'sauce_or_condiment', 'deli_meat', 'bread_or_toast', 'egg', 'special_drink_or_supplement', 'tuber', 'other')
    search_fields = ('name',)
    
@admin.register(Dish)
class DishAdmin(admin.ModelAdmin):
    list_display = ('name', 'display_ingredients','calories', 'protein', 'carbohydrates', 'sugar', 'fiber', 'fat', 'saturated_fat', 'gluten_free', 'lactose_free', 'vegan', 'vegetarian', 'pescetarian', 'contains_meat', 'contains_vegetables', 'contains_fish_shellfish_canned_preserved', 'cereal', 'pasta_or_rice', 'dairy_yogurt_cheese', 'fruit', 'nuts', 'legume', 'sauce_or_condiment', 'deli_meat', 'bread_or_toast', 'egg', 'special_drink_or_supplement', 'tuber', 'other')
    search_fields = ('name',)
    
    def display_ingredients(self, obj):
        return ", ".join([ingredient.name for ingredient in obj.ingredients.all()])

    display_ingredients.short_description = 'Ingredients'
    
@admin.register(DishIngredient)
class DishIngredientAdmin(admin.ModelAdmin):
    list_display = ('dish', 'ingredient', 'quantity')
    search_fields = ('dish__name', 'ingredient__name')
    
@admin.register(Meal)
class MealAdmin(admin.ModelAdmin):
    list_display = ('name', 'calories', 'protein', 'carbohydrates', 'sugar', 'fiber', 'fat', 'saturated_fat', 'gluten_free', 'lactose_free', 'vegan', 'vegetarian', 'pescetarian', 'contains_meat', 'contains_vegetables', 'contains_fish_shellfish_canned_preserved', 'cereal', 'pasta_or_rice', 'dairy_yogurt_cheese', 'fruit', 'nuts', 'legume', 'sauce_or_condiment', 'deli_meat', 'bread_or_toast', 'egg', 'special_drink_or_supplement', 'tuber', 'other')
    search_fields = ('name',)

@admin.register(MealDish)
class MealDishAdmin(admin.ModelAdmin):
    list_display = ('meal', 'dish', 'portion', 'notes')
    search_fields = ('meal__name', 'dish__name')
    
@admin.register(DailyDiet)
class DailyDietAdmin(admin.ModelAdmin):
    list_display = ('date', 'calories', 'protein', 'carbohydrates', 'sugar', 'fiber', 'fat', 'saturated_fat', 'gluten_free', 'lactose_free', 'vegan', 'vegetarian', 'pescetarian', 'contains_meat', 'contains_vegetables', 'contains_fish_shellfish_canned_preserved', 'cereal', 'pasta_or_rice', 'dairy_yogurt_cheese', 'fruit', 'nuts', 'legume', 'sauce_or_condiment', 'deli_meat', 'bread_or_toast', 'egg', 'special_drink_or_supplement', 'tuber', 'other')
    search_fields = ('date',)
    
@admin.register(Diet)
class DietAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    
@admin.register(DayOption)
class DayOptionAdmin(admin.ModelAdmin):
    list_display = ('name', 'trainer', 'calories', 'protein', 'carbohydrates', 'sugar', 'fiber', 'fat', 'saturated_fat', 'gluten_free', 'lactose_free', 'vegan', 'vegetarian', 'pescetarian', 'contains_meat', 'contains_vegetables', 'contains_fish_shellfish_canned_preserved', 'cereal', 'pasta_or_rice', 'dairy_yogurt_cheese', 'fruit', 'nuts', 'legume', 'sauce_or_condiment', 'deli_meat', 'bread_or_toast', 'egg', 'special_drink_or_supplement', 'tuber', 'other')
    search_fields = ('name', 'trainer', 'calories', 'protein', 'carbohydrates', 'sugar', 'fiber', 'fat', 'saturated_fat', 'gluten_free', 'lactose_free', 'vegan', 'vegetarian', 'pescetarian', 'contains_meat', 'contains_vegetables', 'contains_fish_shellfish_canned_preserved', 'cereal', 'pasta_or_rice', 'dairy_yogurt_cheese', 'fruit', 'nuts', 'legume', 'sauce_or_condiment', 'deli_meat', 'bread_or_toast', 'egg', 'special_drink_or_supplement', 'tuber', 'other')

admin.site.register(ComparativePlanTable)
admin.site.register(ComparativePlan)
admin.site.register(ComparativeMeal)
admin.site.register(ComparativeMealIngredient)