from .settings import *

# Configuración de la base de datos para pruebas
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',
        'ATOMIC_REQUESTS': True,
    }
}

# Otros ajustes específicos para pruebas
SECRET_KEY = 'test-secret-key'

DEBUG = True

# Usar el backend de contraseñas de hashing rápido de Django para pruebas
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.MD5PasswordHasher',
]

# Desactivar middleware y aplicaciones que no se utilizan en pruebas para acelerar la ejecución
MIDDLEWARE = [mw for mw in MIDDLEWARE if mw not in ['debug_toolbar.middleware.DebugToolbarMiddleware']]
INSTALLED_APPS = [app for app in INSTALLED_APPS if app != 'debug_toolbar']

# Configuración de REST framework para pruebas
REST_FRAMEWORK['DEFAULT_AUTHENTICATION_CLASSES'] = (
    'rest_framework.authentication.SessionAuthentication',
    'rest_framework.authentication.BasicAuthentication',
)

# Configuración de CORS para pruebas
CORS_ALLOW_ALL_ORIGINS = True

# Configuración de las rutas de archivos estáticos y de medios para pruebas
STATIC_URL = '/static/'
MEDIA_URL = '/media/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static_test')
MEDIA_ROOT = os.path.join(BASE_DIR, 'media_test')

# Configuración de la caché para pruebas
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
    }
}

# Desactivar envío de correos electrónicos en pruebas
EMAIL_BACKEND = 'django.core.mail.backends.locmem.EmailBackend'