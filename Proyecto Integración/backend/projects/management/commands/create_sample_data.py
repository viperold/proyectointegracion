"""
Comando para crear datos de ejemplo para la aplicación.
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from users.models import Disciplina, Habilidad
from projects.models import Proyecto, Colaboracion, Comentario
from datetime import datetime, timedelta

Usuario = get_user_model()


class Command(BaseCommand):
    help = 'Crea datos de ejemplo para la aplicación'

    def handle(self, *args, **options):
        self.stdout.write('Creando datos de ejemplo...')

        # Crear disciplinas
        self.stdout.write('Creando disciplinas...')
        disciplinas_data = [
            {'nombre': 'Desarrollo de Software', 'descripcion': 'Programación y desarrollo de aplicaciones'},
            {'nombre': 'Diseño Gráfico', 'descripcion': 'Diseño visual y multimedia'},
            {'nombre': 'Redes y Telecomunicaciones', 'descripcion': 'Infraestructura de redes'},
            {'nombre': 'Base de Datos', 'descripcion': 'Gestión y diseño de bases de datos'},
            {'nombre': 'Ciberseguridad', 'descripcion': 'Seguridad informática'},
            {'nombre': 'Marketing Digital', 'descripcion': 'Estrategias de marketing online'},
        ]
        
        disciplinas = {}
        for data in disciplinas_data:
            disciplina, created = Disciplina.objects.get_or_create(
                nombre=data['nombre'],
                defaults={'descripcion': data['descripcion']}
            )
            disciplinas[disciplina.nombre] = disciplina
            if created:
                self.stdout.write(f'  ✓ Creada disciplina: {disciplina.nombre}')

        # Crear habilidades
        self.stdout.write('\nCreando habilidades...')
        habilidades_data = [
            {'nombre': 'Python', 'descripcion': 'Lenguaje de programación'},
            {'nombre': 'JavaScript', 'descripcion': 'Lenguaje de programación web'},
            {'nombre': 'React', 'descripcion': 'Framework de JavaScript'},
            {'nombre': 'Django', 'descripcion': 'Framework web de Python'},
            {'nombre': 'Angular', 'descripcion': 'Framework de TypeScript'},
            {'nombre': 'Node.js', 'descripcion': 'Runtime de JavaScript'},
            {'nombre': 'PostgreSQL', 'descripcion': 'Sistema de base de datos'},
            {'nombre': 'MySQL', 'descripcion': 'Sistema de base de datos'},
            {'nombre': 'MongoDB', 'descripcion': 'Base de datos NoSQL'},
            {'nombre': 'Git', 'descripcion': 'Control de versiones'},
            {'nombre': 'Docker', 'descripcion': 'Contenedorización'},
            {'nombre': 'AWS', 'descripcion': 'Cloud computing'},
            {'nombre': 'UI/UX Design', 'descripcion': 'Diseño de interfaces'},
            {'nombre': 'Photoshop', 'descripcion': 'Edición de imágenes'},
            {'nombre': 'Illustrator', 'descripcion': 'Diseño vectorial'},
            {'nombre': 'Figma', 'descripcion': 'Diseño de interfaces'},
        ]
        
        habilidades = {}
        for data in habilidades_data:
            habilidad, created = Habilidad.objects.get_or_create(
                nombre=data['nombre'],
                defaults={'descripcion': data['descripcion']}
            )
            habilidades[habilidad.nombre] = habilidad
            if created:
                self.stdout.write(f'  ✓ Creada habilidad: {habilidad.nombre}')

        # Crear usuarios de ejemplo
        self.stdout.write('\nCreando usuarios de ejemplo...')
        usuarios_data = [
            {
                'email': 'maria.gonzalez@inacapmail.cl',
                'nombre': 'María',
                'apellido': 'González',
                'password': 'password123',
                'carrera': 'Ingeniería en Informática',
                'semestre': 5,
                'disciplina': disciplinas['Desarrollo de Software'],
                'bio': 'Apasionada por el desarrollo web y las nuevas tecnologías.',
                'habilidades': ['Python', 'Django', 'JavaScript', 'Git']
            },
            {
                'email': 'juan.perez@inacapmail.cl',
                'nombre': 'Juan',
                'apellido': 'Pérez',
                'password': 'password123',
                'carrera': 'Analista Programador',
                'semestre': 4,
                'disciplina': disciplinas['Desarrollo de Software'],
                'bio': 'Desarrollador full-stack en formación.',
                'habilidades': ['JavaScript', 'React', 'Node.js', 'MongoDB']
            },
            {
                'email': 'sofia.martinez@inacapmail.cl',
                'nombre': 'Sofía',
                'apellido': 'Martínez',
                'password': 'password123',
                'carrera': 'Diseño Gráfico Digital',
                'semestre': 3,
                'disciplina': disciplinas['Diseño Gráfico'],
                'bio': 'Diseñadora creativa con interés en UX/UI.',
                'habilidades': ['UI/UX Design', 'Figma', 'Photoshop', 'Illustrator']
            },
            {
                'email': 'carlos.rodriguez@inacapmail.cl',
                'nombre': 'Carlos',
                'apellido': 'Rodríguez',
                'password': 'password123',
                'carrera': 'Conectividad y Redes',
                'semestre': 6,
                'disciplina': disciplinas['Redes y Telecomunicaciones'],
                'bio': 'Especialista en redes y seguridad informática.',
                'habilidades': ['Docker', 'AWS', 'Git']
            },
            {
                'email': 'ana.lopez@inacapmail.cl',
                'nombre': 'Ana',
                'apellido': 'López',
                'password': 'password123',
                'carrera': 'Ingeniería en Informática',
                'semestre': 7,
                'disciplina': disciplinas['Base de Datos'],
                'bio': 'Experta en bases de datos y análisis de datos.',
                'habilidades': ['PostgreSQL', 'MySQL', 'Python', 'MongoDB']
            },
        ]

        usuarios = {}
        for data in usuarios_data:
            usuario, created = Usuario.objects.get_or_create(
                email=data['email'],
                defaults={
                    'nombre': data['nombre'],
                    'apellido': data['apellido'],
                    'carrera': data['carrera'],
                    'semestre': data['semestre'],
                    'disciplina': data['disciplina'],
                    'bio': data['bio'],
                }
            )
            if created:
                usuario.set_password(data['password'])
                usuario.save()
                
                # Agregar habilidades
                for hab_nombre in data['habilidades']:
                    if hab_nombre in habilidades:
                        usuario.habilidades.add(habilidades[hab_nombre])
                
                usuarios[data['email']] = usuario
                self.stdout.write(f'  ✓ Creado usuario: {usuario.nombre} {usuario.apellido}')
            else:
                usuarios[data['email']] = usuario
                self.stdout.write(f'  - Usuario ya existe: {usuario.nombre} {usuario.apellido}')

        # Crear proyectos de ejemplo
        self.stdout.write('\nCreando proyectos de ejemplo...')
        proyectos_data = [
            {
                'titulo': 'Sistema de Gestión de Biblioteca Digital',
                'descripcion': 'Plataforma web para la gestión de una biblioteca digital universitaria. Permitirá a los estudiantes buscar, reservar y descargar material bibliográfico de forma eficiente.',
                'objetivo': 'Desarrollar un sistema completo de gestión de biblioteca que mejore la experiencia de los estudiantes al buscar y acceder a recursos académicos.',
                'creador': 'maria.gonzalez@inacapmail.cl',
                'estado': 'ACTIVO',
                'colaboradores_necesarios': 5,
                'disciplinas': ['Desarrollo de Software', 'Diseño Gráfico', 'Base de Datos'],
                'habilidades': ['Python', 'Django', 'PostgreSQL', 'UI/UX Design', 'Git'],
                'fecha_inicio': datetime.now().date(),
                'fecha_fin': (datetime.now() + timedelta(days=120)).date(),
            },
            {
                'titulo': 'App Móvil de Carpooling Estudiantil',
                'descripcion': 'Aplicación móvil que conecta estudiantes que comparten rutas similares para compartir viajes y reducir costos de transporte.',
                'objetivo': 'Crear una solución de movilidad colaborativa que ayude a los estudiantes a ahorrar dinero y reducir la huella de carbono.',
                'creador': 'juan.perez@inacapmail.cl',
                'estado': 'ACTIVO',
                'colaboradores_necesarios': 4,
                'disciplinas': ['Desarrollo de Software', 'Diseño Gráfico'],
                'habilidades': ['React', 'Node.js', 'MongoDB', 'Figma', 'Git'],
                'fecha_inicio': datetime.now().date(),
                'fecha_fin': (datetime.now() + timedelta(days=90)).date(),
            },
            {
                'titulo': 'Plataforma de E-learning para INACAP',
                'descripcion': 'Sistema de aprendizaje en línea con funciones de videoconferencia, entrega de tareas, foros de discusión y evaluaciones automáticas.',
                'objetivo': 'Complementar la educación presencial con una plataforma robusta de e-learning que mejore la experiencia educativa.',
                'creador': 'ana.lopez@inacapmail.cl',
                'estado': 'EN_PROGRESO',
                'colaboradores_necesarios': 6,
                'disciplinas': ['Desarrollo de Software', 'Base de Datos', 'Diseño Gráfico', 'Redes y Telecomunicaciones'],
                'habilidades': ['Python', 'Django', 'Angular', 'PostgreSQL', 'Docker', 'AWS'],
                'fecha_inicio': (datetime.now() - timedelta(days=30)).date(),
                'fecha_fin': (datetime.now() + timedelta(days=150)).date(),
            },
            {
                'titulo': 'Portal de Empleo para Egresados',
                'descripcion': 'Plataforma que conecta a egresados de INACAP con oportunidades laborales en empresas asociadas.',
                'objetivo': 'Facilitar la inserción laboral de los egresados mediante una plataforma especializada.',
                'creador': 'carlos.rodriguez@inacapmail.cl',
                'estado': 'ACTIVO',
                'colaboradores_necesarios': 3,
                'disciplinas': ['Desarrollo de Software', 'Marketing Digital'],
                'habilidades': ['JavaScript', 'React', 'Node.js', 'MySQL', 'Git'],
                'fecha_inicio': datetime.now().date(),
                'fecha_fin': (datetime.now() + timedelta(days=60)).date(),
            },
            {
                'titulo': 'Sistema de Control de Inventario IoT',
                'descripcion': 'Sistema inteligente para el control de inventario usando sensores IoT y análisis de datos en tiempo real.',
                'objetivo': 'Optimizar la gestión de inventario mediante tecnología IoT y machine learning.',
                'creador': 'maria.gonzalez@inacapmail.cl',
                'estado': 'BORRADOR',
                'colaboradores_necesarios': 4,
                'disciplinas': ['Desarrollo de Software', 'Redes y Telecomunicaciones', 'Ciberseguridad'],
                'habilidades': ['Python', 'Node.js', 'MongoDB', 'Docker'],
                'fecha_inicio': (datetime.now() + timedelta(days=15)).date(),
                'fecha_fin': (datetime.now() + timedelta(days=105)).date(),
            },
        ]

        proyectos = []
        for data in proyectos_data:
            creador = usuarios.get(data['creador'])
            if not creador:
                continue

            proyecto, created = Proyecto.objects.get_or_create(
                titulo=data['titulo'],
                creador=creador,
                defaults={
                    'descripcion': data['descripcion'],
                    'objetivo': data['objetivo'],
                    'estado': data['estado'],
                    'colaboradores_necesarios': data['colaboradores_necesarios'],
                    'fecha_inicio': data['fecha_inicio'],
                    'fecha_fin': data['fecha_fin'],
                }
            )

            if created:
                # Agregar disciplinas
                for disc_nombre in data['disciplinas']:
                    if disc_nombre in disciplinas:
                        proyecto.disciplinas_requeridas.add(disciplinas[disc_nombre])
                
                # Agregar habilidades
                for hab_nombre in data['habilidades']:
                    if hab_nombre in habilidades:
                        proyecto.habilidades_requeridas.add(habilidades[hab_nombre])

                proyectos.append(proyecto)
                self.stdout.write(f'  ✓ Creado proyecto: {proyecto.titulo}')
            else:
                proyectos.append(proyecto)
                self.stdout.write(f'  - Proyecto ya existe: {proyecto.titulo}')

        # Crear colaboraciones
        self.stdout.write('\nCreando colaboraciones...')
        colaboraciones_data = [
            # Proyecto 1: Biblioteca Digital
            {
                'proyecto': 'Sistema de Gestión de Biblioteca Digital',
                'usuario': 'juan.perez@inacapmail.cl',
                'estado': 'ACEPTADA',
                'rol': 'COLABORADOR',
                'mensaje': 'Me gustaría colaborar en el frontend de este proyecto.',
            },
            {
                'proyecto': 'Sistema de Gestión de Biblioteca Digital',
                'usuario': 'sofia.martinez@inacapmail.cl',
                'estado': 'ACEPTADA',
                'rol': 'COLABORADOR',
                'mensaje': 'Puedo ayudar con el diseño de la interfaz.',
            },
            {
                'proyecto': 'Sistema de Gestión de Biblioteca Digital',
                'usuario': 'ana.lopez@inacapmail.cl',
                'estado': 'PENDIENTE',
                'rol': 'COLABORADOR',
                'mensaje': 'Tengo experiencia en bases de datos y me gustaría colaborar.',
            },
            # Proyecto 2: Carpooling
            {
                'proyecto': 'App Móvil de Carpooling Estudiantil',
                'usuario': 'carlos.rodriguez@inacapmail.cl',
                'estado': 'ACEPTADA',
                'rol': 'COLABORADOR',
                'mensaje': 'Puedo ayudar con la infraestructura backend.',
            },
            {
                'proyecto': 'App Móvil de Carpooling Estudiantil',
                'usuario': 'maria.gonzalez@inacapmail.cl',
                'estado': 'PENDIENTE',
                'rol': 'COLABORADOR',
                'mensaje': 'Me interesa colaborar en el desarrollo del backend.',
            },
            # Proyecto 3: E-learning
            {
                'proyecto': 'Plataforma de E-learning para INACAP',
                'usuario': 'juan.perez@inacapmail.cl',
                'estado': 'ACEPTADA',
                'rol': 'COLABORADOR',
                'mensaje': 'Tengo experiencia con Angular y me gustaría ayudar.',
            },
            {
                'proyecto': 'Plataforma de E-learning para INACAP',
                'usuario': 'sofia.martinez@inacapmail.cl',
                'estado': 'ACEPTADA',
                'rol': 'COLABORADOR',
                'mensaje': 'Puedo diseñar la interfaz de usuario.',
            },
            {
                'proyecto': 'Plataforma de E-learning para INACAP',
                'usuario': 'carlos.rodriguez@inacapmail.cl',
                'estado': 'ACEPTADA',
                'rol': 'COLABORADOR',
                'mensaje': 'Me especializo en infraestructura cloud.',
            },
        ]

        for data in colaboraciones_data:
            proyecto = next((p for p in proyectos if p.titulo == data['proyecto']), None)
            usuario = usuarios.get(data['usuario'])
            
            if proyecto and usuario:
                colaboracion, created = Colaboracion.objects.get_or_create(
                    proyecto=proyecto,
                    usuario=usuario,
                    defaults={
                        'estado': data['estado'],
                        'rol': data['rol'],
                        'mensaje': data['mensaje'],
                    }
                )
                if created:
                    self.stdout.write(f'  ✓ Creada colaboración: {usuario.nombre} -> {proyecto.titulo[:30]}...')

        # Crear comentarios
        self.stdout.write('\nCreando comentarios...')
        comentarios_data = [
            {
                'proyecto': 'Sistema de Gestión de Biblioteca Digital',
                'usuario': 'juan.perez@inacapmail.cl',
                'contenido': '¡Excelente proyecto! Me encantaría ver cómo evoluciona.',
            },
            {
                'proyecto': 'Sistema de Gestión de Biblioteca Digital',
                'usuario': 'carlos.rodriguez@inacapmail.cl',
                'contenido': '¿Tienen pensado integrar un sistema de recomendaciones basado en ML?',
            },
            {
                'proyecto': 'Sistema de Gestión de Biblioteca Digital',
                'usuario': 'sofia.martinez@inacapmail.cl',
                'contenido': 'Puedo ayudar con los mockups de la interfaz si necesitan.',
            },
            {
                'proyecto': 'App Móvil de Carpooling Estudiantil',
                'usuario': 'maria.gonzalez@inacapmail.cl',
                'contenido': 'Esta idea es genial. ¿Ya tienen definida la arquitectura del backend?',
            },
            {
                'proyecto': 'App Móvil de Carpooling Estudiantil',
                'usuario': 'ana.lopez@inacapmail.cl',
                'contenido': 'Sugiero usar MongoDB para almacenar las rutas y ubicaciones.',
            },
            {
                'proyecto': 'Plataforma de E-learning para INACAP',
                'usuario': 'maria.gonzalez@inacapmail.cl',
                'contenido': 'Gran iniciativa. ¿Consideraron integrar Zoom o Teams para las videoconferencias?',
            },
            {
                'proyecto': 'Portal de Empleo para Egresados',
                'usuario': 'sofia.martinez@inacapmail.cl',
                'contenido': 'Me parece muy útil para los egresados. ¡Éxito con el proyecto!',
            },
        ]

        for data in comentarios_data:
            proyecto = next((p for p in proyectos if p.titulo == data['proyecto']), None)
            usuario = usuarios.get(data['usuario'])
            
            if proyecto and usuario:
                comentario, created = Comentario.objects.get_or_create(
                    proyecto=proyecto,
                    usuario=usuario,
                    contenido=data['contenido']
                )
                if created:
                    self.stdout.write(f'  ✓ Creado comentario en: {proyecto.titulo[:30]}...')

        self.stdout.write(self.style.SUCCESS('\n✅ Datos de ejemplo creados exitosamente!'))
        self.stdout.write('\nCredenciales de prueba:')
        self.stdout.write('  Email: maria.gonzalez@inacapmail.cl')
        self.stdout.write('  Password: password123')
        self.stdout.write('\n  (Todos los usuarios usan la misma contraseña: password123)')
