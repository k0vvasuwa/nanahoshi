from django.urls import (
    path,
    include
)

from rest_framework import routers

from .views import (
    SettingsViewSet,
    NoteViewSet
)


router = routers.DefaultRouter()
router.register(r'settings', SettingsViewSet)
router.register(r'notes', NoteViewSet, 'notes')

urlpatterns = [
    path('', include(router.urls))
]
