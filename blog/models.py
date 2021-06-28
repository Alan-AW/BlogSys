from django.db import models
from django.contrib.auth.models import AbstractUser
from ckeditor.fields import RichTextField  # 后台编辑器

# Create your models here.


class UserInfo(AbstractUser):
    '''
    用户信息
    '''
    nid = models.AutoField(primary_key=True)
    nick_name = models.CharField(verbose_name='昵称', max_length=32, default='起个好听的昵称吧~')
    tel = models.CharField(max_length=11, null=True, unique=True)  # 可以为空，不允许重复
    avatar = models.ImageField(upload_to='avatar/',blank=True)  # 上传头像的路径,默认图片(该用户没有上传图片的底图)
    signature = models.CharField(verbose_name='名人名言', max_length=50,default='说点什么吧！')  # 个性签名
    goal = models.CharField(verbose_name='人生目标',max_length=50,default='一条咸鱼，没有梦想...')
    has_goal = models.CharField(max_length=1,default='0')
    create_time = models.DateTimeField(verbose_name='创建时间', auto_now_add=True)
    blog = models.OneToOneField(to='Blog', to_field='nid', null=True, on_delete=models.CASCADE)  # 外键关联
    '''
    # 修改认证的字段为 手机号
    USERNAME_FIELD = 'mobile'
    #创建超级管理员必须输入的字段（不包括 手机号和密码）
    REQUIRED_FIELDS = ['username','email']
    '''
    def __str__(self):
        return self.username

    class Meta:
        db_table = 'userinfo'


class Blog(models.Model):
    '''
    博客信息
    '''
    nid = models.AutoField(primary_key=True)
    title = models.CharField(verbose_name='个人博客标题', max_length=64)
    site = models.CharField(verbose_name='个人博客后缀', max_length=32, unique=True)
    them = models.CharField(verbose_name='博客主题', max_length=32)

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'blog'


class Category(models.Model):
    '''
    博主个人文章分类表
    '''
    nid = models.AutoField(primary_key=True)
    title = models.CharField(verbose_name='分类标题',max_length=32,)
    blog = models.ForeignKey(verbose_name='所属博客',to='Blog',to_field='nid',on_delete=models.CASCADE)

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'category'


class Tag(models.Model):
    '''
    文章标签
    '''
    nid = models.AutoField(primary_key=True)
    title = models.CharField(verbose_name='标签名称',max_length=32)
    blog = models.ForeignKey(verbose_name='所属博客',to='Blog',to_field='nid',on_delete=models.CASCADE)

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'tag'


class Article(models.Model):
    '''
    文章表
    '''
    nid = models.AutoField(primary_key=True)
    title = models.CharField(max_length=64,verbose_name='文章标题')
    desc = models.CharField(max_length=255,verbose_name='文章描述')
    comment_count = models.IntegerField(default=0)  # 评论数
    up_count = models.IntegerField(default=0)  # 点赞数
    down_count = models.IntegerField(default=0)
    create_time = models.DateTimeField(verbose_name='创建时间',auto_now=True)
    homeCategory = models.ForeignKey(to='Category',to_field='nid',null=True,on_delete=models.CASCADE)  # 外键 关联到文章分类表，字段关联到 nid 可以为空
    user = models.ForeignKey(verbose_name='作者',to='UserInfo',to_field='nid',on_delete=models.CASCADE)  # 一对一，一对多关系cascade必写，多对多不屑
    tags = models.ManyToManyField(
        to='Tag',
        through='Article_to_Tag',
        through_fields=('article','tag'),
    )

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'article'


class ArticleDetail(models.Model):
    '''
    文章详细表
    '''
    nid = models.AutoField(primary_key=True)
    count = RichTextField()
    article = models.OneToOneField(to='Article',to_field='nid',on_delete=models.CASCADE)


class Comment(models.Model):
    '''
    评论表
    '''
    nid = models.AutoField(primary_key=True)
    article = models.ForeignKey(verbose_name='评论文章',to='Article',to_field='nid',on_delete=models.CASCADE)
    user = models.ForeignKey(verbose_name='评论者',to='UserInfo',to_field='nid',on_delete=models.CASCADE)
    content = models.CharField(verbose_name='评论内容',max_length=255)
    create_time = models.DateTimeField(verbose_name='评论时间',auto_now_add=True)
    parent_comment = models.ForeignKey('self',null=True,on_delete=models.CASCADE)  # 关联到本张表

    def __str__(self):
        return self.content

    class Meta:
        db_table = 'comment'


class ArticleUpDown(models.Model):
    '''
    点赞表
    '''
    nid = models.AutoField(primary_key=True)
    user = models.ForeignKey('UserInfo', null=True,on_delete=models.CASCADE)  # to='表名'  可以简写成  '表名'
    article = models.ForeignKey('Article',null=True,on_delete=models.CASCADE)  # 文章
    is_up = models.BooleanField(default=True)  # 默认点赞了的

    class Meta:
        unique_together = [  # 避免一模一样的文章和作者信息重复
            ('article', 'user')
        ]

        db_table = 'article_up_down'


class Article_to_Tag(models.Model):
    '''
    自定义文章和标签表
    '''
    nid = models.AutoField(primary_key=True)
    article = models.ForeignKey(verbose_name='文章',to='Article',to_field='nid',on_delete=models.CASCADE)
    tag = models.ForeignKey(verbose_name='标签',to='Tag',to_field='nid',on_delete=models.CASCADE)

    class Meta:
        # 文章和标签不能重复，联合唯一
        unique_together = [
            ('article','tag')
        ]
        db_table = 'article_to_tag'

    def __str__(self):
        v = self.article.title + '--' + self.tag.title
        return v

class LeaveMsg(models.Model):
    nick_name = models.CharField(null=True,max_length=20)
    content = models.CharField(max_length=500)
    leave_replay = models.ForeignKey('self', null=True, on_delete=models.CASCADE)
    create_time = models.DateTimeField(verbose_name='评论时间',auto_now_add=True)
    class Meta:
        db_table = 'leave_msg'







