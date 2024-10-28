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

from rest_framework.decorators import action
from rest_framework.response import Response

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

    @action(detail=True, methods=['patch'])
    def add_expanded_note(self, request, pk=None):
        settings = self.get_object()
        note_id = request.data.get('note_id')
        if note_id not in settings.expanded_notes:
            settings.expanded_notes.append(note_id)
            settings.save(update_fields=['expanded_notes'])

        return Response({
            'message': 'Successful'
        })

    @action(detail=True, methods=['patch'])
    def remove_expanded_note(self, request, pk=None):
        settings = self.get_object()
        note_id = request.data.get('note_id')
        if note_id in settings.expanded_notes:
            settings.expanded_notes.remove(note_id)
            settings.save(update_fields=['expanded_notes'])

        return Response({
            'message': 'Successful'
        })


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
def get_note_page(request: HttpRequest, note_id: int) -> HttpResponse:
    note: Note = Note.objects.get(pk=note_id)
    with open(note.get_file_path(), 'r', encoding='utf-8') as note_file:
        return HttpResponse(note_file.read())


@require_login
@require_http_methods(['GET'])
def check_note_has_specific_parent(request: HttpRequest) -> JsonResponse:
    target_id: int = int(request.GET.get('target_id'))
    parent_id: int = int(request.GET.get('parent_id'))

    current_note: Note = Note.objects.get(pk=target_id).parent

    while current_note.id != parent_id and current_note.id != 1:
        current_note = current_note.parent

    print(current_note.name)
    res: bool = current_note.id == parent_id

    return JsonResponse({
        'result': res
    })


@require_login
@require_http_methods(['GET'])
def check_note_exists(request: HttpRequest, note_id: int) -> JsonResponse:
    return JsonResponse({
        'result': Note.objects.filter(id=note_id).exists()
    })
