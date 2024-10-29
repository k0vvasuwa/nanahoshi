from django.urls import (
    path,
    include
)

from rest_framework import routers

from .views import (
    SettingsViewSet,
    NoteViewSet,
    get_note_title,
    get_note_page,
    check_note_has_specific_parent,
    check_note_exists,
    upload_image
)


router = routers.DefaultRouter()
router.register(r'settings', SettingsViewSet)
router.register(r'notes', NoteViewSet, 'notes')

urlpatterns = [
    path('', include(router.urls)),
    path('get-note-title/<int:note_id>', get_note_title),
    path('get-note-page/<int:note_id>', get_note_page),
    path('note-has-parent', check_note_has_specific_parent),
    path('note-exists/<int:note_id>', check_note_exists),
    path('upload-image/<int:note_id>', upload_image),
]
