import os, sys, json
from django.core.management.base import BaseCommand
from django.contrib.gis.geos import Point

sys.path.append('../')
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "djangoapi.settings")

import django
django.setup()

from djangoapi.models import Restaurant

print("Importing Hallenbad data...")
with open('./data/restaurant_modified2.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

    for feature in data['features']:
        properties = feature['properties']
        geometry = feature['geometry']

        # Only map the fields that exist in the model
        restaurant, created = Restaurant.objects.get_or_create(
            name=properties.get('name'),
            defaults={
                'street': properties.get('street'),
                'housenumber': properties.get('housenumber'),
                'postcode': properties.get('postcode'),
                'city': properties.get('city'),
                'country': properties.get('country'),
                'cuisine': properties.get('cuisine'),
                'phone': properties.get('phone'),
                'email': properties.get('email'),
                'oeffnungszeiten': properties.get('oeffnungszeiten'),
                'geom': Point(geometry['coordinates'][0], geometry['coordinates'][1]),
            }
        )
        