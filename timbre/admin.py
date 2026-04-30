from django.contrib import admin
from .models import Institucion, Sede

@admin.register(Institucion)
class InstitucionAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'ruc', 'activo')
    search_fields = ('nombre',)

@admin.register(Sede)
class SedeAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'codigo', 'institucion', 'activo')
    list_filter = ('institucion', 'activo')