import os
import django

# Configurar el entorno de Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fitfuelbalance.settings')  # Reemplaza con el nombre correcto de tus settings.
django.setup()

from user.models import Specialty  # Importa el modelo correctamente.

# Lista de especialidades para agregar a la base de datos
specialties_list = [
    'Weight loss',
    'Muscle gain',
    'Strength',
    'Endurance',
    'Flexibility',
    'Other'
]

# Poblar la base de datos con especialidades
for specialty_name in specialties_list:
    Specialty.objects.get_or_create(name=specialty_name)

print("Especialidades agregadas a la base de datos.")
