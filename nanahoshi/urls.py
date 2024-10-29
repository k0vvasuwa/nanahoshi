from django.conf import settings
from django.conf.urls.static import static

from django.urls import (
    path,
    include
)

from django.contrib import admin

from .views import set_csrf_token


api_prefix: str = 'api/'

urlpatterns = [
    path('admin/', admin.site.urls),
    path(f'{api_prefix}set-csrf-token', set_csrf_token),
    path(f'{api_prefix}auth/', include('authentication.urls')),
    path(f'{api_prefix}storage/', include('storage.urls'))
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
