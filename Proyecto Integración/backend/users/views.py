from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Habilidad, Disciplina
from .serializers import (
    UsuarioSerializer, 
    UsuarioCreateSerializer, 
    UsuarioProfileSerializer,
    HabilidadSerializer, 
    DisciplinaSerializer,
    ChangePasswordSerializer
)

Usuario = get_user_model()


class UsuarioViewSet(viewsets.ModelViewSet):
    """ViewSet para gestionar usuarios"""
    queryset = Usuario.objects.all()
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['disciplina', 'semestre', 'is_active']
    search_fields = ['nombre', 'apellido', 'email', 'carrera', 'bio']
    ordering_fields = ['date_joined', 'nombre', 'apellido']
    ordering = ['-date_joined']
    
    def get_serializer_class(self):
        """Retorna el serializer apropiado según la acción"""
        if self.action == 'create':
            return UsuarioCreateSerializer
        elif self.action in ['retrieve', 'profile']:
            return UsuarioProfileSerializer
        return UsuarioSerializer
    
    def get_permissions(self):
        """Define permisos según la acción"""
        if self.action in ['create']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]
    
    @action(detail=False, methods=['get', 'put', 'patch'])
    def profile(self, request):
        """Obtiene o actualiza el perfil del usuario autenticado"""
        user = request.user
        
        if request.method == 'GET':
            serializer = UsuarioProfileSerializer(user)
            return Response(serializer.data)
        
        elif request.method in ['PUT', 'PATCH']:
            serializer = UsuarioSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(UsuarioProfileSerializer(user).data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def change_password(self, request):
        """Permite al usuario cambiar su contraseña"""
        user = request.user
        serializer = ChangePasswordSerializer(data=request.data)
        
        if serializer.is_valid():
            # Verifica la contraseña antigua
            if not user.check_password(serializer.data.get('old_password')):
                return Response(
                    {'old_password': ['Contraseña incorrecta.']}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Establece la nueva contraseña
            user.set_password(serializer.data.get('new_password'))
            user.save()
            
            return Response(
                {'message': 'Contraseña actualizada exitosamente.'}, 
                status=status.HTTP_200_OK
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def proyectos(self, request, pk=None):
        """Obtiene los proyectos de un usuario específico"""
        user = self.get_object()
        proyectos = user.proyectos_creados.all()
        
        from projects.serializers import ProyectoSerializer
        serializer = ProyectoSerializer(proyectos, many=True)
        return Response(serializer.data)


class HabilidadViewSet(viewsets.ModelViewSet):
    """ViewSet para gestionar habilidades"""
    queryset = Habilidad.objects.all()
    serializer_class = HabilidadSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['nombre', 'descripcion']
    ordering_fields = ['nombre']
    ordering = ['nombre']


class DisciplinaViewSet(viewsets.ModelViewSet):
    """ViewSet para gestionar disciplinas"""
    queryset = Disciplina.objects.all()
    serializer_class = DisciplinaSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['nombre', 'descripcion']
    ordering_fields = ['nombre']
    ordering = ['nombre']
