
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response


@permission_classes((AllowAny,))
class GetInfo(APIView):
    def get(self, request):
        return Response("Hallo")
        
    def post(self, request):
        return Response("Test")

