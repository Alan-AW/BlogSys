from django.shortcuts import render, redirect, HttpResponse
from django import forms
import json
from django.forms import widgets
from django.core.exceptions import NON_FIELD_ERRORS, ValidationError
from blog.models import *
import re

class Reg_form(forms.Form):
    '''
    注册组件
    '''
    user = forms.CharField(
        max_length=16,
        min_length=3,
        error_messages={
            'required': '请输入昵称！',
            'min_length': '最短三个字符！',
            "invalid": "格式错误"
        }
    )
    pwd = forms.CharField(
        max_length=16,
        min_length=8,
        error_messages={
            'required': '请输入密码!',
            'min_length': '密码最少8位！'
        },
        widget=widgets.PasswordInput(attrs={})
    )
    re_pwd = forms.CharField(
        max_length=16,
        min_length=8,
        error_messages={
            'required': '再次输入密码！',
        },
        widget=widgets.PasswordInput(attrs={})
    )
    email = forms.EmailField(
        min_length=5,
        error_messages={
            'required': '请输入邮箱！',
            'invalid': '邮箱格式错误！'
        }
    )
    tel = forms.CharField(
        error_messages={
            'required': '请输入电话！',
            'invalid': '电话号码格式不对！',
        }
    )



