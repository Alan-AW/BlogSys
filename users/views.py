from django.shortcuts import render, redirect, HttpResponse
from django.views import View
from django.urls import reverse
# from lxml import etree
import requests
from bs4 import BeautifulSoup
import random, json
from random import randint
from io import BytesIO
from PIL import ImageDraw, Image, ImageFont
from blog.models import *
from django.contrib import auth
from django.contrib.auth.mixins import LoginRequiredMixin
import re
from libs.yuntongxun.sms import CCP

# Create your views here.

class Signin(View):
    '''
    登录功能
    '''

    def get(self, request):
        return render(request, 'users/signin.html')

    def post(self, request):
        if request.is_ajax():
            user = request.POST.get('user')
            pwd = request.POST.get('pwd')
            re_code = request.POST.get('re_code')
            # remember = request.POST.get('remember')  # 点击记住登录按钮的状态
            random_code_str = request.session.get("random_code_str")
            sigin_response = {"user": None, "error_msg": '', "next_page": None}
            if re_code.upper() == random_code_str.upper():
                auth_user = auth.authenticate(username=user, password=pwd)  # 验证用户名和密码是否正确
                if auth_user:
                    # 状态保持，保持登录状态
                    auth.login(request, auth_user)  # {"user_id":1} request.user传到数据库中的auth
                    # 如果用户通过个人中心跳转到登录页面进行登录了，那么一定会带有next参数
                    # 此时做一个判断，含有next请求参数的时候进行从定向到next地址
                    next_page = request.GET.get('next')
                    if next_page:
                        sigin_response["next_page"] = 'next_page'  # 给一个跳转的判断信息，让Ajax执行跳转
                    # response = redirect(reverse('blog:home'))
                    # request.session.set_expiry(None)  # 默认只要对登录就记住用户两周时间
                    # response.set_cookie('is_login', True, max_age=14 * 24 * 3600)
                    # response.set_cookie('username', auth_user.username, max_age=14 * 24 * 3600)
                    sigin_response["user"] = auth_user.username
                    '''
                    后端做跳转时设置cook信息，此时为前端Ajax跳转没有设置cook选项，默认记住两周
                    记住登录状态  按钮处理
                    response = redirect(reverse('blog:home'))
                    if remember != 'on':
                        request.session.set_expiry(0)  # 浏览器关闭之后就取消登录状态
                        response.set_cookie('is_login',True)
                        response.set_cookie('username',auth_user.username,max_age=14*24*3600)
                    else:
                        request.session.set_expiry(None)  # 默认两周
                        response.set_cookie('is_login',True,max_age=14*24*3600)
                        response.set_cookie('username',auth_user.username,max_age=14*24*3600)
                    '''
                else:
                    sigin_response["error_msg"] = "用户名或密码错误!"
            else:
                sigin_response["error_msg"] = "验证码错误!"
            return HttpResponse(json.dumps(sigin_response))
        else:
            cnm = '别搞骚操作,你他妈的。'
            return HttpResponse(cnm)


class ForgetPwd(View):
    def get(self, request):
        return render(request, 'users/forget_pwd.html')

    def post(self, request):
        if request.is_ajax():
            is_all = {'flag': False, 'error_msg': []}
            user = request.POST.get('user')
            tel = request.POST.get('tel')
            pwd = request.POST.get('pwd')
            re_pwd = request.POST.get('re_pwd')
            sms_code = request.POST.get('sms_code')
            if all([user, tel, pwd, re_pwd, sms_code]):
                user_obj = UserInfo.objects.get(username=user)
                if user_obj:
                    send_sms_code = request.session.get('%11s' % tel)
                    if pwd == re_pwd and sms_code == send_sms_code:
                        del request.session['%11s' % tel]
                        user_obj.set_password(pwd)
                        user_obj.save()
                        is_all['flag'] = True
                    else:
                        if pwd != re_pwd:
                            is_all['error_msg'].append('pwd2_error')
                        if sms_code != send_sms_code:
                            is_all['error_msg'].append('sms_code_error')
                else:
                    is_all['error_msg'].append('user_none')
            else:
                is_all['error_msg'].append('not_all')
            return HttpResponse(json.dumps(is_all))
        else:
            cnm = '别搞骚操作,你他妈的。'
            return HttpResponse(json.dumps(cnm))


class Logout(View):
    def get(self, request):
        auth.logout(request)
        url = reverse('blog:home')
        return redirect(url)


