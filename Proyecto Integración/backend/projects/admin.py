from django.contrib import admin
from .models import Proyecto, Colaboracion, Comentario


@admin.register(Proyecto)
class ProyectoAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'creador', 'estado', 'colaboradores_necesarios', 'colaboradores_actuales', 'created_at')
    list_filter = ('estado', 'created_at', 'disciplinas_requeridas')
    search_fields = ('titulo', 'descripcion', 'creador__email', 'creador__nombre')
    filter_horizontal = ('disciplinas_requeridas', 'habilidades_requeridas')
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('titulo', 'descripcion', 'objetivo', 'imagen')
        }),
        ('Creador y Estado', {
            'fields': ('creador', 'estado', 'colaboradores_necesarios')
        }),
        ('Requisitos', {
            'fields': ('disciplinas_requeridas', 'habilidades_requeridas')
        }),
        ('Fechas', {
            'fields': ('fecha_inicio', 'fecha_fin')
        }),
    )
    
    def colaboradores_actuales(self, obj):
        return obj.colaboradores_actuales
    colaboradores_actuales.short_description = 'Colaboradores Actuales'


@admin.register(Colaboracion)
class ColaboracionAdmin(admin.ModelAdmin):
    list_display = ('proyecto', 'usuario', 'estado', 'rol', 'created_at')
    list_filter = ('estado', 'rol', 'created_at')
    search_fields = ('proyecto__titulo', 'usuario__email', 'usuario__nombre')
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Información', {
            'fields': ('proyecto', 'usuario', 'estado', 'rol')
        }),
        ('Mensajes', {
            'fields': ('mensaje', 'respuesta')
        }),
    )


@admin.register(Comentario)
class ComentarioAdmin(admin.ModelAdmin):
    list_display = ('proyecto', 'usuario', 'contenido_corto', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('proyecto__titulo', 'usuario__email', 'contenido')
    date_hierarchy = 'created_at'
    
    def contenido_corto(self, obj):
        return obj.contenido[:50] + '...' if len(obj.contenido) > 50 else obj.contenido
    contenido_corto.short_description = 'Contenido'
