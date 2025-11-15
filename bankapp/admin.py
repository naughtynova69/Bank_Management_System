from django.contrib import admin
from .models import Account, Transaction


@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ['account_number', 'account_holder', 'balance', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['account_number', 'account_holder']
    readonly_fields = ['account_number', 'created_at', 'updated_at']


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['account', 'transaction_type', 'amount', 'balance_after', 'timestamp']
    list_filter = ['transaction_type', 'timestamp']
    search_fields = ['account__account_number', 'account__account_holder', 'description']
    readonly_fields = ['timestamp']
    date_hierarchy = 'timestamp'

