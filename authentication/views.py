# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import json

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, viewsets, status, views

#from authentication.models import User
#from authentication.permissions import IsAccountOwner
#from authentication.serializers import UserSerializer

from django.contrib.auth import authenticate, login

import requests


class UserActivationView(APIView):

    def get(self, request, uid, token):
        protocol = 'https://' if request.is_secure() else 'http://'
        web_url = protocol + request.get_host()
        post_url = web_url + "/auth/users/activate/"
        post_data = {'uid': uid, 'token': token}
        result = requests.post(post_url, data=post_data)
        content = result.text
        return Response(content)


#class LoginView(views.APIView):
#    def post(self, request, format=None):
#        data = json.loads(request.body)
#
#        email = data.get('email', None)
#        password = data.get('password', None)
#
#        account = authenticate(email=email, password=password)
#
#        #import pdb; pdb.set_trace()
#
#        if account is not None:
#            if account.is_active:
#                login(request, account)
#
#                serialized = UserSerializer(account)
#
#                return Response(serialized.data)
#            else:
#                return Response({
#                    'status': 'Unauthorized',
#                    'message': 'This account has been disabled.'
#                }, status=status.HTTP_401_UNAUTHORIZED)
#        else:
#            return Response({
#                'status': 'Unauthorized',
#                'message': 'Username/password combination invalid.'
#            }, status=status.HTTP_401_UNAUTHORIZED)
#
#
#class UserViewSet(viewsets.ModelViewSet):
#    lookup_field = 'email'
#    queryset = User.objects.all()
#    serializer_class = UserSerializer
#
#    def get_permissions(self):
#        if self.request.method in permissions.SAFE_METHODS:
#            return (permissions.AllowAny(),)
#
#        if self.request.method == 'POST':
#            return (permissions.AllowAny(),)
#
#        return (permissions.IsAuthenticated(), IsAccountOwner(),)
#
#    def create(self, request):
#        serializer = self.serializer_class(data=request.data)
#
#        #import pdb; pdb.set_trace()
#
#        if serializer.is_valid():
#            User.objects.create_user(**serializer.validated_data)
#
#            return Response(serializer.validated_data, status=status.HTTP_201_CREATED)
#
#        return Response({
#            'status': 'Bad request',
#            'message': 'Account could not be created with received data.'
#        }, status=status.HTTP_400_BAD_REQUEST)