"""BlogSys URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path,re_path,include
from django.views.static import serve
from BlogSys import settings

# 追加路由
from django.conf import settings
from django.conf.urls.static import static


# include 的参数中 我们首先来设置一个元祖 urlconf_module, app_name
    # urlconf_module  子应用的路由
    # app_name  子应用的名字
    #namespace 命名空间

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(('users.urls', 'users'), namespace='users')),  # 配置用户相关路由 -- 注册、登录、个人中心
    path('', include(('blog.urls', 'blog'), namespace='blog')),  # 配置博客路由
    re_path(r'media/(?P<path>.*)$',serve,{'document_root':settings.MEDIA_ROOT}),  # media配置 ----  也可以使用追加路由
]

# 追加图片(头像的访问路由)
# urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)