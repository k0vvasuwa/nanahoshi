import json

from django.http import (
    HttpRequest,
    JsonResponse
)

from django.views.decorators.http import require_http_methods

import django.contrib.auth as django


def require_login(input_func):
    def output_func(request: HttpRequest, *args, **kwargs):
        if not bool(request.user and request.user.is_authenticated):
            return JsonResponse({
                'message': 'You are not logged in'
            }, status=403)

        return input_func(request, *args, **kwargs)

    return output_func


@require_http_methods(['GET'])
def check_user_logged_in(request: HttpRequest) -> JsonResponse:
    return JsonResponse({
        'loggedIn': bool(request.user and request.user.is_authenticated)
    })


@require_http_methods(['POST'])
def login(request: HttpRequest) -> JsonResponse:
    try:
        data = json.loads(request.body.decode('utf-8'))

        username = data['username']
        password = data['password']
    except json.JSONDecodeError:
        return JsonResponse({
            'message': 'Invalid JSON'
        }, status=400)

    user = django.authenticate(request, username=username, password=password)

    if user:
        django.login(request, user)
        return JsonResponse({
            'message': 'You are logged in'
        }, status=200)

    return JsonResponse({
        'message': 'Invalid credentials'
    }, status=401)


@require_login
@require_http_methods(['GET'])
def logout(request: HttpRequest) -> JsonResponse:
    django.logout(request)
    return JsonResponse({
        'message': 'You are now logged out'
    })
