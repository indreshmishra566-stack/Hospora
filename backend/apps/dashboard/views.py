"""Dashboard analytics API - stats, trends, recent data."""

from django.urls import path
from django.db.models import Count, Sum, Q
from django.utils import timezone
from datetime import timedelta
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.patients.models import Patient
from apps.appointments.models import Appointment
from apps.billing.models import Invoice
from apps.users.models import User


def get_hospital(request):
    return request.user.hospital


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """Main dashboard stats cards."""
    h = get_hospital(request)
    today = timezone.now().date()
    this_month_start = today.replace(day=1)

    total_patients = Patient.objects.filter(hospital=h).count()
    today_appointments = Appointment.objects.filter(hospital=h, appointment_date=today).count()
    monthly_revenue = Invoice.objects.filter(
        hospital=h, status='paid',
        created_at__date__gte=this_month_start
    ).aggregate(t=Sum('total'))['t'] or 0
    total_staff = User.objects.filter(hospital=h, is_active=True).count()
    pending_invoices = Invoice.objects.filter(hospital=h, status='pending').count()
    available_beds = h.total_beds - Appointment.objects.filter(
        hospital=h, status='in_progress', appointment_date=today
    ).count()

    return Response({
        'total_patients': total_patients,
        'today_appointments': today_appointments,
        'monthly_revenue': float(monthly_revenue),
        'total_staff': total_staff,
        'pending_invoices': pending_invoices,
        'available_beds': max(0, available_beds),
        'total_beds': h.total_beds,
        'hospital_plan': h.plan,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def revenue_trends(request):
    """Revenue for last 7 days."""
    h = get_hospital(request)
    today = timezone.now().date()
    data = []
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        revenue = Invoice.objects.filter(
            hospital=h, status='paid', created_at__date=day
        ).aggregate(t=Sum('total'))['t'] or 0
        appointments = Appointment.objects.filter(hospital=h, appointment_date=day).count()
        data.append({
            'date': day.strftime('%b %d'),
            'revenue': float(revenue),
            'appointments': appointments,
        })
    return Response(data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recent_appointments(request):
    """Recent 10 appointments."""
    h = get_hospital(request)
    appts = Appointment.objects.filter(hospital=h).select_related(
        'patient', 'doctor', 'department'
    ).order_by('-created_at')[:10]

    data = [{
        'id': a.id,
        'patient_name': a.patient.name,
        'patient_id': a.patient.patient_id,
        'doctor_name': a.doctor.name if a.doctor else 'N/A',
        'department': a.department.name if a.department else 'N/A',
        'date': a.appointment_date,
        'time': a.appointment_time,
        'status': a.status,
        'type': a.type,
    } for a in appts]
    return Response(data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def appointment_status_breakdown(request):
    """Appointment status pie chart data."""
    h = get_hospital(request)
    data = Appointment.objects.filter(hospital=h).values('status').annotate(count=Count('id'))
    return Response(list(data))


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def patient_growth(request):
    """New patients per month (last 6 months)."""
    h = get_hospital(request)
    today = timezone.now().date()
    data = []
    for i in range(5, -1, -1):
        month_start = (today.replace(day=1) - timedelta(days=30 * i))
        month_start = month_start.replace(day=1)
        if month_start.month == 12:
            month_end = month_start.replace(year=month_start.year + 1, month=1, day=1)
        else:
            month_end = month_start.replace(month=month_start.month + 1, day=1)
        count = Patient.objects.filter(
            hospital=h,
            created_at__date__gte=month_start,
            created_at__date__lt=month_end
        ).count()
        data.append({'month': month_start.strftime('%b'), 'patients': count})
    return Response(data)


urlpatterns = [
    path('stats/', dashboard_stats, name='dashboard-stats'),
    path('revenue-trends/', revenue_trends, name='revenue-trends'),
    path('recent-appointments/', recent_appointments, name='recent-appointments'),
    path('appointment-breakdown/', appointment_status_breakdown, name='appointment-breakdown'),
    path('patient-growth/', patient_growth, name='patient-growth'),
]
