"""
URL configuration for inacap_projects project.
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse, HttpResponse
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # Raíz: índice simple de la API
    path('', lambda request: JsonResponse({
        'name': 'INACAP Valdivia - API',
        'version': 'v1',
        'status': 'ok',
        'endpoints': {
            'admin': '/admin/',
            'auth_token': '/api/token/',
            'auth_refresh': '/api/token/refresh/',
            'users': '/api/users/',
            'projects': '/api/projects/',
        }
    })),
    # Ignorar favicon para evitar 404 en un backend API
    path('favicon.ico', lambda request: HttpResponse(status=204)),
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/users/', include('users.urls')),
    path('api/projects/', include('projects.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
