"""Hospital models - the root tenant entity."""

from django.db import models


class Hospital(models.Model):
    PLAN_CHOICES = [
        ('basic', 'Basic'),
        ('advanced', 'Advanced'),
        ('enterprise', 'Enterprise'),
    ]
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('suspended', 'Suspended'),
        ('trial', 'Trial'),
    ]

    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, default='US')
    logo = models.ImageField(upload_to='hospital_logos/', blank=True, null=True)
    plan = models.CharField(max_length=20, choices=PLAN_CHOICES, default='trial')
    subscription_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='trial')
    total_beds = models.PositiveIntegerField(default=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    @property
    def has_pharmacy(self):
        return self.plan in ['advanced', 'enterprise']

    @property
    def has_lab(self):
        return self.plan in ['advanced', 'enterprise']

    @property
    def has_multi_branch(self):
        return self.plan == 'enterprise'

    @property
    def max_doctors(self):
        limits = {'basic': 5, 'advanced': 20, 'enterprise': None, 'trial': 3}
        return limits.get(self.plan, 3)
