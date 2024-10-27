from django.urls import (
    path,
    include
)

from rest_framework import routers

from .views import SettingsViewSet


router = routers.DefaultRouter()
router.register(r'settings', SettingsViewSet)

urlpatterns = [
    path('', include(router.urls))
]
