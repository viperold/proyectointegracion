from django.db import models
from django.conf import settings
from users.models import Disciplina, Habilidad


class Proyecto(models.Model):
    """Modelo para proyectos estudiantiles"""
    
    ESTADO_CHOICES = [
        ('BORRADOR', 'Borrador'),
        ('ACTIVO', 'Activo'),
        ('EN_PROGRESO', 'En Progreso'),
        ('COMPLETADO', 'Completado'),
        ('CANCELADO', 'Cancelado'),
    ]
    
    # Información básica
    titulo = models.CharField(max_length=200, verbose_name='Título')
    descripcion = models.TextField(verbose_name='Descripción')
    objetivo = models.TextField(verbose_name='Objetivo')
    imagen = models.ImageField(upload_to='proyectos/', blank=True, null=True, verbose_name='Imagen')
    
    # Relaciones
    creador = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='proyectos_creados',
        verbose_name='Creador'
    )
    disciplinas_requeridas = models.ManyToManyField(
        Disciplina,
        related_name='proyectos',
        blank=True,
        verbose_name='Disciplinas Requeridas'
    )
    habilidades_requeridas = models.ManyToManyField(
        Habilidad,
        related_name='proyectos',
        blank=True,
        verbose_name='Habilidades Requeridas'
    )
    
    # Estado y colaboradores
    estado = models.CharField(
        max_length=20, 
        choices=ESTADO_CHOICES, 
        default='BORRADOR',
        verbose_name='Estado'
    )
    colaboradores_necesarios = models.PositiveIntegerField(
        default=1,
        verbose_name='Colaboradores Necesarios'
    )
    
    # Fechas
    fecha_inicio = models.DateField(blank=True, null=True, verbose_name='Fecha de Inicio')
    fecha_fin = models.DateField(blank=True, null=True, verbose_name='Fecha de Fin')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de Creación')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Última Actualización')
    
    class Meta:
        verbose_name = 'Proyecto'
        verbose_name_plural = 'Proyectos'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.titulo
    
    @property
    def colaboradores_actuales(self):
        """Retorna el número de colaboradores aceptados"""
        return self.colaboraciones.filter(estado='ACEPTADA').count()
    
    @property
    def tiene_vacantes(self):
        """Verifica si el proyecto aún tiene vacantes"""
        return self.colaboradores_actuales < self.colaboradores_necesarios


class Colaboracion(models.Model):
    """Modelo para las solicitudes y colaboraciones en proyectos"""
    
    ESTADO_CHOICES = [
        ('PENDIENTE', 'Pendiente'),
        ('ACEPTADA', 'Aceptada'),
        ('RECHAZADA', 'Rechazada'),
        ('CANCELADA', 'Cancelada'),
    ]
    
    ROL_CHOICES = [
        ('COLABORADOR', 'Colaborador'),
        ('LÍDER', 'Líder'),
    ]
    
    # Relaciones
    proyecto = models.ForeignKey(
        Proyecto,
        on_delete=models.CASCADE,
        related_name='colaboraciones',
        verbose_name='Proyecto'
    )
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='colaboraciones',
        verbose_name='Usuario'
    )
    
    # Información de la colaboración
    estado = models.CharField(
        max_length=20,
        choices=ESTADO_CHOICES,
        default='PENDIENTE',
        verbose_name='Estado'
    )
    rol = models.CharField(
        max_length=20,
        choices=ROL_CHOICES,
        default='COLABORADOR',
        verbose_name='Rol'
    )
    mensaje = models.TextField(blank=True, verbose_name='Mensaje de Solicitud')
    respuesta = models.TextField(blank=True, verbose_name='Respuesta')
    
    # Fechas
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de Solicitud')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Última Actualización')
    
    class Meta:
        verbose_name = 'Colaboración'
        verbose_name_plural = 'Colaboraciones'
        ordering = ['-created_at']
        unique_together = ['proyecto', 'usuario']
    
    def __str__(self):
        return f"{self.usuario.get_full_name()} - {self.proyecto.titulo}"


class Comentario(models.Model):
    """Modelo para comentarios en proyectos"""
    
    # Relaciones
    proyecto = models.ForeignKey(
        Proyecto,
        on_delete=models.CASCADE,
        related_name='comentarios',
        verbose_name='Proyecto'
    )
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='comentarios',
        verbose_name='Usuario'
    )
    
    # Contenido
    contenido = models.TextField(verbose_name='Contenido')
    
    # Fechas
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de Creación')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Última Actualización')
    
    class Meta:
        verbose_name = 'Comentario'
        verbose_name_plural = 'Comentarios'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Comentario de {self.usuario.get_full_name()} en {self.proyecto.titulo}"
