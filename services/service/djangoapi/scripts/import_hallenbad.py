import os
import sys
import json
from django.core.management.base import BaseCommand
from django.contrib.gis.geos import Point
# from djangoapi import models
sys.path.append('../')

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "djangoapi.settings")

import django
django.setup()

from djangoapi.models import Hallenbad


print("Importing Hallenbad data...")
#try:
with open('./data/hallenbad.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

    for feature in data['features']:
        properties = feature['properties']
        geometry = feature['geometry']

        # Only map the fields that exist in the model
        hallenbad, created = Hallenbad.objects.get_or_create(
            point_id=properties.get('point_id'),
            defaults={
                'type': properties.get('type'),
                'name': properties.get('name'),
                'ort': properties.get('ort'),
                'ort_bezeichnung': properties.get('ort_bezeichnung'),
                'strasse': properties.get('strasse_bezeichnung'),
                'hausnr': properties.get('hausnr'),
                'plz': properties.get('plz'),
                'telefon': properties.get('telefon'),
                'fax': properties.get('fax'),
                'email': properties.get('email'),
                'adresse': properties.get('adresse'),
                'oeffnungszeiten': properties.get('oeffnungszeiten'),
                'geom': Point(geometry['coordinates'][0], geometry['coordinates'][1]),
            }
        )
            #if created:
                #self.stdout.write(self.style.SUCCESS(f"Created Hallenbad: {hallenbad.name}"))
           # else:
                #self.stdout.write(self.style.WARNING(f"Skipped existing Hallenbad: {hallenbad.name}"))

#except FileNotFoundError:
    #self.stderr.write(self.style.ERROR(f"File not found."))
#except json.JSONDecodeError:
    #self.stderr.write(self.style.ERROR(f"Invalid JSON format in file."))