class GetValidImg(View):
    '''
    验证码
    '''

    def get_random_color(self):
        rgb = (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))
        return rgb

    def get_random_chr(self):
        self.chr_list = list()
        for i in range(5):
            self.random_chr = random.choice(
                [str(random.randint(0, 9)),
                 chr(random.randint(65, 90)),
                 chr(random.randint(97, 122))])
            self.chr_list.append(self.random_chr)
        return self.chr_list

    def get(self, request):
        f = BytesIO()
        image = Image.new(mode='RGB', size=(120, 80), color=self.get_random_color())
        draw = ImageDraw.Draw(image)
        font = ImageFont.truetype('static/font/kumo.ttf', size=44)
        x, y = 0, 25
        for i in self.get_random_chr():
            draw.text((x, y), i, (0, 0, 0), font=font)
            x += 25
        # 干扰项
        width = 120
        height = 80
        for i in range(5):  # 线条数量 --- 两点一线
            x, x2, y, y2 = random.randint(0, width), \
                           random.randint(0, width), \
                           random.randint(0, height), \
                           random.randint(0, height)
            draw.line((x, y, x2, y2), fill=self.get_random_color())  # 画线方法-line

        image.save(f, 'png')
        data = f.getvalue()
        request.session["random_code_str"] = ''.join(self.chr_list)  # 验证码生成session保存在数据库中
        print('图片验证码', request.session.get('random_code_str'))  # 显示出来
        f.close()
        return HttpResponse(data)


class Register(View):
    '''
    注册功能
    '''

    def get(self, request):
        return render(request, 'users/register.html')

    def post(self, request):
        if request.is_ajax():
            user = request.POST.get('user')
            email = request.POST.get('email')
            pwd = request.POST.get('pwd')
            re_pwd = request.POST.get('re_pwd')
            tel = request.POST.get('tel')
            sms_code = request.POST.get('sms_code')
            # 拿到信息开始校验
            session_sms_code = request.session.get('%11s' % tel)
            validation_results = self.register_valid(user, email, pwd, re_pwd, tel, sms_code, session_sms_code)
            if validation_results['error_msg']:
                return HttpResponse(json.dumps(validation_results))
            else:
                # 写入数据库，并且删除当前短信验证码
                user_obj = UserInfo.objects.create_user(username=user, email=email, password=pwd, tel=tel)
                del request.session['%s' % tel]
                validation_results['user'] = user_obj.username
                return HttpResponse(json.dumps(validation_results))
        else:
            cnm = '别搞骚操作,你他妈的。'
            return HttpResponse(json.dumps(cnm))  # 爬虫非Ajax提交

    def register_valid(self, user, email, pwd, re_pwd, tel, sms_code, session_sms_code):
        register_val = {"user": None, 'error_msg': []}
        if not all([user, email, pwd, re_pwd, tel, sms_code]):
            register_val['error_msg'].append('Missing_parameter')
            return register_val
        auth_user = UserInfo.objects.filter(username=user)
        if auth_user:
            register_val['error_msg'].append('user_error')
        email_checked = re.match(r'^[0-9a-zA-Z_]{0,19}@[0-9a-zA-Z]{1,13}\.[a-zA-Z]{2,3}$', email)
        if not email_checked:
            register_val["error_msg"].append('email_error')
        pwd_checked = re.match(r'(?=.*([a-zA-Z].*))(?=.*[0-9].*)[a-zA-Z0-9-*/+.~!@#$%^&*()]{6,20}$', pwd)
        if not pwd_checked:
            register_val["error_msg"].append('pwd_error')
        if pwd != re_pwd:
            register_val["error_msg"].append('re_pwd_error')
        sql_tel = UserInfo.objects.filter(tel=tel)
        tel_checked = re.match(r'^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$', tel)
        if sql_tel:
            register_val["error_msg"].append('tel_error')
        elif not tel_checked:
            register_val["error_msg"].append('tel_error')
        if sms_code != session_sms_code:
            register_val['error_msg'].append('sms_code_error')
        return register_val


