from rest_framework import serializers
from django.db.models import Q
from .models import *

class FoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Food
        fields = '__all__'
        
class IngredientSerializer(serializers.ModelSerializer):
    food = serializers.PrimaryKeyRelatedField(queryset=Food.objects.all())
    calories = serializers.SerializerMethodField()
    protein = serializers.SerializerMethodField()
    carbohydrates = serializers.SerializerMethodField()
    sugar = serializers.SerializerMethodField()
    fiber = serializers.SerializerMethodField()
    fat = serializers.SerializerMethodField()
    saturated_fat = serializers.SerializerMethodField()
    gluten_free = serializers.SerializerMethodField()
    lactose_free = serializers.SerializerMethodField()
    vegan = serializers.SerializerMethodField()
    vegetarian = serializers.SerializerMethodField()
    pescetarian = serializers.SerializerMethodField()
    contains_meat = serializers.SerializerMethodField()
    contains_vegetables = serializers.SerializerMethodField()
    contains_fish_shellfish_canned_preserved = serializers.SerializerMethodField()
    cereal = serializers.SerializerMethodField()
    pasta_or_rice = serializers.SerializerMethodField()
    dairy_yogurt_cheese = serializers.SerializerMethodField()
    fruit = serializers.SerializerMethodField()
    nuts = serializers.SerializerMethodField()
    legume = serializers.SerializerMethodField()
    sauce_or_condiment = serializers.SerializerMethodField()
    deli_meat = serializers.SerializerMethodField()
    bread_or_toast = serializers.SerializerMethodField()
    egg = serializers.SerializerMethodField()
    special_drink_or_supplement = serializers.SerializerMethodField()
    tuber = serializers.SerializerMethodField()
    other = serializers.SerializerMethodField()
    food_image = serializers.ImageField(source='food.image', read_only=True)
    
    class Meta:
        model = Ingredient
        fields = '__all__'
        
    def get_calories(self, obj):
        return obj.calories
    
    def get_protein(self, obj):
        return obj.protein
    
    def get_carbohydrates(self, obj):
        return obj.carbohydrates
    
    def get_sugar(self, obj):
        return obj.sugar
    
    def get_fiber(self, obj):
        return obj.fiber
    
    def get_fat(self, obj):
        return obj.fat
    
    def get_saturated_fat(self, obj):
        return obj.saturated_fat
    
    def get_gluten_free(self, obj):
        return obj.gluten_free
    
    def get_lactose_free(self, obj):
        return obj.lactose_free
    
    def get_vegan(self, obj):
        return obj.vegan
    
    def get_vegetarian(self, obj):
        return obj.vegetarian
    
    def get_pescetarian(self, obj):
        return obj.pescetarian
    
    def get_contains_meat(self, obj):
        return obj.contains_meat
    
    def get_contains_vegetables(self, obj):
        return obj.contains_vegetables
    
    def get_contains_fish_shellfish_canned_preserved(self, obj):
        return obj.contains_fish_shellfish_canned_preserved
    
    def get_cereal(self, obj):
        return obj.cereal
    
    def get_pasta_or_rice(self, obj):
        return obj.pasta_or_rice
    
    def get_dairy_yogurt_cheese(self, obj):
        return obj.dairy_yogurt_cheese
    
    def get_fruit(self, obj):
        return obj.fruit
    
    def get_nuts(self, obj):
        return obj.nuts
    
    def get_legume(self, obj):
        return obj.legume
    
    def get_sauce_or_condiment(self, obj):
        return obj.sauce_or_condiment
    
    def get_deli_meat(self, obj):
        return obj.deli_meat
    
    def get_bread_or_toast(self, obj):
        return obj.bread_or_toast
    
    def get_egg(self, obj):
        return obj.egg
    
    def get_special_drink_or_supplement(self, obj):
        return obj.special_drink_or_supplement
    
    def get_tuber(self, obj):
        return obj.tuber
    
    def get_other(self, obj):
        return obj.other
    
class IngredientQuantitySerializer(serializers.Serializer):
    ingredient = serializers.PrimaryKeyRelatedField(queryset=Ingredient.objects.all())
    quantity = serializers.IntegerField()
    
class DishIngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = DishIngredient
        fields = ['ingredient', 'quantity']
    
