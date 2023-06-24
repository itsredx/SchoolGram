from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('landing.urls')),
    path('chat/', include('chat.urls')),
    path('Study_group', include('study_group.urls')),
    path('accounts/', include('allauth.urls')),
    path('social/', include('social.urls')),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
