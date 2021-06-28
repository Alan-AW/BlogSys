from django import template
from django.db.models import Count
from blog.models import *

register = template.Library()


@register.inclusion_tag('blog/archive_msg.html')
def get_classification_style(username):
    user = UserInfo.objects.filter(username=username).first()  # 单独查询是否存在可以用exists()
    blog = user.blog
    # 显示部分作者信息
    username = user.username
    user_nick_name = user.nick_name
    user_email = user.email
    user_signature = user.signature
    # 查询当前站点的每一个文章的分类数
    cate_list = Category.objects.filter(blog=blog).values('pk').annotate(c=Count('article__title')).values_list('title', 'c')

    # 查询当前站点的每一个标签以及对应的文章数
    tag_list = Tag.objects.filter(blog=blog).values('pk').annotate(c=Count('article')).values_list('title', 'c')

    # ***************  查询当前站点的每一个日期所对应的文章数一  **********
    # 属于  ：  单表分组查询  date_format 过滤
    date_list = Article.objects.filter(user=user) \
        .extra(select={'y-m_date': 'date_format(create_time,"%%Y/%%m")'}) \
        .values('y-m_date') \
        .annotate(c=Count('nid')) \
        .values_list('y-m_date', 'c')
    # ***************  查询当前站点的每一个日期所对应的文章数二  **********
    '''
    from django.db.models.functions import TruncMonth  # TruncDate、TruncHour.....
    # 1:截断日期到月份，添加到显示列表，相当于多加了一个month属性 使用 .values('month') 可以看到这个值
    # 2:相当于 Group By month
    # 3:统计id字段的数量
    # 4:显示最终的统计信息

    date_list2 = Article.objects.filter(user=user) \
        .annotate(month=TruncMonth('create_time')) \
        .values('month') \
        .annotate(c=Count('nid')) \
        .values_list('month', 'c')
        # print(date_list)  # <QuerySet [{'month': datetime.datetime(2021, 4, 1, 0, 0), 'c': 5}]>

    '''

    return {'blog': blog,
            'cate_list': cate_list,
            'tag_list': tag_list,
            'date_list': date_list,
            'username': username,
            'user_nick_name': user_nick_name,
            'user_email': user_email,
            'user_signature': user_signature
        }
