from django.shortcuts import render
from .models import Todo
from .serializers import TodoSerializer
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView


class CORSMixin:
    def options(self, request, *args, **kwargs):
        response = Response()
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS"
        response["Access-Control-Allow-Headers"] = "*"
        return response

@method_decorator(csrf_exempt, name='dispatch')
class TodoList(CORSMixin, generics.ListAPIView):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer

@method_decorator(csrf_exempt, name='dispatch')
class TodoCreate(CORSMixin, generics.CreateAPIView):

    def post(self, request, format=None):
        todo = TodoSerializer(data=request.data)
        if todo.is_valid():
            todo.save()
            return Response(todo.data, status=status.HTTP_201_CREATED)
        return Response(todo.errors, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class TodoDelete(CORSMixin, generics.DestroyAPIView):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    lookup_field = 'pk'

@method_decorator(csrf_exempt, name='dispatch')
class TodoUpdate(CORSMixin, generics.UpdateAPIView):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    lookup_field = 'pk'

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)
        