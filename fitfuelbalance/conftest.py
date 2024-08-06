# conftest.py
import pytest
from django.conf import settings

@pytest.fixture(scope='session')
def django_db_setup():
    settings.DATABASES['default'] = {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'fitfuelbalance',  # Nombre de tu base de datos principal
        'USER': 'monte',            # Tu usuario de PostgreSQL
        'PASSWORD': 'monte',        # Contraseña del usuario de PostgreSQL
        'HOST': 'localhost',        # Host donde se ejecuta PostgreSQL
        'PORT': '5432',             # Puerto de PostgreSQL
        'TEST': {
            'NAME': 'test_fitfuelbalance',  # Nombre de la base de datos de pruebas
        }
    }
