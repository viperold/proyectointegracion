from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone


class Disciplina(models.Model):
    """Disciplinas o áreas de estudio (Informática, Diseño, Administración, etc.)"""
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True)
    
    class Meta:
        verbose_name = 'Disciplina'
        verbose_name_plural = 'Disciplinas'
        ordering = ['nombre']
    
    def __str__(self):
        return self.nombre


class Habilidad(models.Model):
    """Habilidades técnicas y blandas de los usuarios"""
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True)
    
    class Meta:
        verbose_name = 'Habilidad'
        verbose_name_plural = 'Habilidades'
        ordering = ['nombre']
    
    def __str__(self):
        return self.nombre


class UsuarioManager(BaseUserManager):
    """Manager personalizado para el modelo Usuario"""
    
    def create_user(self, email, nombre, apellido, password=None, **extra_fields):
        """Crea y guarda un usuario con el email y contraseña dados"""
        if not email:
            raise ValueError('El usuario debe tener un email')
        
        email = self.normalize_email(email)
        user = self.model(email=email, nombre=nombre, apellido=apellido, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, nombre, apellido, password=None, **extra_fields):
        """Crea y guarda un superusuario con el email y contraseña dados"""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser debe tener is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser debe tener is_superuser=True.')
        
        return self.create_user(email, nombre, apellido, password, **extra_fields)


class Usuario(AbstractBaseUser, PermissionsMixin):
    """Modelo de usuario personalizado para estudiantes de INACAP"""
    
    # Información de autenticación
    email = models.EmailField(unique=True, verbose_name='Correo Electrónico')
    
    # Información personal
    nombre = models.CharField(max_length=100, verbose_name='Nombre')
    apellido = models.CharField(max_length=100, verbose_name='Apellido')
    telefono = models.CharField(max_length=15, blank=True, verbose_name='Teléfono')
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True, verbose_name='Avatar')
    bio = models.TextField(blank=True, verbose_name='Biografía')
    
    # Información académica
    carrera = models.CharField(max_length=200, verbose_name='Carrera')
    disciplina = models.ForeignKey(
        Disciplina, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='estudiantes',
        verbose_name='Disciplina'
    )
    semestre = models.PositiveIntegerField(default=1, verbose_name='Semestre')
    habilidades = models.ManyToManyField(
        Habilidad, 
        blank=True,
        related_name='usuarios',
        verbose_name='Habilidades'
    )
    
    # Permisos y estado
    is_active = models.BooleanField(default=True, verbose_name='Activo')
    is_staff = models.BooleanField(default=False, verbose_name='Staff')
    
    # Fechas
    date_joined = models.DateTimeField(default=timezone.now, verbose_name='Fecha de Registro')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Última Actualización')
    
    objects = UsuarioManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nombre', 'apellido']
    
    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        ordering = ['-date_joined']
    
    def __str__(self):
        return f"{self.nombre} {self.apellido} ({self.email})"
    
    def get_full_name(self):
        """Retorna el nombre completo del usuario"""
        return f"{self.nombre} {self.apellido}"
    
    def get_short_name(self):
        """Retorna el nombre del usuario"""
        return self.nombre
