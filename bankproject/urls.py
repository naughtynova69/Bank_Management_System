"""
URL configuration for bankproject project.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('bankapp.urls')),  # Keep old templates for backward compatibility
    path('', include('bankapp.api_urls')),  # API endpoints
]

