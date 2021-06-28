import random
from io import BytesIO
from PIL import ImageDraw, Image, ImageFont
from django.views import View
from django.shortcuts import render, redirect, HttpResponse



# 验证码

class Get_random():
    def get_random_color(self):
        rgb = (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))
        return rgb

    def get_random_chr(self):
        chr_list = list()
        for i in range(5):
            self.random_chr = random.choice([str(random.randint(0, 9)),
                                             chr(random.randint(65, 90)),
                                             chr(random.randint(97, 122))])
            chr_list.append(self.random_chr)
        return chr_list


