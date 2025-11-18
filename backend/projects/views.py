from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Proyecto, Colaboracion, Comentario
from .serializers import (
    ProyectoSerializer,
    ProyectoListSerializer,
    ColaboracionSerializer,
    ColaboracionCreateSerializer,
    ComentarioSerializer
)


class ProyectoViewSet(viewsets.ModelViewSet):
    """ViewSet para gestionar proyectos"""
    queryset = Proyecto.objects.all()
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['estado', 'disciplinas_requeridas', 'creador']
    search_fields = ['titulo', 'descripcion', 'objetivo']
    ordering_fields = ['created_at', 'titulo', 'colaboradores_necesarios']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        """Retorna el serializer apropiado según la acción"""
        if self.action == 'list':
            return ProyectoListSerializer
        return ProyectoSerializer
    
    def get_permissions(self):
        """Define permisos según la acción"""
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticatedOrReadOnly()]
        return [permissions.IsAuthenticated()]
    
    def perform_create(self, serializer):
        """Asigna el creador al proyecto"""
        serializer.save(creador=self.request.user)
    
    def perform_update(self, serializer):
        """Solo permite actualizar si es el creador"""
        if serializer.instance.creador != self.request.user:
            return Response(
                {'error': 'No tienes permiso para editar este proyecto.'},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer.save()
    
    @action(detail=True, methods=['get'])
    def colaboradores(self, request, pk=None):
        """Obtiene los colaboradores de un proyecto"""
        proyecto = self.get_object()
        colaboraciones = proyecto.colaboraciones.filter(estado='ACEPTADA')
        serializer = ColaboracionSerializer(colaboraciones, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def solicitudes(self, request, pk=None):
        """Obtiene las solicitudes pendientes de un proyecto (solo creador)"""
        proyecto = self.get_object()
        
        if proyecto.creador != request.user:
            return Response(
                {'error': 'No tienes permiso para ver las solicitudes.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        solicitudes = proyecto.colaboraciones.filter(estado='PENDIENTE')
        serializer = ColaboracionSerializer(solicitudes, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def solicitar_colaboracion(self, request, pk=None):
        """Permite a un usuario solicitar colaborar en el proyecto"""
        proyecto = self.get_object()
        
        serializer = ColaboracionCreateSerializer(
            data={'proyecto': proyecto.id, 'mensaje': request.data.get('mensaje', '')},
            context={'request': request}
        )
        
        if serializer.is_valid():
            serializer.save(usuario=request.user)
            return Response(
                ColaboracionSerializer(serializer.instance).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def mis_proyectos(self, request):
        """Obtiene los proyectos creados por el usuario autenticado"""
        proyectos = self.queryset.filter(creador=request.user)
        page = self.paginate_queryset(proyectos)
        
        if page is not None:
            serializer = ProyectoListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = ProyectoListSerializer(proyectos, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def colaborando(self, request):
        """Obtiene los proyectos en los que el usuario está colaborando"""
        colaboraciones = Colaboracion.objects.filter(
            usuario=request.user,
            estado='ACEPTADA'
        )
        proyectos = [col.proyecto for col in colaboraciones]
        serializer = ProyectoListSerializer(proyectos, many=True)
        return Response(serializer.data)


class ColaboracionViewSet(viewsets.ModelViewSet):
    """ViewSet para gestionar colaboraciones"""
    queryset = Colaboracion.objects.all()
    serializer_class = ColaboracionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['estado', 'proyecto', 'usuario']
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        """Retorna el serializer apropiado según la acción"""
        if self.action == 'create':
            return ColaboracionCreateSerializer
        return ColaboracionSerializer
    
    def perform_create(self, serializer):
        """Asigna el usuario a la colaboración"""
        serializer.save(usuario=self.request.user)
    
    @action(detail=True, methods=['post'])
    def aceptar(self, request, pk=None):
        """Permite al creador del proyecto aceptar una solicitud"""
        colaboracion = self.get_object()
        
        if colaboracion.proyecto.creador != request.user:
            return Response(
                {'error': 'No tienes permiso para aceptar esta solicitud.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if not colaboracion.proyecto.tiene_vacantes:
            return Response(
                {'error': 'El proyecto ya no tiene vacantes disponibles.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        colaboracion.estado = 'ACEPTADA'
        colaboracion.respuesta = request.data.get('respuesta', '')
        colaboracion.save()
        
        serializer = ColaboracionSerializer(colaboracion)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def rechazar(self, request, pk=None):
        """Permite al creador del proyecto rechazar una solicitud"""
        colaboracion = self.get_object()
        
        if colaboracion.proyecto.creador != request.user:
            return Response(
                {'error': 'No tienes permiso para rechazar esta solicitud.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        colaboracion.estado = 'RECHAZADA'
        colaboracion.respuesta = request.data.get('respuesta', '')
        colaboracion.save()
        
        serializer = ColaboracionSerializer(colaboracion)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def mis_solicitudes(self, request):
        """Obtiene las solicitudes enviadas por el usuario"""
        solicitudes = self.queryset.filter(usuario=request.user)
        page = self.paginate_queryset(solicitudes)
        
        if page is not None:
            serializer = ColaboracionSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = ColaboracionSerializer(solicitudes, many=True)
        return Response(serializer.data)


class ComentarioViewSet(viewsets.ModelViewSet):
    """ViewSet para gestionar comentarios"""
    queryset = Comentario.objects.all()
    serializer_class = ComentarioSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['proyecto', 'usuario']
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    
    def perform_create(self, serializer):
        """Asigna el usuario al comentario"""
        serializer.save(usuario=self.request.user)
    
    def perform_update(self, serializer):
        """Solo permite actualizar si es el autor del comentario"""
        if serializer.instance.usuario != self.request.user:
            return Response(
                {'error': 'No tienes permiso para editar este comentario.'},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer.save()
    
    def perform_destroy(self, instance):
        """Solo permite eliminar si es el autor del comentario o el creador del proyecto"""
        if instance.usuario != self.request.user and instance.proyecto.creador != self.request.user:
            return Response(
                {'error': 'No tienes permiso para eliminar este comentario.'},
                status=status.HTTP_403_FORBIDDEN
            )
        instance.delete()
