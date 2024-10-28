from django.http import (
    HttpRequest,
    HttpResponse,
    JsonResponse
)

from django.views.decorators.http import require_http_methods

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

from authentication.views import require_login


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


@require_login
@require_http_methods(['GET'])
def get_note_title(request: HttpRequest, note_id: int) -> JsonResponse:
    note: Note = Note.objects.get(pk=note_id)
    return JsonResponse({
        'title': f'{note}'
    })


@require_login
@require_http_methods(['GET'])
def get_note_text(request: HttpRequest, note_id: int) -> HttpResponse:
    note: Note = Note.objects.get(pk=note_id)

    with open(note.get_file_path(), 'r', encoding='utf-8') as note_file:
        return HttpResponse(note_file.read())
