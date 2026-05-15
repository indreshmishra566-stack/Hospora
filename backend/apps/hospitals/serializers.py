from rest_framework import serializers
from .models import Hospital


class HospitalSerializer(serializers.ModelSerializer):
    has_pharmacy = serializers.ReadOnlyField()
    has_lab = serializers.ReadOnlyField()
    has_multi_branch = serializers.ReadOnlyField()
    max_doctors = serializers.ReadOnlyField()

    class Meta:
        model = Hospital
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class HospitalUpgradeSerializer(serializers.Serializer):
    plan = serializers.ChoiceField(choices=['basic', 'advanced', 'enterprise'])
