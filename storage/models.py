from typing import (
    List,
    Dict
)

from django.db import models


class Settings(models.Model):
    dark_theme: bool = models.BooleanField(default=False)
    expanded_notes: List[int] = models.JSONField(default=list)
    opened_tabs: List[int] = models.JSONField(default=list)
    programming_languages: Dict[str, str] = models.JSONField(default=dict)
