from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProyectoViewSet, ColaboracionViewSet, ComentarioViewSet

router = DefaultRouter()
router.register(r'proyectos', ProyectoViewSet, basename='proyecto')
router.register(r'colaboraciones', ColaboracionViewSet, basename='colaboracion')
router.register(r'comentarios', ComentarioViewSet, basename='comentario')

urlpatterns = [
    path('', include(router.urls)),
]
