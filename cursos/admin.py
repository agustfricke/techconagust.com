from django.contrib import admin
from . models import Curso, Review, Comprador
admin.site.register(Comprador)
admin.site.register(Review)
admin.site.register(Curso)