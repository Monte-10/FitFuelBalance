from django.db import models
from django.contrib.auth import get_user_model
from user.models import *

User = get_user_model()

class Exercise(models.Model):
    EXERCISE_TYPE = (
        ('FUERZA', 'Fuerza'),
        ('RESISTENCIA', 'Resistencia'),
        ('FLEXIBILIDAD', 'Flexibilidad'),
        ('CARDIO', 'Cardio'),
        ('HIIT', 'HIIT'),
        ('FUNCIONAL', 'Funcional'),
        ('BALANCE', 'Balance'),
    )
    name = models.CharField(max_length=255)
    description = models.TextField()
    type = models.CharField(max_length=255, choices=EXERCISE_TYPE)
    image = models.ImageField(upload_to='exercises/images/', null=True, blank=True)
    video_url = models.URLField(null=True, blank=True)

    def __str__(self):
        return self.name

class Training(models.Model):
    trainer = models.ForeignKey('user.Trainer', on_delete=models.CASCADE, related_name='trainer')
    name = models.CharField(max_length=255)
    exercises = models.ManyToManyField(Exercise, through='TrainingExercise')
    date = models.DateField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user')

    def __str__(self):
        return self.name

class TrainingExercise(models.Model):
    training = models.ForeignKey(Training, on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    repetitions = models.IntegerField()
    sets = models.IntegerField()
    weight = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    time = models.IntegerField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.exercise.name} x {self.sets} sets of {self.repetitions}"
    
User = get_user_model()

class WeekTraining(models.Model):
    name = models.CharField(max_length=255)
    monday = models.ManyToManyField(Training, related_name='monday_trainings')
    tuesday = models.ManyToManyField(Training, related_name='tuesday_trainings')
    wednesday = models.ManyToManyField(Training, related_name='wednesday_trainings')
    thursday = models.ManyToManyField(Training, related_name='thursday_trainings')
    friday = models.ManyToManyField(Training, related_name='friday_trainings')
    saturday = models.ManyToManyField(Training, related_name='saturday_trainings')
    sunday = models.ManyToManyField(Training, related_name='sunday_trainings')

    def __str__(self):
        return self.name
    
class AssignedWeekTraining(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    week_training = models.ForeignKey(WeekTraining, on_delete=models.CASCADE)
    start_date = models.DateField()

    def __str__(self):
        return f"Week training '{self.week_training.name}' assigned to {self.user.username}"