from django.urls import (
    path,
    include
)

from rest_framework import routers

from .views import (
    SettingsViewSet,
    NoteViewSet,
    get_note
)


router = routers.DefaultRouter()
router.register(r'settings', SettingsViewSet)
router.register(r'notes', NoteViewSet, 'notes')

urlpatterns = [
    path('', include(router.urls)),
    path('get-note/<int:note_id>', get_note)
]
