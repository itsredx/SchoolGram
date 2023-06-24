from django.urls import path
from . import views


urlpatterns = [
    path('', views.messages_page), 
    path('get_picture_url/<int:thread_id>/', views.get_picture_url, name='get_picture_url'),
]
