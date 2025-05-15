# filepath: /home/moritz-elfeld/mc/firstApp/services/service/djangoapi/djangoapi/serializers.py
from rest_framework import serializers
from djangoapi import models

class HallenbadSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Hallenbad
        fields = '__all__'  

class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Restaurant
        fields = '__all__'

class FussballplatzSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Fussballplatz
        fields = '__all__'