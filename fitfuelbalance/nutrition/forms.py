from django import forms
from .models import *

class FoodForm(forms.ModelForm):
    class Meta:
        model = Food
        fields = '__all__'

class FoodCSVForm(forms.Form):
    csv_file = forms.FileField()
    
class DietForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        trainer = kwargs.pop('trainer', None)
        super(DietForm, self).__init__(*args, **kwargs)
        if trainer:
            self.fields['user'].queryset = trainer.clients.all()

    class Meta:
        model = Diet
        fields = ['user', 'name', 'start_date', 'end_date']

        
class MealForm(forms.ModelForm):
    class Meta:
        model = Meal
        exclude = ['user']
        
class DishForm(forms.ModelForm):
    class Meta:
        model = Dish
        fields = ['name', 'ingredients']
        
class IngredientForm(forms.ModelForm):
    food = forms.ModelChoiceField(queryset=Food.objects.all(), required=True)
    quantity = forms.FloatField(min_value=0, required=True)

    class Meta:
        model = Ingredient
        fields = ['food', 'quantity']