class DishSerializer(serializers.ModelSerializer):
    ingredients = IngredientQuantitySerializer(many=True, write_only=True)
    ingredients_details = DishIngredientSerializer(source='dishingredient_set', many=True, read_only=True)
    calories = serializers.SerializerMethodField()
    protein = serializers.SerializerMethodField()
    carbohydrates = serializers.SerializerMethodField()
    sugar = serializers.SerializerMethodField()
    fiber = serializers.SerializerMethodField()
    fat = serializers.SerializerMethodField()
    saturated_fat = serializers.SerializerMethodField()
    gluten_free = serializers.SerializerMethodField()
    lactose_free = serializers.SerializerMethodField()
    vegan = serializers.SerializerMethodField()
    vegetarian = serializers.SerializerMethodField()
    pescetarian = serializers.SerializerMethodField()
    contains_meat = serializers.SerializerMethodField()
    contains_vegetables = serializers.SerializerMethodField()
    contains_fish_shellfish_canned_preserved = serializers.SerializerMethodField()
    cereal = serializers.SerializerMethodField()
    pasta_or_rice = serializers.SerializerMethodField()
    dairy_yogurt_cheese = serializers.SerializerMethodField()
    fruit = serializers.SerializerMethodField()
    nuts = serializers.SerializerMethodField()
    legume = serializers.SerializerMethodField()
    sauce_or_condiment = serializers.SerializerMethodField()
    deli_meat = serializers.SerializerMethodField()
    bread_or_toast = serializers.SerializerMethodField()
    egg = serializers.SerializerMethodField()
    special_drink_or_supplement = serializers.SerializerMethodField()
    tuber = serializers.SerializerMethodField()
    other = serializers.SerializerMethodField()
    
    class Meta:
        model = Dish
        fields = '__all__'
        
    def create(self, validated_data):
        ingredients_data = validated_data.pop('ingredients')
        dish = Dish.objects.create(**validated_data)
        for ingredient_data in ingredients_data:
            DishIngredient.objects.create(
                dish=dish, 
                ingredient=ingredient_data['ingredient'], 
                quantity=ingredient_data['quantity']
            )
        return dish

    def update(self, instance, validated_data):
        ingredients_data = validated_data.pop('ingredients', None)
        instance.name = validated_data.get('name', instance.name)
        # Actualiza otros campos de Dish según sea necesario

        if ingredients_data is not None:
            instance.dishingredient_set.all().delete()  # Elimina las relaciones de ingredientes existentes
            for ingredient_data in ingredients_data:
                DishIngredient.objects.create(
                    dish=instance, 
                    ingredient=ingredient_data['ingredient'], 
                    quantity=ingredient_data['quantity']
                )

        instance.save()
        return instance

    def get_calories(self, obj):
        return obj.calories
    
    def get_protein(self, obj):
        return obj.protein
    
    def get_carbohydrates(self, obj):
        return obj.carbohydrates
    
    def get_sugar(self, obj):
        return obj.sugar
    
    def get_fiber(self, obj):
        return obj.fiber
    
    def get_fat(self, obj):
        return obj.fat
    
    def get_saturated_fat(self, obj):
        return obj.saturated_fat
    
    def get_gluten_free(self, obj):
        return obj.gluten_free
    
    def get_lactose_free(self, obj):
        return obj.lactose_free
    
    def get_vegan(self, obj):
        return obj.vegan
    
    def get_vegetarian(self, obj):
        return obj.vegetarian
    
    def get_pescetarian(self, obj):
        return obj.pescetarian
    
    def get_contains_meat(self, obj):
        return obj.contains_meat
    
    def get_contains_vegetables(self, obj):
        return obj.contains_vegetables
    
    def get_contains_fish_shellfish_canned_preserved(self, obj):
        return obj.contains_fish_shellfish_canned_preserved
    
    def get_cereal(self, obj):
        return obj.cereal
    
    def get_pasta_or_rice(self, obj):
        return obj.pasta_or_rice
    
    def get_dairy_yogurt_cheese(self, obj):
        return obj.dairy_yogurt_cheese
    
    def get_fruit(self, obj):
        return obj.fruit
    
    def get_nuts(self, obj):
        return obj.nuts
    
    def get_legume(self, obj):
        return obj.legume
    
    def get_sauce_or_condiment(self, obj):
        return obj.sauce_or_condiment
    
    def get_deli_meat(self, obj):
        return obj.deli_meat
    
    def get_bread_or_toast(self, obj):
        return obj.bread_or_toast
    
    def get_egg(self, obj):
        return obj.egg
    
    def get_special_drink_or_supplement(self, obj):
        return obj.special_drink_or_supplement
    
    def get_tuber(self, obj):
        return obj.tuber
    
    def get_other(self, obj):
        return obj.other

class MealDishSerializer(serializers.ModelSerializer):
    dish_name = serializers.ReadOnlyField(source='dish.name')
    class Meta:
        model = MealDish
        fields = ['dish', 'portion', 'notes', 'dish_name']
        
