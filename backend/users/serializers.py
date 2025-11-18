from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Habilidad, Disciplina

Usuario = get_user_model()


class HabilidadSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Habilidad"""
    
    class Meta:
        model = Habilidad
        fields = ['id', 'nombre', 'descripcion']


class DisciplinaSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Disciplina"""
    
    class Meta:
        model = Disciplina
        fields = ['id', 'nombre', 'descripcion']


class UsuarioSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Usuario"""
    habilidades = HabilidadSerializer(many=True, read_only=True)
    disciplina = DisciplinaSerializer(read_only=True)
    habilidades_ids = serializers.PrimaryKeyRelatedField(
        many=True, 
        queryset=Habilidad.objects.all(), 
        write_only=True, 
        required=False,
        source='habilidades'
    )
    disciplina_id = serializers.PrimaryKeyRelatedField(
        queryset=Disciplina.objects.all(), 
        write_only=True, 
        required=False,
        source='disciplina'
    )
    
    class Meta:
        model = Usuario
        fields = [
            'id', 'email', 'nombre', 'apellido', 'telefono', 'avatar', 'bio',
            'carrera', 'disciplina', 'disciplina_id', 'semestre', 
            'habilidades', 'habilidades_ids', 'date_joined', 'is_active'
        ]
        read_only_fields = ['id', 'date_joined']


class UsuarioCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear un nuevo usuario"""
    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True, min_length=8, label='Confirmar Contraseña')
    
    class Meta:
        model = Usuario
        fields = [
            'email', 'password', 'password2', 'nombre', 'apellido', 
            'telefono', 'carrera', 'disciplina', 'semestre', 'bio'
        ]
    
    def validate(self, attrs):
        """Valida que las contraseñas coincidan"""
        if attrs.get('password') != attrs.get('password2'):
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden."})
        return attrs
    
    def create(self, validated_data):
        """Crea un nuevo usuario con contraseña encriptada"""
        validated_data.pop('password2')
        password = validated_data.pop('password')
        user = Usuario.objects.create_user(**validated_data, password=password)
        return user


class UsuarioProfileSerializer(serializers.ModelSerializer):
    """Serializer completo para el perfil del usuario"""
    habilidades = HabilidadSerializer(many=True, read_only=True)
    disciplina = DisciplinaSerializer(read_only=True)
    total_proyectos = serializers.SerializerMethodField()
    proyectos_activos = serializers.SerializerMethodField()
    
    class Meta:
        model = Usuario
        fields = [
            'id', 'email', 'nombre', 'apellido', 'telefono', 'avatar', 'bio',
            'carrera', 'disciplina', 'semestre', 'habilidades', 
            'total_proyectos', 'proyectos_activos', 'date_joined'
        ]
        read_only_fields = ['id', 'email', 'date_joined']
    
    def get_total_proyectos(self, obj):
        """Retorna el total de proyectos del usuario"""
        return obj.proyectos_creados.count()
    
    def get_proyectos_activos(self, obj):
        """Retorna el total de proyectos activos del usuario"""
        return obj.proyectos_creados.filter(estado='ACTIVO').count()


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer para cambiar la contraseña"""
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True, min_length=8)
    new_password2 = serializers.CharField(required=True, write_only=True, min_length=8)
    
    def validate(self, attrs):
        """Valida que las contraseñas nuevas coincidan"""
        if attrs.get('new_password') != attrs.get('new_password2'):
            raise serializers.ValidationError({"new_password": "Las contraseñas no coinciden."})
        return attrs
