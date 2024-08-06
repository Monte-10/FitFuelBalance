from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import *


# Formularios del usuario

class RegularUserCreationForm(UserCreationForm):
    class Meta:
        model = RegularUser
        fields = ('username', 'email', 'first_name', 'last_name', 'password1', 'password2')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
class TrainerCreationForm(UserCreationForm):
    class Meta:
        model = Trainer
        fields = ('username', 'email', 'first_name', 'last_name', 'password1', 'password2')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
class ProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ['bio', 'age', 'gender']
        
class RegularUserInfoForm(forms.ModelForm):
    class Meta:
        model = RegularUser
        fields = ['weight', 'height']
        
class TrainerInfoForm(forms.ModelForm):
    class Meta:
        model = Trainer
        fields = ['trainer_type', 'specialties']
        widgets = {
            'specialties': forms.CheckboxSelectMultiple()
        }

    def __init__(self, *args, **kwargs):
        super(TrainerInfoForm, self).__init__(*args, **kwargs)

class TrainerSearchForm(forms.Form):
    specialty = forms.ModelMultipleChoiceField(
        queryset=Specialty.objects.all(),
        widget=forms.CheckboxSelectMultiple,
        required=False
    )
    trainer_type = forms.ChoiceField(
        choices=Trainer.TRAINER_TYPE,
        required=False
    )