class MealSerializer(serializers.ModelSerializer):
    dishes_data = MealDishSerializer(source='mealdish_set', many=True, read_only=False)
    calories = serializers.SerializerMethodField()
    protein = serializers.SerializerMethodField()
    carbohydrates = serializers.SerializerMethodField()
    sugar = serializers.SerializerMethodField()
    fiber = serializers.SerializerMethodField()
    fat = serializers.SerializerMethodField()
    saturated_fat = serializers.SerializerMethodField()
    gluten_free = serializers.SerializerMethodField()
    lactose_free = serializers.SerializerMethodField()
    vegan = serializers.SerializerMethodField()
    vegetarian = serializers.SerializerMethodField()
    pescetarian = serializers.SerializerMethodField()
    contains_meat = serializers.SerializerMethodField()
    contains_vegetables = serializers.SerializerMethodField()
    contains_fish_shellfish_canned_preserved = serializers.SerializerMethodField()
    cereal = serializers.SerializerMethodField()
    pasta_or_rice = serializers.SerializerMethodField()
    dairy_yogurt_cheese = serializers.SerializerMethodField()
    fruit = serializers.SerializerMethodField()
    nuts = serializers.SerializerMethodField()
    legume = serializers.SerializerMethodField()
    sauce_or_condiment = serializers.SerializerMethodField()
    deli_meat = serializers.SerializerMethodField()
    bread_or_toast = serializers.SerializerMethodField()
    egg = serializers.SerializerMethodField()
    special_drink_or_supplement = serializers.SerializerMethodField()
    tuber = serializers.SerializerMethodField()
    other = serializers.SerializerMethodField()
    
    class Meta:
        model = Meal
        fields = '__all__'
        
    def create(self, validated_data):
        dishes_data = validated_data.pop('mealdish_set')
        meal = Meal.objects.create(**validated_data)
        for dish_data in dishes_data:
            MealDish.objects.create(meal=meal, **dish_data)
        return meal

    def update(self, instance, validated_data):
        dishes_data = validated_data.pop('mealdish_set', None)
        instance.name = validated_data.get('name', instance.name)

        if dishes_data is not None:
            instance.mealdish_set.all().delete()
            for dish_data in dishes_data:
                MealDish.objects.create(meal=instance, **dish_data)

        instance.save()
        return instance
        
    def get_calories(self, obj):
        return obj.calories
    
    def get_protein(self, obj):
        return obj.protein
    
    def get_carbohydrates(self, obj):
        return obj.carbohydrates
    
    def get_sugar(self, obj):
        return obj.sugar
    
    def get_fiber(self, obj):
        return obj.fiber
    
    def get_fat(self, obj):
        return obj.fat
    
    def get_saturated_fat(self, obj):
        return obj.saturated_fat
    
    def get_gluten_free(self, obj):
        return obj.gluten_free
    
    def get_lactose_free(self, obj):
        return obj.lactose_free
    
    def get_vegan(self, obj):
        return obj.vegan
    
    def get_vegetarian(self, obj):
        return obj.vegetarian
    
    def get_pescetarian(self, obj):
        return obj.pescetarian
    
    def get_contains_meat(self, obj):
        return obj.contains_meat
    
    def get_contains_vegetables(self, obj):
        return obj.contains_vegetables
    
    def get_contains_fish_shellfish_canned_preserved(self, obj):
        return obj.contains_fish_shellfish_canned_preserved
    
    def get_cereal(self, obj):
        return obj.cereal
    
    def get_pasta_or_rice(self, obj):
        return obj.pasta_or_rice
    
    def get_dairy_yogurt_cheese(self, obj):
        return obj.dairy_yogurt_cheese
    
    def get_fruit(self, obj):
        return obj.fruit
    
    def get_nuts(self, obj):
        return obj.nuts
    
    def get_legume(self, obj):
        return obj.legume
    
    def get_sauce_or_condiment(self, obj):
        return obj.sauce_or_condiment
    
    def get_deli_meat(self, obj):
        return obj.deli_meat
    
    def get_bread_or_toast(self, obj):
        return obj.bread_or_toast
    
    def get_egg(self, obj):
        return obj.egg
    
    def get_special_drink_or_supplement(self, obj):
        return obj.special_drink_or_supplement
    
    def get_tuber(self, obj):
        return obj.tuber
    
    def get_other(self, obj):
        return obj.other
    
