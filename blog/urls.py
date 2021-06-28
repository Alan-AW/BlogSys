from django.urls import path, re_path
from blog.views import *

app_name = 'blog'
urlpatterns = [
    path('', Welcome.as_view(), name='welcome'),  # 欢迎界面
    path('home/', Home.as_view(), name='home'),  # 主页
    path('yktt/', TourStparadise.as_view(), name='yktt'),  # 烧cpu专用--游客天堂（作废）
    path('about/', AboutMe.as_view(), name='about'),  # 关于我
    path('leave_msg/', LeaveMss.as_view(), name='leave_msg'),  # 留言板
    path('tenyears/', TenYears.as_view(), name='tenyears'),  # 一个普通男孩的十年
    path('digg/', DiggUpDown.as_view()),  # 文章点赞路由
    path('default_comment/', DefaultComment.as_view()),  # 用户默认提交评论路由
    path('submit_son_comment/', SubmitSonComment.as_view()),  # 提交子评论
    path('get_son_comment/', GetSonComment.as_view()),  # 获取父评论的子评论
    path('upload_article_files/', UploadFile.as_view()),  # 配置关于文章添加种的文件上传路径，文本编辑器指定路径

    re_path('^home/(?P<condition>cate|tag|date)/(?P<params>(\w+/?\w+))$', Home.as_view()),  # 主页归档查询路由
    re_path('^(?P<username>\w+)/$', UserSite.as_view()),  # 个人站点路由  # home_site(request,username='xxx')--这条路由表示接收了两个参数
    re_path('^(?P<username>\w+)/(?P<condition>cate|tag|date)/(?P<params>(\w+/?\w+))$', UserSite.as_view()),
    # 个人站点下的跳转  # 这条路由会接收4个参数
    re_path('^(?P<username>\w+)/articles/(?P<articleId>\d+)', ArticleDetailView.as_view()),  # 文章详情页路由设计
]

'''
2021/4/27-28 关于困死在路由问题的情况记录
总结：所有路由优先级  path > re_path
解释：Django 的路由系统是从上到下一条条的匹配的，当path地址与同一级别单独的re_path地址吻合的时候会
      优先匹配先找到的那条路由地址，而 不 会匹配 path 地址，也就是说格式一样的情况下先匹配到谁，就走谁的路由对应的视图函数。
'''
