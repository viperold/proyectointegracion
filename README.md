# INACAP Valdivia - Red de Colaboración y Monitoreo de Proyectos Estudiantiles

![INACAP Logo](https://via.placeholder.com/150x50?text=INACAP+Valdivia)

## 📋 Descripción del Proyecto

Plataforma web diseñada para facilitar la colaboración y el monitoreo de proyectos creados por estudiantes de INACAP Valdivia. Esta aplicación permite a los estudiantes:

- 🚀 **Crear y publicar proyectos** de innovación y desarrollo
- 🤝 **Buscar colaboradores** de diferentes disciplinas
- 📊 **Monitorear el progreso** de proyectos activos
- 💬 **Comunicarse** a través de comentarios y solicitudes
- 🎓 **Conectar con estudiantes** de diversas áreas académicas

## 🎯 Problema que Resuelve

En la sede de INACAP Valdivia, los estudiantes constantemente generan ideas y proyectos que requieren la colaboración de distintas disciplinas. Sin embargo, actualmente no existen canales formales ni plataformas tecnológicas que faciliten esta conexión, limitando el desarrollo de iniciativas innovadoras.

## 🛠️ Tecnologías Utilizadas

### Backend
- **Python 3.10+**
- **Django 4.2** - Framework web
- **Django REST Framework** - API RESTful
- **Django Simple JWT** - Autenticación con tokens JWT
- **MariaDB/MySQL** - Base de datos relacional
- **Django CORS Headers** - Manejo de CORS

### Frontend
- **Angular 17** - Framework frontend
- **TypeScript** - Lenguaje de programación
- **RxJS** - Programación reactiva
- **Angular Router** - Enrutamiento
- **Angular Forms** - Manejo de formularios

## 📁 Estructura del Proyecto

```
.
├── backend/                    # Aplicación Django
│   ├── inacap_projects/        # Configuración del proyecto Django
│   │   ├── settings.py         # Configuración general
│   │   ├── urls.py             # URLs principales
│   │   ├── wsgi.py             # WSGI configuration
│   │   └── asgi.py             # ASGI configuration
│   ├── users/                  # Aplicación de usuarios
│   │   ├── models.py           # Modelos: Usuario, Habilidad, Disciplina
│   │   ├── serializers.py      # Serializers para la API
│   │   ├── views.py            # Vistas y ViewSets
│   │   ├── urls.py             # URLs de la app
│   │   └── admin.py            # Panel de administración
│   ├── projects/               # Aplicación de proyectos
│   │   ├── models.py           # Modelos: Proyecto, Colaboracion, Comentario
│   │   ├── serializers.py      # Serializers para la API
│   │   ├── views.py            # Vistas y ViewSets
│   │   ├── urls.py             # URLs de la app
│   │   └── admin.py            # Panel de administración
│   ├── manage.py               # Script de gestión de Django
│   ├── requirements.txt        # Dependencias de Python
│   └── .env.example            # Ejemplo de variables de entorno
│
└── frontend/                   # Aplicación Angular
    ├── src/
    │   ├── app/
    │   │   ├── core/           # Servicios, guards, interceptors
    │   │   │   ├── services/   # AuthService, ProyectoService, etc.
    │   │   │   ├── guards/     # Auth guard
    │   │   │   ├── interceptors/ # HTTP interceptor
    │   │   │   ├── models/     # Interfaces y tipos TypeScript
    │   │   │   └── constants/  # Constantes de la app
    │   │   ├── features/       # Componentes por funcionalidad
    │   │   │   ├── auth/       # Login, Registro
    │   │   │   ├── proyectos/  # Lista, Detalle, Formulario
    │   │   │   └── perfil/     # Perfil de usuario
    │   │   ├── shared/         # Componentes compartidos
    │   │   │   └── components/ # Navbar, etc.
    │   │   ├── app.component.ts
    │   │   ├── app.config.ts   # Configuración de la app
    │   │   └── app.routes.ts   # Rutas de la aplicación
    │   ├── styles.css          # Estilos globales
    │   └── index.html          # HTML principal
    ├── angular.json            # Configuración de Angular
    ├── tsconfig.json           # Configuración de TypeScript
    └── package.json            # Dependencias de Node.js
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Python 3.10 o superior
- Node.js 18 o superior
- MariaDB/MySQL 10.5 o superior
- npm o yarn

### 1. Configuración de la Base de Datos

```bash
# Iniciar MariaDB/MySQL
# Crear base de datos
mysql -u root -p
CREATE DATABASE inacap_projects_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 2. Configuración del Backend (Django)

```bash
# Navegar a la carpeta backend
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En Windows PowerShell:
venv\Scripts\Activate.ps1
# En Windows CMD:
venv\Scripts\activate.bat

# Instalar dependencias
pip install -r requirements.txt

# Copiar archivo de configuración
copy .env.example .env

# Editar .env y configurar tus credenciales de base de datos
# DB_NAME=inacap_projects_db
# DB_USER=root
# DB_PASSWORD=tu_contraseña
# DB_HOST=localhost
# DB_PORT=3306

# Ejecutar migraciones
python manage.py makemigrations
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Cargar datos iniciales (opcional)
# python manage.py loaddata initial_data.json

# Iniciar servidor de desarrollo
python manage.py runserver
```

El backend estará disponible en: `http://localhost:8000`
Panel de administración: `http://localhost:8000/admin`

### 3. Configuración del Frontend (Angular)

```bash
# Abrir una nueva terminal y navegar a la carpeta frontend
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

El frontend estará disponible en: `http://localhost:4200`

## 📡 API Endpoints

### Autenticación
- `POST /api/token/` - Obtener token de acceso
- `POST /api/token/refresh/` - Refrescar token

### Usuarios
- `GET /api/users/usuarios/` - Listar usuarios
- `POST /api/users/usuarios/` - Registrar usuario
- `GET /api/users/usuarios/{id}/` - Obtener usuario específico
- `GET /api/users/usuarios/profile/` - Obtener perfil actual
- `PATCH /api/users/usuarios/profile/` - Actualizar perfil
- `POST /api/users/usuarios/change_password/` - Cambiar contraseña

### Habilidades y Disciplinas
- `GET /api/users/habilidades/` - Listar habilidades
- `POST /api/users/habilidades/` - Crear habilidad
- `GET /api/users/disciplinas/` - Listar disciplinas
- `POST /api/users/disciplinas/` - Crear disciplina

### Proyectos
- `GET /api/projects/proyectos/` - Listar proyectos
- `POST /api/projects/proyectos/` - Crear proyecto
- `GET /api/projects/proyectos/{id}/` - Obtener proyecto
- `PUT /api/projects/proyectos/{id}/` - Actualizar proyecto
- `DELETE /api/projects/proyectos/{id}/` - Eliminar proyecto
- `GET /api/projects/proyectos/mis_proyectos/` - Mis proyectos
- `GET /api/projects/proyectos/colaborando/` - Proyectos donde colaboro
- `POST /api/projects/proyectos/{id}/solicitar_colaboracion/` - Solicitar colaborar
- `GET /api/projects/proyectos/{id}/colaboradores/` - Ver colaboradores
- `GET /api/projects/proyectos/{id}/solicitudes/` - Ver solicitudes (solo creador)

### Colaboraciones
- `GET /api/projects/colaboraciones/` - Listar colaboraciones
- `POST /api/projects/colaboraciones/` - Crear solicitud
- `GET /api/projects/colaboraciones/mis_solicitudes/` - Mis solicitudes
- `POST /api/projects/colaboraciones/{id}/aceptar/` - Aceptar solicitud
- `POST /api/projects/colaboraciones/{id}/rechazar/` - Rechazar solicitud

### Comentarios
- `GET /api/projects/comentarios/` - Listar comentarios
- `POST /api/projects/comentarios/` - Crear comentario
- `DELETE /api/projects/comentarios/{id}/` - Eliminar comentario

## 🔒 Seguridad

- **Autenticación JWT**: Tokens seguros con expiración
- **CORS configurado**: Solo orígenes permitidos
- **Validaciones**: Validación de datos en backend y frontend
- **Permisos**: Control de acceso basado en roles
- **SQL Injection Protection**: Django ORM previene ataques
- **XSS Protection**: Angular sanitiza automáticamente

## 👥 Roles y Permisos

### Usuario Registrado
- Ver proyectos públicos
- Crear proyectos
- Solicitar colaborar en proyectos
- Comentar en proyectos
- Editar su propio perfil

### Creador de Proyecto
- Gestionar sus proyectos
- Aceptar/rechazar solicitudes de colaboración
- Moderar comentarios en sus proyectos

### Administrador (Django Admin)
- Gestión completa del sistema
- Moderación de contenido
- Gestión de usuarios

## 🎨 Características Principales

### Gestión de Proyectos
- ✅ Crear, editar y eliminar proyectos
- ✅ Definir disciplinas y habilidades requeridas
- ✅ Establecer número de colaboradores necesarios
- ✅ Estados de proyecto (Borrador, Activo, En Progreso, Completado, Cancelado)
- ✅ Subir imágenes de proyecto

### Sistema de Colaboración
- ✅ Solicitar colaborar con mensaje personalizado
- ✅ Aceptar/rechazar solicitudes con respuesta
- ✅ Ver colaboradores actuales
- ✅ Sistema de roles (Colaborador, Líder)

### Perfiles de Usuario
- ✅ Información académica (carrera, semestre, disciplina)
- ✅ Habilidades técnicas y blandas
- ✅ Avatar personalizado
- ✅ Biografía

### Comunicación
- ✅ Sistema de comentarios en proyectos
- ✅ Mensajes en solicitudes de colaboración
- ✅ Notificaciones de estado

## 🧪 Testing

```bash
# Backend - Ejecutar tests de Django
cd backend
python manage.py test

# Frontend - Ejecutar tests de Angular
cd frontend
npm test
```

## 📦 Despliegue en Producción

### Backend (Django)

```bash
# Configurar variables de entorno
DEBUG=False
SECRET_KEY=<clave-secreta-segura>

# Recolectar archivos estáticos
python manage.py collectstatic

# Usar servidor WSGI (Gunicorn)
pip install gunicorn
gunicorn inacap_projects.wsgi:application
```

### Frontend (Angular)

```bash
# Compilar para producción
npm run build

# Los archivos estarán en dist/inacap-projects
```

## 📝 Variables de Entorno

### Backend (.env)
```env
SECRET_KEY=tu-clave-secreta-django
DEBUG=True
DB_NAME=inacap_projects_db
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_HOST=localhost
DB_PORT=3306
```

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es desarrollado para INACAP Valdivia como parte de una iniciativa estudiantil.

## 👨‍💻 Equipo de Desarrollo

- **Institución**: INACAP Valdivia
- **Año**: 2025

## 📞 Contacto

Para preguntas o soporte:
- Email: [contacto@inacap.cl](mailto:contacto@inacap.cl)
- Sede: INACAP Valdivia

## 🙏 Agradecimientos

- INACAP Valdivia por el apoyo institucional
- Comunidad estudiantil por la inspiración
- Docentes por la guía técnica

---

**¡Construyamos juntos el futuro de la colaboración estudiantil! 🚀**