class DailyDietSerializer(serializers.ModelSerializer):
    meals = serializers.PrimaryKeyRelatedField(queryset=Meal.objects.all(), many=True)
    calories = serializers.SerializerMethodField()
    protein = serializers.SerializerMethodField()
    carbohydrates = serializers.SerializerMethodField()
    sugar = serializers.SerializerMethodField()
    fiber = serializers.SerializerMethodField()
    fat = serializers.SerializerMethodField()
    saturated_fat = serializers.SerializerMethodField()
    gluten_free = serializers.SerializerMethodField()
    lactose_free = serializers.SerializerMethodField()
    vegan = serializers.SerializerMethodField()
    vegetarian = serializers.SerializerMethodField()
    pescetarian = serializers.SerializerMethodField()
    contains_meat = serializers.SerializerMethodField()
    contains_vegetables = serializers.SerializerMethodField()
    contains_fish_shellfish_canned_preserved = serializers.SerializerMethodField()
    cereal = serializers.SerializerMethodField()
    pasta_or_rice = serializers.SerializerMethodField()
    dairy_yogurt_cheese = serializers.SerializerMethodField()
    fruit = serializers.SerializerMethodField()
    nuts = serializers.SerializerMethodField()
    legume = serializers.SerializerMethodField()
    sauce_or_condiment = serializers.SerializerMethodField()
    deli_meat = serializers.SerializerMethodField()
    bread_or_toast = serializers.SerializerMethodField()
    egg = serializers.SerializerMethodField()
    special_drink_or_supplement = serializers.SerializerMethodField()
    tuber = serializers.SerializerMethodField()
    other = serializers.SerializerMethodField()
    
    class Meta:
        model = DailyDiet
        fields = '__all__'
        
    def create(self, validated_data):
        meals_data = validated_data.pop('meal_set')
        daily_diet = DailyDiet.objects.create(**validated_data)
        for meal_data in meals_data:
            Meal.objects.create(daily_diet=daily_diet, **meal_data)
        return daily_diet

    def update(self, instance, validated_data):
        meals_data = validated_data.pop('meals', None)
        instance.meals.clear()
        if meals_data is not None:
            for meal_data in meals_data:
                instance.meals.add(meal_data)
        instance.save()
        return instance

        
    def get_calories(self, obj):
        return obj.calories
    
    def get_protein(self, obj):
        return obj.protein
    
    def get_carbohydrates(self, obj):
        return obj.carbohydrates
    
    def get_sugar(self, obj):
        return obj.sugar
    
    def get_fiber(self, obj):
        return obj.fiber
    
    def get_fat(self, obj):
        return obj.fat
    
    def get_saturated_fat(self, obj):
        return obj.saturated_fat
    
    def get_gluten_free(self, obj):
        return obj.gluten_free
    
    def get_lactose_free(self, obj):
        return obj.lactose_free
    
    def get_vegan(self, obj):
        return obj.vegan
    
    def get_vegetarian(self, obj):
        return obj.vegetarian
    
    def get_pescetarian(self, obj):
        return obj.pescetarian
    
    def get_contains_meat(self, obj):
        return obj.contains_meat
    
    def get_contains_vegetables(self, obj):
        return obj.contains_vegetables
    
    def get_contains_fish_shellfish_canned_preserved(self, obj):
        return obj.contains_fish_shellfish_canned_preserved
    
    def get_cereal(self, obj):
        return obj.cereal
    
    def get_pasta_or_rice(self, obj):
        return obj.pasta_or_rice
    
    def get_dairy_yogurt_cheese(self, obj):
        return obj.dairy_yogurt_cheese
    
    def get_fruit(self, obj):
        return obj.fruit
    
    def get_nuts(self, obj):
        return obj.nuts
    
    def get_legume(self, obj):
        return obj.legume
    
    def get_sauce_or_condiment(self, obj):
        return obj.sauce_or_condiment
    
    def get_deli_meat(self, obj):
        return obj.deli_meat
    
    def get_bread_or_toast(self, obj):
        return obj.bread_or_toast
    
    def get_egg(self, obj):
        return obj.egg
    
    def get_special_drink_or_supplement(self, obj):
        return obj.special_drink_or_supplement
    
    def get_tuber(self, obj):
        return obj.tuber
    
    def get_other(self, obj):
        return obj.other

class DietSerializer(serializers.ModelSerializer):
    daily_diets = DailyDietSerializer(source='dailydiet_set', many=True, read_only=True)
    
    class Meta:
        model = Diet
        fields = '__all__'
        
    def create(self, validated_data):
        diet = Diet.objects.create(**validated_data)
        start_date = validated_data['start_date']
        end_date = validated_data['end_date']
        date = start_date
        while date <= end_date:
            if not DailyDiet.objects.filter(Q(diet=diet) & Q(date=date)).exists():
                DailyDiet.objects.create(diet=diet, date=date)
            date += timedelta(days=1)
        return diet

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.start_date = validated_data.get('start_date', instance.start_date)
        instance.end_date = validated_data.get('end_date', instance.end_date)
        instance.save()
        return instance
    
    def validate(self, data):
        if data['start_date'] > data['end_date']:
            raise serializers.ValidationError("start_date must be before end_date")
        return data
    
