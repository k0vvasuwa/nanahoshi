from django.core.management import BaseCommand

from storage.models import Settings


class Command(BaseCommand):
    def handle(self, *args, **options):
        Settings.objects.create()
