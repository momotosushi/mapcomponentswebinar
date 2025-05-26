from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from djangoapi import models
from djangoapi.serializers.GetInfoSerializer import FussballplatzSerializer, HallenbadSerializer, RestaurantSerializer


@permission_classes((AllowAny,))
class GetInfo(APIView):
    def get(self, request):
        hallenbad_data = HallenbadSerializer(models.Hallenbad.objects.all(), many=True).data
        restaurant_data = RestaurantSerializer(models.Restaurant.objects.all(), many=True).data
        fussballplatz_data = FussballplatzSerializer(models.Fussballplatz.objects.all(), many=True).data

        if hallenbad_data is None:
            return Response(status=400)

        data = {
            "Hallenbad": hallenbad_data,
            "Restaurant": restaurant_data,
            "Fussballplatz": fussballplatz_data
        }

        return Response(data, status=200)
        
    def post(self, request):
          # Retrieve a single Hallenbad object
        # hallenbad_instance = models.Hallenbad.objects.filter(id=request.data['id']).first()
        hallenbad_instance = models.Hallenbad.objects.filter(id=1).first()
        hallenbad_instance = models.Hallenbad.objects.create(
            type='Hallenbad',
            point_id=request.data['id'],
            name='Test',
            ort='Test',
            ort_bezeichnung='Test',
            strasse='Test',
            strasse_bezeichnung='Test',
            hausnr='1',
            plz='12345',
            telefon='1234567890',
            fax='0987654321', )
        
        # Frankenbad
        if hallenbad_instance:
            hallenbad_instance.name = 'Test' 
            # hallenbad_instance.name = request.data['name'] 
            hallenbad_instance.save() 
            return Response()
        
        return Response(status=400)