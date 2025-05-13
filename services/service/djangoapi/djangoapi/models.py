from django.db import models
from django.contrib.gis.db import models as gismodels


class Hallenbad(models.Model):
    type = models.CharField(max_length=64)
    point_id = models.IntegerField(unique=True)
    name = models.CharField(max_length=255, null=True, blank=True)
    ort = models.CharField(max_length=255, null=True, blank=True)
    ort_bezeichnung = models.CharField(max_length=255, null=True, blank=True)
    strasse = models.CharField(max_length=255, null=True, blank=True)
    strasse_bezeichnung = models.CharField(max_length=255, null=True, blank=True)
    hausnr = models.CharField(max_length=10, null=True, blank=True)
    plz = models.CharField(max_length=10, null=True, blank=True)
    telefon = models.CharField(max_length=20, null=True, blank=True)
    fax = models.CharField(max_length=20, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    adresse = models.TextField(null=True, blank=True)
    oeffnungszeiten = models.JSONField(null=True, blank=True)  # Store opening hours as JSON
    geom = gismodels.PointField()  # Geospatial field for storing point data

    def __str__(self):
        return self.name or "Unnamed Hallenbad"