from django.contrib import admin
from .models import *

# Register your models here.

# 登记
admin.site.register(Article)
admin.site.register(UserInfo)
admin.site.register(Blog)
admin.site.register(Tag)
admin.site.register(Category)
admin.site.register(Comment)
admin.site.register(ArticleUpDown)
admin.site.register(ArticleDetail)
admin.site.register(Article_to_Tag)
admin.site.register(LeaveMsg)
