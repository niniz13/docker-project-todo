from django.urls import include, path
from .views import *

urlpatterns = [
    path("", TodoList.as_view(), name='get_todos' ),
    path("create/", TodoCreate.as_view(), name='create_todo'),
    path('edit/<int:pk>/', TodoUpdate.as_view(), name='todo_update'),
    path('delete/<int:pk>/', TodoDelete.as_view(), name='todo_delete'),
]