class DayOptionSerializer(serializers.ModelSerializer):
    breakfast = serializers.PrimaryKeyRelatedField(queryset=Meal.objects.all())
    mid_morning = serializers.PrimaryKeyRelatedField(queryset=Meal.objects.all())
    lunch = serializers.PrimaryKeyRelatedField(queryset=Meal.objects.all())
    snack = serializers.PrimaryKeyRelatedField(queryset=Meal.objects.all())
    dinner = serializers.PrimaryKeyRelatedField(queryset=Meal.objects.all())
    extras = serializers.PrimaryKeyRelatedField(queryset=Meal.objects.all(), many=True)
    calories = serializers.SerializerMethodField()
    protein = serializers.SerializerMethodField()
    carbohydrates = serializers.SerializerMethodField()
    sugar = serializers.SerializerMethodField()
    fiber = serializers.SerializerMethodField()
    fat = serializers.SerializerMethodField()
    saturated_fat = serializers.SerializerMethodField()
    gluten_free = serializers.SerializerMethodField()
    lactose_free = serializers.SerializerMethodField()
    vegan = serializers.SerializerMethodField()
    vegetarian = serializers.SerializerMethodField()
    pescetarian = serializers.SerializerMethodField()
    contains_meat = serializers.SerializerMethodField()
    contains_vegetables = serializers.SerializerMethodField()
    contains_fish_shellfish_canned_preserved = serializers.SerializerMethodField()
    cereal = serializers.SerializerMethodField()
    pasta_or_rice = serializers.SerializerMethodField()
    dairy_yogurt_cheese = serializers.SerializerMethodField()
    fruit = serializers.SerializerMethodField()
    nuts = serializers.SerializerMethodField()
    legume = serializers.SerializerMethodField()
    sauce_or_condiment = serializers.SerializerMethodField()
    deli_meat = serializers.SerializerMethodField()
    bread_or_toast = serializers.SerializerMethodField()
    egg = serializers.SerializerMethodField()
    special_drink_or_supplement = serializers.SerializerMethodField()
    tuber = serializers.SerializerMethodField()
    other = serializers.SerializerMethodField()
    
    class Meta:
        model = DayOption
        fields = ['id', 'name', 'breakfast', 'mid_morning', 'lunch', 'snack', 'dinner', 'extras', 'calories', 'protein', 'carbohydrates', 'sugar', 'fiber', 'fat', 'saturated_fat', 'gluten_free', 'lactose_free', 'vegan', 'vegetarian', 'pescetarian', 'contains_meat', 'contains_vegetables', 'contains_fish_shellfish_canned_preserved', 'cereal', 'pasta_or_rice', 'dairy_yogurt_cheese', 'fruit', 'nuts', 'legume', 'sauce_or_condiment', 'deli_meat', 'bread_or_toast', 'egg', 'special_drink_or_supplement', 'tuber', 'other']
        read_only_fields = ['trainer']
        
    def create(self, validated_data):
        user = self.context['request'].user
        if user.is_trainer:
            trainer = user.trainer
        else:
            raise serializers.ValidationError("El usuario no está autorizado para crear opciones.")

        # Extrae los datos de 'extras' si existen
        extras_data = validated_data.pop('extras', [])
        
        # Crea la instancia de Option incluyendo el trainer obtenido del contexto
        option = DayOption.objects.create(**validated_data, trainer=trainer)
        
        # Configura los extras para la opción creada
        if extras_data:
            option.extras.set(extras_data)
        
        return option
    
    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.breakfast = validated_data.get('breakfast', instance.breakfast)
        instance.mid_morning = validated_data.get('mid_morning', instance.mid_morning)
        instance.lunch = validated_data.get('lunch', instance.lunch)
        instance.snack = validated_data.get('snack', instance.snack)
        instance.dinner = validated_data.get('dinner', instance.dinner)
        
        extras_data = validated_data.get('extras')
        if extras_data is not None:
            instance.extras.set(extras_data)
        
        instance.save()
        return instance
    
    def get_calories(self, obj):
        return obj.calories
    
    def get_protein(self, obj):
        return obj.protein
    
    def get_carbohydrates(self, obj):
        return obj.carbohydrates
    
    def get_sugar(self, obj):
        return obj.sugar
    
    def get_fiber(self, obj):
        return obj.fiber
    
    def get_fat(self, obj):
        return obj.fat
    
    def get_saturated_fat(self, obj):
        return obj.saturated_fat
    
    def get_gluten_free(self, obj):
        return obj.gluten_free
    
    def get_lactose_free(self, obj):
        return obj.lactose_free
    
    def get_vegan(self, obj):
        return obj.vegan
    
    def get_vegetarian(self, obj):
        return obj.vegetarian
    
    def get_pescetarian(self, obj):
        return obj.pescetarian
    
    def get_contains_meat(self, obj):
        return obj.contains_meat
    
    def get_contains_vegetables(self, obj):
        return obj.contains_vegetables
    
    def get_contains_fish_shellfish_canned_preserved(self, obj):
        return obj.contains_fish_shellfish_canned_preserved
    
    def get_cereal(self, obj):
        return obj.cereal
    
    def get_pasta_or_rice(self, obj):
        return obj.pasta_or_rice
    
    def get_dairy_yogurt_cheese(self, obj):
        return obj.dairy_yogurt_cheese
    
    def get_fruit(self, obj):
        return obj.fruit
    
    def get_nuts(self, obj):
        return obj.nuts
    
    def get_legume(self, obj):
        return obj.legume
    
    def get_sauce_or_condiment(self, obj):
        return obj.sauce_or_condiment
    
    def get_deli_meat(self, obj):
        return obj.deli_meat
    
    def get_bread_or_toast(self, obj):
        return obj.bread_or_toast
    
    def get_egg(self, obj):
        return obj.egg
    
    def get_special_drink_or_supplement(self, obj):
        return obj.special_drink_or_supplement
    
    def get_tuber(self, obj):
        return obj.tuber
    
    def get_other(self, obj):
        return obj.other
    
