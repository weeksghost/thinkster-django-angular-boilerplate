from django.conf.urls import url, include
from django.contrib import admin

from thinkster_django_angular_boilerplate.views import IndexView

from rest_framework_nested import routers

from rest_framework_jwt import views as jwt_views
from rest_framework_jwt.views import refresh_jwt_token
from rest_framework_jwt.views import verify_jwt_token

#from authentication.views import UserViewSet
#from authentication.views import LoginView

import authentication.views


#router = routers.SimpleRouter()
#router.register(r'accounts', UserViewSet)


urlpatterns = [
    url(r'^admin/', admin.site.urls),

    url(r'^auth/', include('djoser.urls.base')),
    url(r'^auth/', include('djoser.urls.authtoken')),
    url(r'^auth/', include('djoser.urls.jwt')),
    url(r'^auth/', include('djoser.social.urls')),
    url(r'^auth-jwt-refresh/', refresh_jwt_token),
    url(r'^auth-jwt-verify/', verify_jwt_token),
    url(r'^auth/users/activate/(?P<uid>[\w-]+)/(?P<token>[\w-]+)/$',
        authentication.views.UserActivationView.as_view()),

    #url(r'^api/v1/', include(router.urls)),
    #url(r'^api/v1/auth/login/$', LoginView.as_view(), name='login'),

    url('^.*$', IndexView.as_view(), name='index'),
]