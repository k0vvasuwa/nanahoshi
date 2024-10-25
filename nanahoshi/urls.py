from django.urls import path

from django.contrib import admin

from .views import set_csrf_token


api_prefix: str = 'api/'

urlpatterns = [
    path('admin/', admin.site.urls),
    path(f'{api_prefix}set-csrf-token', set_csrf_token)
]