class WeekOptionSerializer(serializers.ModelSerializer):
    monday_option = serializers.PrimaryKeyRelatedField(queryset=DayOption.objects.all())
    tuesday_option = serializers.PrimaryKeyRelatedField(queryset=DayOption.objects.all())
    wednesday_option = serializers.PrimaryKeyRelatedField(queryset=DayOption.objects.all())
    thursday_option = serializers.PrimaryKeyRelatedField(queryset=DayOption.objects.all())
    friday_option = serializers.PrimaryKeyRelatedField(queryset=DayOption.objects.all())
    saturday_option = serializers.PrimaryKeyRelatedField(queryset=DayOption.objects.all())
    sunday_option = serializers.PrimaryKeyRelatedField(queryset=DayOption.objects.all())
    calories = serializers.SerializerMethodField()
    protein = serializers.SerializerMethodField()
    carbohydrates = serializers.SerializerMethodField()
    sugar = serializers.SerializerMethodField()
    fiber = serializers.SerializerMethodField()
    fat = serializers.SerializerMethodField()
    saturated_fat = serializers.SerializerMethodField()
    gluten_free = serializers.SerializerMethodField()
    lactose_free = serializers.SerializerMethodField()
    vegan = serializers.SerializerMethodField()
    vegetarian = serializers.SerializerMethodField()
    pescetarian = serializers.SerializerMethodField()
    contains_meat = serializers.SerializerMethodField()
    contains_vegetables = serializers.SerializerMethodField()
    contains_fish_shellfish_canned_preserved = serializers.SerializerMethodField()
    cereal = serializers.SerializerMethodField()
    pasta_or_rice = serializers.SerializerMethodField()
    dairy_yogurt_cheese = serializers.SerializerMethodField()
    fruit = serializers.SerializerMethodField()
    nuts = serializers.SerializerMethodField()
    legume = serializers.SerializerMethodField()
    sauce_or_condiment = serializers.SerializerMethodField()
    deli_meat = serializers.SerializerMethodField()
    bread_or_toast = serializers.SerializerMethodField()
    egg = serializers.SerializerMethodField()
    special_drink_or_supplement = serializers.SerializerMethodField()
    tuber = serializers.SerializerMethodField()
    other = serializers.SerializerMethodField()
    
    class Meta:
        model = WeekOption
        fields = [
            'id',
            'name',
            'monday_option',
            'tuesday_option',
            'wednesday_option',
            'thursday_option',
            'friday_option',
            'saturday_option',
            'sunday_option',
            'calories', 'protein', 'carbohydrates', 'sugar', 'fiber', 'fat', 'saturated_fat', 'gluten_free', 'lactose_free', 'vegan', 'vegetarian', 'pescetarian', 'contains_meat', 'contains_vegetables', 'contains_fish_shellfish_canned_preserved', 'cereal', 'pasta_or_rice', 'dairy_yogurt_cheese', 'fruit', 'nuts', 'legume', 'sauce_or_condiment', 'deli_meat', 'bread_or_toast', 'egg', 'special_drink_or_supplement', 'tuber', 'other'
        ]
        
        read_only_fields = ['trainer']
        
    def create(self, validated_data):
        user = self.context['request'].user
        if user.is_trainer:
            trainer = user.trainer
        else:
            raise serializers.ValidationError("El usuario no está autorizado para crear opciones de semana.")

        week_option = WeekOption.objects.create(**validated_data, trainer=trainer)

        return week_option

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.save()
        return instance
        
    def get_calories(self, obj):
        return obj.calories
    
    def get_protein(self, obj):
        return obj.protein
    
    def get_carbohydrates(self, obj):
        return obj.carbohydrates
    
    def get_sugar(self, obj):
        return obj.sugar
    
    def get_fiber(self, obj):
        return obj.fiber
    
    def get_fat(self, obj):
        return obj.fat
    
    def get_saturated_fat(self, obj):
        return obj.saturated_fat
    
    def get_gluten_free(self, obj):
        return obj.gluten_free
    
    def get_lactose_free(self, obj):
        return obj.lactose_free
    
    def get_vegan(self, obj):
        return obj.vegan
    
    def get_vegetarian(self, obj):
        return obj.vegetarian
    
    def get_pescetarian(self, obj):
        return obj.pescetarian
    
    def get_contains_meat(self, obj):
        return obj.contains_meat
    
    def get_contains_vegetables(self, obj):
        return obj.contains_vegetables
    
    def get_contains_fish_shellfish_canned_preserved(self, obj):
        return obj.contains_fish_shellfish_canned_preserved
    
    def get_cereal(self, obj):
        return obj.cereal
    
    def get_pasta_or_rice(self, obj):
        return obj.pasta_or_rice
    
    def get_dairy_yogurt_cheese(self, obj):
        return obj.dairy_yogurt_cheese
    
    def get_fruit(self, obj):
        return obj.fruit
    
    def get_nuts(self, obj):
        return obj.nuts
    
    def get_legume(self, obj):
        return obj.legume
    
    def get_sauce_or_condiment(self, obj):
        return obj.sauce_or_condiment
    
    def get_deli_meat(self, obj):
        return obj.deli_meat
    
    def get_bread_or_toast(self, obj):
        return obj.bread_or_toast
    
    def get_egg(self, obj):
        return obj.egg
    
    def get_special_drink_or_supplement(self, obj):
        return obj.special_drink_or_supplement
    
    def get_tuber(self, obj):
        return obj.tuber
    
    def get_other(self, obj):
        return obj.other
    
