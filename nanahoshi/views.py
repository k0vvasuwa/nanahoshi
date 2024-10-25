from django.http import (
    HttpRequest,
    JsonResponse
)

from django.views.decorators.csrf import ensure_csrf_cookie


@ensure_csrf_cookie
def set_csrf_token(request: HttpRequest) -> JsonResponse:
    return JsonResponse({'message': 'CSRF token set'})