class SmsCodeChick(View):
    '''
    短信验证码发送
    '''

    def post(self, request):
        if request.is_ajax():
            tel = request.POST.get('tel')
            response = {"is_send": True, "error_msg": None}
            # 发送短信并且获取到短信验证码的内容，保存到session----如果有多个人同时注册呢？
            # 键的名称应该使用手机号作为键。这样就能取到对应的唯一值
            # 生成短信验证码
            if tel:
                p_sms_code = "%06d" % randint(0, 999999)
                # 发送验证码
                CCP().send_template_sms(tel, [p_sms_code, 5], 1)
                print('发送短信验证码：', p_sms_code)
                request.session['%11s' % tel] = str(p_sms_code)
            else:
                response['is_send'] = False
                response['error_msg'] = '你有毒吧，手机号都能填错!？'
            return HttpResponse(json.dumps(response))
        else:
            cnm = '别搞骚操作,你他妈的。'
            return HttpResponse(json.dumps(cnm))


class MargeRegister(View):
    '''
    注册用户名校验
    '''

    def post(self, request):
        if request.is_ajax():
            response = {
                "is_reg": True,
                "error_msg": None
            }
            user = request.POST.get('user')
            auth_user = UserInfo.objects.filter(username=user)
            if auth_user:
                response["error_msg"] = '用户名存在'
            else:
                response["is_reg"] = False
            return HttpResponse(json.dumps(response))
        else:
            cnm = '别搞骚操作,你他妈的。'
            return HttpResponse(json.dumps(cnm))  # 爬虫非Ajax提交


class UserCenter(LoginRequiredMixin, View):
    def get(self, request):
        # 获取天气代码块 ---- 无法爬取天气信息了，淦
        # header = {
        #     'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.67 Safari/537.36 Edg/87.0.664.55'}
        # CITY = 'wuhan'
        # # 目标地址 -- 中国天气网
        # http = 'https://www.tianqi.com/'
        # url = http + CITY + '/'
        # # 通过网址进入网站
        # response = requests.get(url, headers=header)
        # # 筛选天气信息
        # data = etree.HTML(response.text)
        # weather_list = data.xpath('//dl[@class="weather_info"]//text()')  # 转换方法
        # # weather_desc = ''.join(weather_list)  # 格式转换
        # # weather_d = weather_desc.replace(' ','')
        # date = weather_list[5]
        # today = weather_list[9]
        # weather = weather_list[12] + weather_list[13]
        # humidity = weather_list[16]
        # ultraviolet = weather_list[18]
        # air_quality = weather_list[20]
        # PM = weather_list[21]
        return render(request, 'users/center_welcome.html', locals())


class CenterMsg(LoginRequiredMixin, View):
    '''
    用户个人中心
    系统自动登录验证 LoginRequiredMixin
    如果没有登录的话会自动跳转到一个界面 ；/accounts/login/?next=/xxxxxx(usercenter)/
    这个时候需要settings设置一下默认的跳转路由
    '''

    def get(self, request):
        user = request.user
        email = request.user.email
        tel = request.user.tel
        avatar = request.user.avatar
        nick_name = request.user.nick_name
        avatar = request.user.avatar
        signature = request.user.signature
        goal = request.user.goal
        user_obj = UserInfo.objects.get(username=user)
        artic_list = user_obj.article_set.all()
        has_goal = request.user.has_goal
        if has_goal == '0':
            has_goal = True
        else:
            has_goal = False
        return render(request, 'users/center_msg.html', locals())

    def post(self, request):
        if request.is_ajax():
            user = request.user
            msg = request.POST.get('msg')
            edit = request.POST.get('edit')
            article_id = request.POST.get('article_id')
            operation = request.POST.get('operation')
            '''
            修改个人信息
            '''
            if edit == 'nick_name':
                result = {"success": False, "error_msg": None, "edit_name": None, "edit_msg": None}
                if len(msg) < 3 or len(msg) > 8:
                    result['error_msg'] = '昵称长度违规'
                    return HttpResponse(json.dumps(result))
                elif UserInfo.objects.filter(nick_name=msg):
                    result['error_msg'] = '该昵称已经注册过了'
                    return HttpResponse(json.dumps(result))
                else:
                    user.nick_name = msg
                    user.save()
                    result['success'] = True
                    result['edit_name'] = 'nick_name'
                    result['edit_msg'] = msg
                    return HttpResponse(json.dumps(result))

            if edit == 'email':
                result = {"success": False, "error_msg": None}
                if re.match(r'^[0-9a-zA-Z_]{0,19}@[0-9a-zA-Z]{1,13}\.[a-zA-Z]{2,3}$', msg):
                    if UserInfo.objects.filter(email=msg):
                        result['error_msg'] = '该邮箱已经注册'
                        return HttpResponse(json.dumps(result))
                    else:
                        user.email = msg
                        user.save()
                        result['success'] = True
                        result['edit_name'] = 'email'
                        result['edit_msg'] = msg
                        return HttpResponse(json.dumps(result))
                else:
                    result['error_msg'] = '邮箱格式错误'
                    return HttpResponse(json.dumps(result))

            if edit == 'tel':
                result = {"success": False, "error_msg": None}
                if re.match(r'^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$', msg):
                    if UserInfo.objects.filter(tel=msg):
                        result['error_msg'] = '手机号已被注册'
                        return HttpResponse(json.dumps(result))
                    else:
                        user.tel = msg
                        user.save()
                        result['success'] = True
                        result['edit_name'] = 'tel'
                        result['edit_msg'] = msg
                        return HttpResponse(json.dumps(result))
                else:
                    result['error_msg'] = '手机号格式错误'
                    return HttpResponse(json.dumps(result))

            if edit == 'goal':
                result = {"success": False, "error_msg": None}
                user.goal = msg
                user.has_goal = 1
                user.save()
                result['success'] = True
                result['edit_name'] = 'goal'
                result['edit_msg'] = msg
                return HttpResponse(json.dumps(result))

            if edit == 'signature':
                result = {"success": False, "error_msg": None}
                user.signature = msg
                user.save()
                result['success'] = True
                result['edit_name'] = 'signature'
                result['edit_msg'] = msg
                return HttpResponse(json.dumps(result))
            '''
            删除文章
            '''
            if article_id:
                response = {'pass': True}
                if operation == 'delete':
                    try:
                        # 删除文章、文章详情表会一对一同步删除
                        Article.objects.get(pk=article_id).delete()
                    except:
                        response["pass"] = False
                        response["error"] = '删除失败，请稍后再试...'
                return HttpResponse(json.dumps(response))
        else:
            cnm = '别搞骚操作,你他妈的。'
            return HttpResponse(json.dumps(cnm))


