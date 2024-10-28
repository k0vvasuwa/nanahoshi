from django.urls import (
    path,
    include
)

from rest_framework import routers

from .views import (
    SettingsViewSet,
    NoteViewSet,
    get_note_title,
    get_note_text
)


router = routers.DefaultRouter()
router.register(r'settings', SettingsViewSet)
router.register(r'notes', NoteViewSet, 'notes')

urlpatterns = [
    path('', include(router.urls)),
    path('get-note-title', get_note_title),
    path('get-note-text/<int:note_id>', get_note_text)
]
