from django.urls import path, re_path
from users.views import *

app_name = 'users'
urlpatterns = [
    path('login/', Signin.as_view(), name='login'),  # 登录
    path('register/', Register.as_view(), name='register'),  # 注册
    path('get_valid_img/', GetValidImg.as_view(), name='get_valid_img'),  # 验证码
    path('forget_pwd/', ForgetPwd.as_view(), name='forget_pwd'),  # 忘记密码
    path('logout/', Logout.as_view(), name='logout'),  # 退出登录
    path('merge_user/', MargeRegister.as_view(), name='merge_user'),  # ajax注册验证用户
    path('SmsCodeChick/', SmsCodeChick.as_view(), name='SmsCodeChick'),  # ajax发送短信验证码
    path('usercenter/', UserCenter.as_view(), name='center_welcome'),  # 用户个性化设置
    path('center_msg/', CenterMsg.as_view(), name='center_msg'),  # 用户详细信息展示
    path('center_add_blog/', AddBlog.as_view(), name='add_blog'),  # 添加个人博客信息
    path('center_add_categry/', AddCategory.as_view(), name='add_category'),  # 添加分类
    path('center_add_tags/', AddTags.as_view(), name='add_tags'),  # 添加标签
    path('center_add_article/', AddArticles.as_view(), name='add_article'),  # 添加文章
    path('avatarchange/', UserAvatarChange.as_view(), name='avatar_change'),  # 修改头像单独路由
    re_path('^(?P<username>\w+)/refactor/(?P<articleId>\d+)$', EditArticles.as_view())  # 修改文章

]