class AddBlog(LoginRequiredMixin, View):
    '''
    编辑博客信息
    '''

    def get(self, request):
        user = request.user
        userId = user.pk
        hasBlog = Blog.objects.filter(site=userId).first()
        if hasBlog:
            title = hasBlog.title
            theme = hasBlog.them
        return render(request, 'users/center_add_blogs.html', locals())

    def post(self, request):
        if request.is_ajax():
            user = request.user.pk
            title = request.POST.get('title')
            theme = request.POST.get('theme')
            response = {'pass': True}
            if all([user, title, theme]):
                hasBlog = Blog.objects.filter(site=user)
                if hasBlog:
                    try:
                        hasBlog.update(title=title, them=theme)
                    except:
                        response['pass'] = False
                else:
                    try:
                        Blog.objects.create(title=title, site=user, them=theme)
                    except:
                        response['pass'] = False

            return HttpResponse(json.dumps(response))
        else:
            cnm = '爬虫提交，你他妈的'
            return HttpResponse(json.dumps(cnm))


class AddCategory(LoginRequiredMixin, View):
    '''
    添加分类
    '''

    def get(self, request):
        blogId = request.user.pk
        hasBlog = Blog.objects.filter(site=blogId).first()
        if hasBlog:
            title = hasBlog.title
        return render(request, 'users/center_add_categorys.html', locals())

    def post(self, request):
        if request.is_ajax():
            response = {}
            blogId = request.user.pk
            title = request.POST.get('title')
            hasCate = Category.objects.filter(title=title)
            if hasCate:
                response['pass'] = False
            else:
                try:
                    Category.objects.create(blog_id=blogId, title=title)
                    response['pass'] = True
                except:
                    response['pass'] = False
            return HttpResponse(json.dumps(response))
        else:
            cnm = '爬虫提交，你他妈的!'
            return HttpResponse(json.dumps(cnm))


class AddTags(LoginRequiredMixin, View):
    '''
    添加标签
    '''

    def get(self, request):
        blogId = request.user.pk
        hasBlog = Blog.objects.filter(site=blogId).first()
        if hasBlog:
            title = hasBlog.title
        return render(request, 'users/center_add_tags.html', locals())

    def post(self, request):
        if request.is_ajax():
            response = {}
            blogId = request.user.pk
            title = request.POST.get('title')
            hasTag = Tag.objects.filter(title=title)
            if hasTag:
                response['pass'] = False
            else:
                try:
                    Tag.objects.create(blog_id=blogId, title=title)
                    response['pass'] = True
                except:
                    response['pass'] = False
            return HttpResponse(json.dumps(response))
        else:
            cnm = '爬虫提交，你他妈的!'
            return HttpResponse(json.dumps(cnm))


