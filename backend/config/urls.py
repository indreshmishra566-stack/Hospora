"""Hospora URL Configuration"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),
    # API Schema
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    # API Routes
    path('api/auth/', include('apps.users.urls')),
    path('api/hospitals/', include('apps.hospitals.urls')),
    path('api/patients/', include('apps.patients.urls')),
    path('api/appointments/', include('apps.appointments.urls')),
    path('api/staff/', include('apps.users.staff_urls')),
    path('api/departments/', include('apps.departments.urls')),
    path('api/medical-records/', include('apps.medical_records.urls')),
    path('api/billing/', include('apps.billing.urls')),
    path('api/pharmacy/', include('apps.pharmacy.urls')),
    path('api/lab/', include('apps.lab.urls')),
    path('api/dashboard/', include('apps.dashboard.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
