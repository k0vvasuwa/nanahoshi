from django.urls import path

from .views import (
    check_user_logged_in,
    login,
    logout
)


urlpatterns = [
    path('get-login-status', check_user_logged_in),
    path('login', login),
    path('logout', logout)
]
