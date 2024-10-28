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
def get_note(request: HttpRequest, note_id: int) -> HttpResponse:
    note: Note = Note.objects.get(pk=note_id)

    with open(note.get_file_path(), 'r', encoding='utf-8') as note_file:
        return HttpResponse(note_file.read())


@require_login
@require_http_methods(['GET'])
def check_note_has_specific_parent(request: HttpRequest) -> JsonResponse:
    target_id: int = request.GET.get('target_id')
    parent_id: int = request.GET.get('parent_id')

    current_note: Note = Note.objects.get(pk=target_id).parent

    while current_note.id != parent_id or current_note.id != 1:
        current_note = current_note.parent

    res: bool = current_note.id == parent_id

    return JsonResponse({
        'result': res
    })
