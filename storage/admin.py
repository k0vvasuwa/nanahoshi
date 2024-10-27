from django.contrib import admin

from .models import Note


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'name',
        'position',
        'parent',
        'has_children'
    ]
