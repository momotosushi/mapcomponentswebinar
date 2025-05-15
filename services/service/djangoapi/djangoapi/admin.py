from django.contrib import admin
from djangoapi.models import Hallenbad, Restaurant, Fussballplatz

@admin.register(Hallenbad)
class HallenbadAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(Fussballplatz)
class FussballplatzAdmin(admin.ModelAdmin):
    list_display = ('name',)