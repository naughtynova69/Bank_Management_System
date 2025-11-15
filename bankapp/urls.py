from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('accounts/', views.account_list, name='account_list'),
    path('accounts/create/', views.create_account, name='create_account'),
    path('accounts/<str:account_number>/', views.account_detail, name='account_detail'),
    path('accounts/<str:account_number>/deposit/', views.deposit, name='deposit'),
    path('accounts/<str:account_number>/withdraw/', views.withdraw, name='withdraw'),
    path('accounts/<str:account_number>/close/', views.close_account, name='close_account'),
    path('transfer/', views.transfer, name='transfer'),
]

