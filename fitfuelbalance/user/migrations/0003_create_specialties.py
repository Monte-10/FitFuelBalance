# user/migrations/0003_create_specialties.py

from django.db import migrations

def create_specialties(apps, schema_editor):
    Specialty = apps.get_model('user', 'Specialty')
    specialties = [
        ('weight_loss', 'Weight loss'),
        ('muscle_gain', 'Muscle gain'),
        ('strength', 'Strength'),
        ('endurance', 'Endurance'),
        ('flexibility', 'Flexibility'),
        ('other', 'Other'),
    ]
    for name, display_name in specialties:
        Specialty.objects.create(name=name)

class Migration(migrations.Migration):

    dependencies = [
        ('user', '0002_profile_image'),
    ]

    operations = [
        migrations.RunPython(create_specialties),
    ]
