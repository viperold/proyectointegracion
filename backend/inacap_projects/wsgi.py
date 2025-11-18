"""
WSGI config for inacap_projects project.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'inacap_projects.settings')

application = get_wsgi_application()
