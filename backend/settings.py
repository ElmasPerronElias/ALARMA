import os
import dj_database_url

RAILWAY = os.environ.get('RAILWAY_ENVIRONMENT') is not None

if RAILWAY:
    DEBUG = False
    ALLOWED_HOSTS = ['.up.railway.app', 'localhost', '127.0.0.1']
    DATABASES = {
        'default': dj_database_url.config(default=os.environ.get('DATABASE_URL'))
    }
else:
    DEBUG = True
    ALLOWED_HOSTS = []
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }