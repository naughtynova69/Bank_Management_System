from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import AccountViewSet, TransactionViewSet, transfer, bank_summary

router = DefaultRouter()
router.register(r'accounts', AccountViewSet, basename='account')
router.register(r'transactions', TransactionViewSet, basename='transaction')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/transfer/', transfer, name='api-transfer'),
    path('api/summary/', bank_summary, name='api-summary'),
]

