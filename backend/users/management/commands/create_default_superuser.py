from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import os

class Command(BaseCommand):
    help = "Crea un superusuario por defecto si no existe"

    def handle(self, *args, **options):
        User = get_user_model()
        email = os.getenv('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
        nombre = os.getenv('DJANGO_SUPERUSER_NOMBRE', 'Admin')
        apellido = os.getenv('DJANGO_SUPERUSER_APELLIDO', 'User')
        password = os.getenv('DJANGO_SUPERUSER_PASSWORD', 'admin1234')

        if not User.objects.filter(email=email).exists():
            User.objects.create_superuser(
                email=email,
                nombre=nombre,
                apellido=apellido,
                password=password,
            )
            self.stdout.write(self.style.SUCCESS(f"Superusuario creado: {email}"))
        else:
            self.stdout.write(self.style.WARNING(f"El superusuario {email} ya existe"))
