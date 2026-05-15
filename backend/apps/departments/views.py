from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from apps.core.mixins import HospitalScopedMixin
from .models import Department
from .serializers import DepartmentSerializer

class DepartmentViewSet(HospitalScopedMixin, viewsets.ModelViewSet):
    queryset = Department.objects.select_related('hospital', 'head_doctor')
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ['name']
    filter_backends = [filters.SearchFilter]
