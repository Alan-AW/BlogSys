from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse
from django.shortcuts import render, redirect, HttpResponse
from django.views import View
from django.urls import reverse
import random, json
from io import BytesIO
from PIL import ImageDraw, Image, ImageFont
from django.views.decorators.clickjacking import xframe_options_sameorigin
from blog.models import *
from django.contrib import auth
import re
from django.db.models import Count
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import F
from django.db import transaction
from django.core.mail import send_mail
import os
from BlogSys import settings
from bs4 import BeautifulSoup  # 库：beautifulsoup4


# My views is create here.


class Welcome(View):
    '''
    welcome
    '''

    def get(self, request):
        return render(request, 'blog/welcome.html')

    def post(self, request):
        pass


class Home(View):
    '''
    网站主页
    '''

    def get(self, request, **kwargs):
        username = request.user
        article_list = Article.objects.all()
        if kwargs:
            condition = kwargs.get('condition')
            params = kwargs.get('params')
            if condition == 'cate':
                article_list = article_list.filter(homeCategory__title=params)
            elif condition == 'tag':
                article_list = article_list.filter(tags__title=params)
            else:
                year, month = params.split("/")
                article_list = article_list.filter(create_time__year=year, create_time__month=month)

        # 查询当前站点的每一个文章的分类数
        cate_list = Category.objects.values('pk').annotate(c=Count('article__title')).values_list('title', 'c')

        # 查询当前站点的每一个标签以及对应的文章数
        tag_list = Tag.objects.values('pk').annotate(c=Count('article')).values_list('title', 'c')

        # 日期归档

        # ***************  查询当前站点的每一个日期所对应的文章数一  **********
        # 属于  ：  单表分组查询  date_format 过滤
        date_list = Article.objects \
            .extra(select={'y-m_date': 'date_format(create_time,"%%Y/%%m")'}) \
            .values('y-m_date') \
            .annotate(c=Count('nid')) \
            .values_list('y-m_date', 'c')

        from django.db.models.functions import TruncMonth
        # date_list = Article.objects.annotate(month=TruncMonth('crete_time')).values('month').annotate(c=Count('nid')).values_list('month','c')

        return render(request, 'blog/home.html', locals())

    def post(self, request):
        pass


class UserSite(View):
    '''
    个人站点视图
    '''

    def get(self, request, username, **kwargs):
        # 判断用户是否存在
        user = UserInfo.objects.filter(username=username).first()  # 单独查询是否存在可以用exists()
        if not user:
            return render(request, "blog/404.html")
        # 查询当前站点对象
        blog = Blog.objects.filter(site=user.pk).first()

        # 获取当前用户或者当前站点对应的所有文章
        # 方式一：基于对象查询 -- 反向查询
        # article_list = user.article_set.all()
        # 方式二基于 __ 查询 -- 跨表查询
        article_list = Article.objects.filter(user=user)
        if kwargs:
            condition = kwargs.get('condition')
            params = kwargs.get('params')
            if condition == 'cate':
                article_list = article_list.filter(homeCategory__title=params)
            elif condition == 'tag':
                article_list = article_list.filter(tags__title=params)
            else:
                year, month = params.split("/")
                article_list = article_list.filter(create_time__year=year, create_time__month=month)

        return render(request, "blog/usersite.html", locals())


class ArticleDetailView(View):
    '''
    文章详情页
    '''

    def get(self, request, username, articleId):
        user = UserInfo.objects.filter(username=username).first()  # 单独查询是否存在可以用exists()
        article_obj = ArticleDetail.objects.filter(article_id=articleId).first()
        all_comment = Comment.objects.filter(article_id=articleId)
        comment_obj = all_comment.filter(parent_comment=None)
        return render(request, 'blog/article_detail.html', locals())


class DiggUpDown(View):
    '''
    点赞
    '''

    def post(self, request):
        if request.is_ajax():
            user_id = request.user.pk
            article_id = request.POST.get('article_id')
            is_up = json.loads(request.POST.get('is_up'))
            # 过滤是否已经操作过
            is_digg = ArticleUpDown.objects.filter(user_id=user_id, article_id=article_id).first()
            success_obj = {'state': True}
            if not is_digg:
                ArticleUpDown.objects.create(user_id=user_id, article_id=article_id, is_up=is_up)
                queryset = Article.objects.filter(pk=article_id)
                if is_up:
                    queryset.update(up_count=F("up_count") + 1)
                else:
                    queryset.update(down_count=F("down_count") + 1)
            else:
                success_obj['state'] = False
                success_obj['handled'] = is_digg.is_up
            return HttpResponse(json.dumps(success_obj))
        else:
            pass


