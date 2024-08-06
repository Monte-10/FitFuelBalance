from django.contrib import admin
from .models import Exercise, Training, TrainingExercise

@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'description')
    search_fields = ('name', 'type')

@admin.register(Training)
class TrainingAdmin(admin.ModelAdmin):
    list_display = ('name', 'trainer')
    search_fields = ('name', 'user__username', 'trainer__username')

@admin.register(TrainingExercise)
class TrainingExerciseAdmin(admin.ModelAdmin):
    list_display = ('training', 'exercise', 'repetitions', 'sets', 'weight')
    search_fields = ('training__name', 'exercise__name')
