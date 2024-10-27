from rest_framework import (
    permissions,
    viewsets
)

from django_filters.rest_framework import DjangoFilterBackend

from .models import (
    Settings,
    Note
)

from .serializers import (
    SettingsSerializer,
    NoteSerializer
)


class SettingsViewSet(viewsets.ModelViewSet):
    queryset = Settings.objects.all()
    serializer_class = SettingsSerializer
    permission_classes = [permissions.IsAuthenticated]


class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer

    permission_classes = [permissions.IsAuthenticated]

    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['parent']

    def get_queryset(self):
        parent_id: int | None = self.request.query_params.get('parent')

        if not parent_id:
            return Note.objects.filter(pk=int(self.request.path.split('/')[4]))

        parent: Note = Note.objects.get(pk=parent_id)
        return Note.objects.filter(parent=parent).order_by('position')
