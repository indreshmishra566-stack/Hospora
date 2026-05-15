from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from apps.core.mixins import HospitalScopedMixin, make_plan_permission
from .models import Medicine
from .serializers import MedicineSerializer

PharmacyAccess = make_plan_permission('advanced', 'enterprise')

class MedicineViewSet(HospitalScopedMixin, viewsets.ModelViewSet):
    queryset = Medicine.objects.select_related('hospital')
    serializer_class = MedicineSerializer
    permission_classes = [IsAuthenticated, PharmacyAccess]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_active']
    search_fields = ['name', 'generic_name', 'manufacturer']
    ordering_fields = ['name', 'stock', 'expiry_date']
