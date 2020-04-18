import os

import dj_database_url

from .base import *


DEBUG = False

ALLOWED_HOSTS = ['djreact-messages-board.herokuapp.com']

# # Heroku: Update database configuration from $DATABASE_URL.
# db_from_env = dj_database_url.config(conn_max_age=500)
# DATABASES['default'].update(db_from_env)
DATABASES = {
    'default': dj_database_url.config(conn_max_age=600, ssl_require=True)
}

# SECURITY
SECURE_HSTS_SECONDS = 31536000
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
# Avaible since Django3.0
SECURE_REFERRER_POLICY = 'same-origin'
# Default since Django3.0
# SECURE_CONTENT_TYPE_NOSNIFF = True
# X_FRAME_OPTIONS = 'DENY'