class OptionSerializer(serializers.ModelSerializer):
    week_option_one = serializers.PrimaryKeyRelatedField(queryset=WeekOption.objects.all())
    week_option_two = serializers.PrimaryKeyRelatedField(queryset=WeekOption.objects.all())
    week_option_three = serializers.PrimaryKeyRelatedField(queryset=WeekOption.objects.all())

    class Meta:
        model = Option
        fields = ['id', 'name', 'week_option_one', 'week_option_two', 'week_option_three']
        read_only_fields = ['trainer']

    def create(self, validated_data):
        user = self.context['request'].user
        if user.is_trainer:
            trainer = user.trainer
        else:
            raise serializers.ValidationError("El usuario no está autorizado para crear opciones.")

        # Crea la instancia de Option incluyendo el trainer obtenido del contexto
        option = Option.objects.create(**validated_data, trainer=trainer)
        return option
    
class AssignedOptionSerializer(serializers.ModelSerializer):
    start_date = serializers.DateField(format="%Y-%m-%d")

    class Meta:
        model = AssignedOption
        fields = '__all__'

    def create(self, validated_data):
        assignment = AssignedOption.objects.create(**validated_data)
        return assignment


class CustomMealIngredientSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='ingredient.id', read_only=True)
    name = serializers.CharField(source='ingredient.name', read_only=True)
    calories = serializers.SerializerMethodField()
    protein = serializers.SerializerMethodField()
    fat = serializers.SerializerMethodField()
    saturated_fat = serializers.SerializerMethodField()
    carbohydrates = serializers.SerializerMethodField()
    sugar = serializers.SerializerMethodField()

    class Meta:
        model = CustomMealIngredient
        fields = [
            'id', 'ingredient', 'name', 'quantity', 'unit_based',
            'calories', 'protein', 'fat', 'saturated_fat', 'carbohydrates', 'sugar'
        ]

    def get_calories(self, obj):
        return obj.calories

    def get_protein(self, obj):
        return obj.protein

    def get_fat(self, obj):
        return obj.fat

    def get_saturated_fat(self, obj):
        return obj.saturated_fat

    def get_carbohydrates(self, obj):
        return obj.carbohydrates

    def get_sugar(self, obj):
        return obj.sugar

class CustomMealSerializer(serializers.ModelSerializer):
    # Relacion inversa: 'ingredients' (related_name en el modelo)
    ingredients = CustomMealIngredientSerializer(many=True, read_only=True)

    class Meta:
        model = CustomMeal
        fields = [
            'id',
            'meal_number',
            'name',
            'day',
            'meal_type',
            'plan',
            'ingredients',
        ]

class PlanSerializer(serializers.ModelSerializer):
    custom_meals = CustomMealSerializer(many=True, read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Plan
        fields = [
            'id',
            'name',
            'user',
            'username',
            'start_date',
            'end_date',
            'custom_meals'
        ]

class ComparativeMealIngredientSerializer(serializers.ModelSerializer):
    ingredient_name = serializers.CharField(source='ingredient.name', read_only=True)
    calories = serializers.SerializerMethodField()
    protein = serializers.SerializerMethodField()
    fat = serializers.SerializerMethodField()
    carbohydrates = serializers.SerializerMethodField()
    sugar = serializers.SerializerMethodField()

    class Meta:
        model = ComparativeMealIngredient
        fields = ['id', 'ingredient', 'ingredient_name', 'quantity', 'unit', 'notes', 'calories', 'protein', 'fat', 'carbohydrates', 'sugar']

    def get_calories(self, obj):
        return obj.ingredient.food.calories if obj.ingredient and obj.ingredient.food else 0

    def get_protein(self, obj):
        return obj.ingredient.food.protein if obj.ingredient and obj.ingredient.food else 0

    def get_fat(self, obj):
        return obj.ingredient.food.fat if obj.ingredient and obj.ingredient.food else 0

    def get_carbohydrates(self, obj):
        return obj.ingredient.food.carbohydrates if obj.ingredient and obj.ingredient.food else 0

    def get_sugar(self, obj):
        return obj.ingredient.food.sugar if obj.ingredient and obj.ingredient.food else 0

class ComparativeMealSerializer(serializers.ModelSerializer):
    ingredients = ComparativeMealIngredientSerializer(many=True, required=False)
    class Meta:
        model = ComparativeMeal
        fields = ['id', 'meal_number', 'name', 'time', 'ingredients']

    def create(self, validated_data):
        ingredients_data = validated_data.pop('ingredients', [])
        meal = ComparativeMeal.objects.create(**validated_data)
        for ing in ingredients_data:
            ComparativeMealIngredient.objects.create(meal=meal, **ing)
        return meal

    def update(self, instance, validated_data):
        ingredients_data = validated_data.pop('ingredients', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if ingredients_data is not None:
            instance.ingredients.all().delete()
            for ing in ingredients_data:
                ComparativeMealIngredient.objects.create(meal=instance, **ing)
        return instance

class ComparativePlanSerializer(serializers.ModelSerializer):
    meals = ComparativeMealSerializer(many=True, required=False)
    class Meta:
        model = ComparativePlan
        fields = ['id', 'name', 'order', 'meals']

    def create(self, validated_data):
        meals_data = validated_data.pop('meals', [])
        plan = ComparativePlan.objects.create(**validated_data)
        for meal in meals_data:
            ComparativeMeal.objects.create(plan=plan, **meal)
        return plan

    def update(self, instance, validated_data):
        meals_data = validated_data.pop('meals', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if meals_data is not None:
            instance.meals.all().delete()
            for meal in meals_data:
                ComparativeMeal.objects.create(plan=instance, **meal)
        return instance

class ComparativePlanTableSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    comparative_plans = ComparativePlanSerializer(many=True, required=False)
    class Meta:
        model = ComparativePlanTable
        fields = ['id', 'user', 'user_username', 'name', 'created_at', 'comparative_plans']

    def create(self, validated_data):
        plans_data = validated_data.pop('comparative_plans', [])
        table = ComparativePlanTable.objects.create(**validated_data)
        for plan_data in plans_data:
            meals_data = plan_data.pop('meals', [])
            plan = ComparativePlan.objects.create(table=table, **plan_data)
            for meal_data in meals_data:
                ingredients_data = meal_data.pop('ingredients', [])
                meal = ComparativeMeal.objects.create(plan=plan, **meal_data)
                for ing_data in ingredients_data:
                    ComparativeMealIngredient.objects.create(meal=meal, **ing_data)
        return table

    def update(self, instance, validated_data):
        # Actualiza el usuario si viene en el payload
        user = validated_data.pop('user', None)
        if user is not None:
            instance.user = user
        plans_data = validated_data.pop('comparative_plans', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if plans_data is not None:
            # Borra todos los planes y comidas antiguos
            instance.comparative_plans.all().delete()
            for plan_data in plans_data:
                meals_data = plan_data.pop('meals', [])
                plan = ComparativePlan.objects.create(table=instance, **plan_data)
                for meal_data in meals_data:
                    ingredients_data = meal_data.pop('ingredients', [])
                    meal = ComparativeMeal.objects.create(plan=plan, **meal_data)
                    for ing_data in ingredients_data:
                        ComparativeMealIngredient.objects.create(meal=meal, **ing_data)
        # Recarga el objeto desde la base de datos para evitar problemas de relaciones
        instance.refresh_from_db()
        return instance

# Serializers simples para edición granular
class ComparativePlanTableSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComparativePlanTable
        fields = ['id', 'user', 'name', 'created_at']

class ComparativePlanSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComparativePlan
        fields = ['id', 'table', 'name', 'order']

class ComparativeMealSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComparativeMeal
        fields = ['id', 'plan', 'meal_number', 'name', 'time']

class ComparativeMealIngredientSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComparativeMealIngredient
        fields = ['id', 'meal', 'ingredient', 'quantity', 'unit', 'notes']