class AddArticles(LoginRequiredMixin, View):
    '''
    添加文章
    '''

    def get(self, request):
        userId = request.user.pk
        all_category = Category.objects.all()
        all_tags = Tag.objects.all()
        return render(request, 'users/center_add_articles.html', locals())

    def post(self, request):
        if request.is_ajax():
            userId = request.user.pk
            title = request.POST.get('title')
            categoryId = request.POST.get('cateId')
            tagsId = request.POST.get('tagsId')
            content = request.POST.get('content')
            response = {'pass': True}
            if all([title, categoryId, tagsId, content]):
                soup = BeautifulSoup(content, 'html.parser')  # 对拿到的文章详情进行过滤，用来显示文章摘要
                # 非法标签删除操作 防止XSS攻击
                for t in soup.find_all():
                    if t.name == 'script':
                        t.decompose()
                desc = soup.text[0:200]  # 截取出文章内容的前150个字符串作为文章简介描述信息
                new_content = str(soup)  # 文章内容
                try:
                    # 新建文章对象
                    newArticle = Article.objects.create(
                        title=title, desc=desc, homeCategory_id=categoryId, user_id=userId
                    )
                    # 新建文章详情
                    article_id = newArticle.pk
                    ArticleDetail.objects.create(count=new_content, article_id=article_id)
                    # 新建文章标签关联
                    Article_to_Tag.objects.create(article_id=newArticle.pk, tag_id=tagsId)
                except:
                    response['pass'] = False
            return HttpResponse(json.dumps(response))
        else:
            cnm = '爬虫提交，你他妈的!'
            return HttpResponse(json.dumps(cnm))


class EditArticles(View, LoginRequiredMixin):
    '''
    修改文章详情
    '''

    def get(self, request, username, articleId):
        has_article = Article.objects.filter(pk=articleId).first()
        if not has_article:
            return render(request, 'blog/404.html')
        userId = request.user.pk
        all_category = Category.objects.filter(blog_id=userId).all()
        all_tags = Tag.objects.all()
        article_title = has_article.title
        article_detail = ArticleDetail.objects.filter(article=articleId).first().count
        return render(request, 'users/center_edit_article.html', locals())

    def post(self, request, username, articleId):
        if request.is_ajax():
            userId = request.user.pk
            title = request.POST.get('title')
            categoryId = request.POST.get('cateId')
            tagsId = request.POST.get('tagsId')
            content = request.POST.get('content')
            response = {'pass': True}
            if all([title, categoryId, tagsId, content]):
                soup = BeautifulSoup(content, 'html.parser')  # 对拿到的文章详情进行过滤，用来显示文章摘要
                # 非法标签删除操作 防止XSS攻击
                for t in soup.find_all():
                    if t.name == 'script':
                        t.decompose()
                desc = soup.text[0:200]  # 截取出文章内容的前150个字符串作为文章简介描述信息
                new_content = str(soup)  # 文章内容
                try:
                    # 更新文章对象
                    Article.objects.filter(pk=articleId).update(title=title,
                                                                desc=desc,
                                                                homeCategory_id=categoryId,
                                                                user_id=userId
                                                                )
                    # 更新文章详情
                    ArticleDetail.objects.filter(article_id=articleId).update(count=new_content, article_id=articleId)
                    # 更新标签关联
                    Article_to_Tag.objects.update(article_id=articleId, tag_id=tagsId)
                except:
                    response['pass'] = False
            else:
                response['pass'] = False
            return HttpResponse(json.dumps(response))
        else:
            cnm = '爬虫提交，你他妈的!'
            return HttpResponse(json.dumps(cnm))


class UserAvatarChange(LoginRequiredMixin, View):
    def post(self, request):
        if request.is_ajax():
            avatar_change = {'is_change': False, 'error_msg': None}
            user = request.user
            avatar_obj = request.FILES.get("avatar")  # 图片对象
            # 涉及到修改数据库尝试操作
            if avatar_obj:
                try:
                    user.avatar = avatar_obj
                    user.save()
                    avatar_change['is_change'] = True
                except:
                    avatar_change['error_msg'] = '头像修改失败,请稍后再试'
            return HttpResponse(json.dumps(avatar_change))
        else:
            cnm = '别搞骚操作,你他妈的。'
            return HttpResponse(json.dumps(cnm))
