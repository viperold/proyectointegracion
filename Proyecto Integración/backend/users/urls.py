from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet, HabilidadViewSet, DisciplinaViewSet

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet, basename='usuario')
router.register(r'habilidades', HabilidadViewSet, basename='habilidad')
router.register(r'disciplinas', DisciplinaViewSet, basename='disciplina')

urlpatterns = [
    path('', include(router.urls)),
]
