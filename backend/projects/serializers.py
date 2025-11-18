from rest_framework import serializers
from .models import Proyecto, Colaboracion, Comentario
from users.serializers import UsuarioSerializer, HabilidadSerializer, DisciplinaSerializer


class ProyectoListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listar proyectos"""
    creador = UsuarioSerializer(read_only=True)
    disciplinas_requeridas = DisciplinaSerializer(many=True, read_only=True)
    colaboradores_actuales = serializers.IntegerField(read_only=True)
    tiene_vacantes = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Proyecto
        fields = [
            'id', 'titulo', 'descripcion', 'imagen', 'creador',
            'disciplinas_requeridas', 'estado', 'colaboradores_necesarios',
            'colaboradores_actuales', 'tiene_vacantes', 'created_at'
        ]


class ProyectoSerializer(serializers.ModelSerializer):
    """Serializer completo para proyectos"""
    creador = UsuarioSerializer(read_only=True)
    disciplinas_requeridas = DisciplinaSerializer(many=True, read_only=True)
    habilidades_requeridas = HabilidadSerializer(many=True, read_only=True)
    # Usar querysets válidos para evitar AssertionError en carga de clase
    from users.models import Disciplina as _DisciplinaModel, Habilidad as _HabilidadModel
    disciplinas_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=_DisciplinaModel.objects.all(),
        write_only=True,
        required=False,
        source='disciplinas_requeridas'
    )
    habilidades_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=_HabilidadModel.objects.all(),
        write_only=True,
        required=False,
        source='habilidades_requeridas'
    )
    colaboradores_actuales = serializers.IntegerField(read_only=True)
    tiene_vacantes = serializers.BooleanField(read_only=True)
    total_comentarios = serializers.SerializerMethodField()
    
    class Meta:
        model = Proyecto
        fields = [
            'id', 'titulo', 'descripcion', 'objetivo', 'imagen',
            'creador', 'disciplinas_requeridas', 'disciplinas_ids',
            'habilidades_requeridas', 'habilidades_ids', 'estado',
            'colaboradores_necesarios', 'colaboradores_actuales',
            'tiene_vacantes', 'fecha_inicio', 'fecha_fin',
            'total_comentarios', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'creador', 'created_at', 'updated_at']
    
    def get_total_comentarios(self, obj):
        return obj.comentarios.count()


class ColaboracionSerializer(serializers.ModelSerializer):
    """Serializer para colaboraciones"""
    usuario = UsuarioSerializer(read_only=True)
    proyecto = ProyectoListSerializer(read_only=True)
    
    class Meta:
        model = Colaboracion
        fields = [
            'id', 'proyecto', 'usuario', 'estado', 'rol',
            'mensaje', 'respuesta', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ColaboracionCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear solicitudes de colaboración"""
    
    class Meta:
        model = Colaboracion
        fields = ['proyecto', 'mensaje']
    
    def validate_proyecto(self, value):
        """Valida que el proyecto tenga vacantes disponibles"""
        if not value.tiene_vacantes:
            raise serializers.ValidationError("Este proyecto ya no tiene vacantes disponibles.")
        
        # Valida que el usuario no sea el creador del proyecto
        usuario = self.context['request'].user
        if value.creador == usuario:
            raise serializers.ValidationError("No puedes solicitar colaborar en tu propio proyecto.")
        
        # Valida que no exista ya una solicitud
        if Colaboracion.objects.filter(proyecto=value, usuario=usuario).exists():
            raise serializers.ValidationError("Ya has enviado una solicitud para este proyecto.")
        
        return value


class ComentarioSerializer(serializers.ModelSerializer):
    """Serializer para comentarios"""
    usuario = UsuarioSerializer(read_only=True)
    
    class Meta:
        model = Comentario
        fields = ['id', 'proyecto', 'usuario', 'contenido', 'created_at', 'updated_at']
        read_only_fields = ['id', 'usuario', 'created_at', 'updated_at']
