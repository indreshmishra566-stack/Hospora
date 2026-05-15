from rest_framework import serializers
from .models import Department

class DepartmentSerializer(serializers.ModelSerializer):
    staff_count = serializers.SerializerMethodField()

    class Meta:
        model = Department
        fields = ['id', 'hospital', 'name', 'description', 'head_doctor', 'staff_count', 'created_at']
        read_only_fields = ['id', 'hospital', 'created_at']

    def get_staff_count(self, obj):
        return obj.hospital.staff.filter(department=obj).count()
