from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Hospital
from .serializers import HospitalSerializer, HospitalUpgradeSerializer
from apps.core.mixins import make_role_permission

AdminOnly = make_role_permission('hospital_admin', 'super_admin')


class HospitalDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = HospitalSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user
        if user.role == 'super_admin':
            return Hospital.objects.get(pk=self.kwargs['pk'])
        return user.hospital


@api_view(['POST'])
@permission_classes([IsAuthenticated, AdminOnly])
def upgrade_hospital(request, pk):
    """Upgrade hospital plan."""
    hospital = request.user.hospital
    serializer = HospitalUpgradeSerializer(data=request.data)
    if serializer.is_valid():
        hospital.plan = serializer.validated_data['plan']
        hospital.subscription_status = 'active'
        hospital.save()
        return Response(HospitalSerializer(hospital).data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