class DefaultComment(View):
    '''
    提交根评论
    '''

    def post(self, request):
        if request.is_ajax():
            user_id = request.user.pk
            article_id = request.POST.get('article_id')
            content = request.POST.get('content')
            article_obj = Article.objects.filter(pk=article_id)
            # 事务语法操作 防止数据同步出现问题
            try:
                with transaction.atomic():
                    comment_obj = Comment.objects.create(user_id=user_id, article_id=article_id, content=content)
                    article_obj.update(comment_count=F('comment_count') + 1)
                response = {'create_time': comment_obj.create_time.strftime('%Y/%m/%d %H'),
                            'username': request.user.username,
                            'content': content,
                            'comment_id': comment_obj.pk
                            }
            except:
                response = {'error':True}
            # 发送给作者
            # send_mail(
            #     '您的文章%s新增了一条评论'%article_obj.title,
            #     content,

            # 感觉很鸡肋啊，不做了
            # )
            return HttpResponse(json.dumps(response))
        else:
            cnm = '非爬虫提交，你他妈的!'
            HttpResponse(json.dumps(cnm))


class GetSonComment(View):
    '''
    获取更多子评论
    '''

    def post(self, request):
        if request.is_ajax():
            parent_comment_id = request.POST.get('parent_comment_id')
            parent_obj = Comment.objects.filter(parent_comment_id=parent_comment_id).all().order_by('pk').values('pk',
                                                                                                                 'article_id',
                                                                                                                 'content',
                                                                                                                 'parent_comment_id',
                                                                                                                 'create_time')
            if parent_obj:
                return JsonResponse(list(parent_obj), safe=False)
            else:
                return HttpResponse('nothing')
        else:
            cnm = '爬虫提交，你他妈的!'
            HttpResponse(json.dumps(cnm))


class SubmitSonComment(View):
    '''
    提交子评论
    '''

    def post(self, request):
        if request.is_ajax():
            print(request.POST)
            userId = request.user.pk
            articleId = request.PSOT.get('article_id')
            parentId = request.POST.get('parent_id')
            content = request.POST.get('content')
            son_obj = Comment.objects.create(user_id=userId, article_id=articleId, parent_comment_id=parentId,
                                             content=content)
            createTime = son_obj.create_time
            user = request.user.username
            response = {'create_time': createTime, 'user': user}
            return HttpResponse(json.dumps(response))
        else:
            cnm = '禁止非Ajax提交'
            return HttpResponse(json.dumps(cnm))


class UploadFile(View, LoginRequiredMixin):
    '''
    文本编辑器上传图片
    '''

    @xframe_options_sameorigin  # 这个非常重要，浏览器的同源策略禁止在网页中嵌入其他的内容，加了这个的话会硬转为可读，就能显示了
    def post(self, request):
        img = request.FILES.get('illustration')
        files_path = os.path.join(settings.MEDIA_ROOT, 'illustration', img.name)
        with open(files_path, 'wb') as f:
            for line in img:
                f.write(line)
        response = {
            'error': 0,
            'url': 'media/illustration/%s' % img.name
        }
        return HttpResponse(json.dumps(response))


class TourStparadise(View):
    '''
    游客中心，烧cpu专用
    '''

    def get(self, request):
        return render(request, 'blog/touristparadise.html')

    def post(self, request):
        pass


class LeaveMss(View):
    '''
    留言板
    '''

    def get(self, request):
        leave_obj = LeaveMsg.objects.all()
        all_leave_count = leave_obj.count()
        return render(request, 'blog/leave_msg.html', locals())

    def post(self, request):
        if request.is_ajax():
            username = request.user.username
            nick_name = request.POST.get('nick_name')
            content = request.POST.get('content')
            if username:
                nick_name = username
            ret = LeaveMsg.objects.create(nick_name=nick_name, content=content)
            nick_name = ret.nick_name
            content = ret.content
            create_time = ret.create_time.strftime('%Y-%m-%d %H'),
            response = {'nick_name': nick_name,
                        'content': content,
                        'create_time': create_time
                        }
            return HttpResponse(json.dumps(response))
        else:
            cnm = '爬虫提交，你他妈的!'
            HttpResponse(json.dumps(cnm))


class AboutMe(View):
    '''
    关于我的页面
    '''

    def get(self, request):
        return render(request, 'blog/about.html')

    def post(self, request):
        pass


class TenYears(LoginRequiredMixin, View):
    '''
    一个普通男孩的十年
    '''

    def get(self, request):
        return render(request, 'blog/tenyears.html')
