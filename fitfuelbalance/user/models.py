from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField

# Modelos del usuario

class CustomUser(AbstractUser):
    def __str__(self):
        return self.username
    
    def is_regular_user(self):
        return hasattr(self, 'regularuser')
    
    def is_trainer(self):
        return hasattr(self, 'trainer')

class RegularUser(CustomUser):
    personal_trainer = models.ForeignKey('Trainer', on_delete=models.CASCADE, null=True, blank=True)
    weight = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    height = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    
    # Campos de medidas
    neck = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    shoulder = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    chest = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    waist = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    hip = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    arm = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    glute = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    upper_leg = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    middle_leg = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    lower_leg = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    communication_email = models.EmailField(max_length=254, blank=True, null=True)
    phone = models.CharField(max_length=20, null=True, blank=True)

    def has_personal_trainer(self):
        return self.personal_trainer is not None


class Specialty(models.Model):
    SPECIALTY_CHOICES = [
        ('weight_loss', 'Weight loss'),
        ('muscle_gain', 'Muscle gain'),
        ('strength', 'Strength'),
        ('endurance', 'Endurance'),
        ('flexibility', 'Flexibility'),
        ('other', 'Other'),
    ]

    name = models.CharField(max_length=100, choices=SPECIALTY_CHOICES, unique=True)
    
    def __str__(self):
        return self.get_name_display()

class Trainer(CustomUser):
    clients = models.ManyToManyField('RegularUser', related_name='clients', blank=True)
    specialties = models.ManyToManyField(Specialty, related_name='specialties', blank=True)
    communication_email = models.EmailField(max_length=254, blank=True, null=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    TRAINER_TYPE = [
        ('trainer', 'Trainer'),
        ('nutritionist', 'Nutritionist'),
        ('both', 'Trainer and Nutritionist'),
    ]
    trainer_type = models.CharField(max_length=12, choices=TRAINER_TYPE, null=True, blank=True)


class Profile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    bio = models.TextField(null=True, blank=True)
    age = models.IntegerField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=[('male', 'Male'), ('female', 'Female'), ('other', 'Other')], null=True, blank=True)
    image = models.ImageField(upload_to='profile_pics', null=True, blank=True)

    def __str__(self):
        return f'{self.user.username} Profile'
    
class TrainingRequest(models.Model):
    regular_user = models.ForeignKey(RegularUser, on_delete=models.CASCADE)
    trainer = models.ForeignKey(Trainer, on_delete=models.CASCADE)
    is_accepted = models.BooleanField(default=False)
    description = models.TextField(blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)

    class Meta:
        unique_together = ('regular_user', 'trainer')
        
class RegularUserMeasurement(models.Model):
    user = models.ForeignKey('CustomUser', on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    weight = models.FloatField(null=True, blank=True)
    height = models.FloatField(null=True, blank=True)
    neck = models.FloatField(null=True, blank=True)
    shoulder = models.FloatField(null=True, blank=True)
    chest = models.FloatField(null=True, blank=True)
    waist = models.FloatField(null=True, blank=True)
    hip = models.FloatField(null=True, blank=True)
    arm = models.FloatField(null=True, blank=True)
    glute = models.FloatField(null=True, blank=True)
    upper_leg = models.FloatField(null=True, blank=True)
    middle_leg = models.FloatField(null=True, blank=True)
    lower_leg = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.date}"