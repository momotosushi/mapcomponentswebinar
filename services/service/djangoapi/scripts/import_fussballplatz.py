import os, sys, json
from django.core.management.base import BaseCommand
from django.contrib.gis.geos import Point

sys.path.append('../')
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "djangoapi.settings")

import django
django.setup()

from djangoapi.models import Fussballplatz

print("Importing Hallenbad data...")
with open('./data/fussballplatz.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

    for feature in data['features']:
        properties = feature['properties']
        geometry = feature['geometry']

        # Only map the fields that exist in the model
        fussballplatz, created = Fussballplatz.objects.get_or_create(
            name=properties.get('name'),
            defaults={
                'address': properties.get('address'),
                'verein': properties.get('verein'),
                'oeffnungszeiten': properties.get('oeffnungszeiten'),
                'geom': Point(geometry['coordinates'][0], geometry['coordinates'][1]),
            }
        )