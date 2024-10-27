from rest_framework import (
    permissions,
    viewsets
)

from .models import Settings
from .serializers import SettingsSerializer


class SettingsViewSet(viewsets.ModelViewSet):
    queryset = Settings.objects.all()
    serializer_class = SettingsSerializer
    permission_classes = [permissions.IsAuthenticated]
