from django.contrib import admin
from .models import QueueTicket


@admin.register(QueueTicket)
class QueueTicketAdmin(admin.ModelAdmin):
    list_display = ['token_number', 'patient', 'doctor', 'department', 'status', 'priority', 'queue_date', 'hospital']
    list_filter = ['status', 'priority', 'queue_date', 'hospital']
    search_fields = ['patient__name', 'patient__patient_id', 'doctor__name']
