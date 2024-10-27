from pathlib import Path

from typing import (
    List,
    Dict
)

import os
import shutil

from django.db import models

from nanahoshi.settings import MEDIA_ROOT


class Settings(models.Model):
    dark_theme: bool = models.BooleanField(default=False)
    expanded_notes: List[int] = models.JSONField(default=list)
    opened_tabs: List[int] = models.JSONField(default=list)
    programming_languages: Dict[str, str] = models.JSONField(default=dict)


class Note(models.Model):
    name: str = models.TextField()
    position: int = models.PositiveIntegerField(blank=True)
    parent: 'Note' = models.ForeignKey('self', on_delete=models.CASCADE, null=True)
    has_children: bool = models.BooleanField(default=False, blank=True)

    def __str__(self) -> str:
        current_note: Note = self
        full_name: str = current_note.name

        if current_note.id == 1:
            return full_name

        while current_note.id != 1:
            full_name = f'{current_note.name}. {full_name}'
            current_note = current_note.parent

        return full_name

    def get_folder_path(self) -> Path:
        path: Path = Path()
        current_note: Note = self

        while current_note:
            path = str(current_note.id) / path
            current_note = current_note.parent

        return MEDIA_ROOT / 'notes' / path

    def get_file_path(self) -> Path:
        return self.get_folder_path() / 'data.html'

    def shifted(self, maybe_old_note: 'Note') -> bool:
        return self.position != maybe_old_note.position

    def moved(self, maybe_old_note: 'Note') -> bool:
        return self.parent != maybe_old_note.parent

    def get_children_count(self) -> int:
        return Note.objects.filter(parent=self).count()

    def shift_children(self, step: int, **filters) -> None:
        Note.objects.filter(parent=self, **filters).update(position=models.F('position') + step)

    def save(self, *args, **kwargs):
        if self.pk:
            old_note: Note = Note.objects.get(pk=self.id)

            if self.moved(old_note):
                old_parent: Note = old_note.parent

                if old_parent.get_children_count() == 1:
                    old_parent.has_children = False
                    old_parent.save(update_fields=['has_children'])
                else:
                    old_parent.shift_children(-1, position__gt=old_note.position)

                new_parent: Note = self.parent

                if new_parent.has_children:
                    new_parent.shift_children(1, position__gte=self.position)
                else:
                    new_parent.has_children = True
                    new_parent.save(update_fields=['has_children'])

                os.rename(old_note.get_folder_path(), self.get_folder_path())
            elif self.shifted(old_note):
                parent: Note = self.parent

                old_position: int = old_note.position
                new_position: int = self.position

                if new_position > old_position:
                    parent.shift_children(-1, position__gt=old_position, position__lte=new_position)
                else:
                    parent.shift_children(1, position__gte=new_position, position__lt=old_position)

            super().save(*args, **kwargs)
        else:
            parent: Note = self.parent
            self.position = parent.get_children_count() + 1

            if not parent.has_children:
                parent.has_children = True
                parent.save(update_fields=['has_children'])

            super().save(*args, **kwargs)

            folder_path: Path = self.get_folder_path()

            os.mkdir(folder_path)
            open(self.get_file_path(), 'w', encoding='utf-8').close()

    def delete(self, *args, **kwargs):
        shutil.rmtree(self.get_folder_path())

        images_folder: Path = MEDIA_ROOT / f'images/{self.id}'

        if images_folder.exists():
            shutil.rmtree(images_folder)

        parent: Note = self.parent

        if parent.get_children_count() == 1:
            parent.has_children = False
            parent.save(update_fields=['has_children'])
        else:
            parent.shift_children(-1, position__gt=self.position)

        super().delete(*args, **kwargs)
