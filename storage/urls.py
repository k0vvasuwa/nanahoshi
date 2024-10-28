from django.urls import (
    path,
    include
)

from rest_framework import routers

from .views import (
    SettingsViewSet,
    NoteViewSet,
    get_note,
    check_note_has_specific_parent
)


router = routers.DefaultRouter()
router.register(r'settings', SettingsViewSet)
router.register(r'notes', NoteViewSet, 'notes')

urlpatterns = [
    path('', include(router.urls)),
    path('get-note/<int:note_id>', get_note),
    path('note-has-parent', check_note_has_specific_parent)
]
