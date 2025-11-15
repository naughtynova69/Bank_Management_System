from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal


class Account(models.Model):
    """Bank Account Model"""
    account_number = models.CharField(max_length=20, unique=True, primary_key=True)
    account_holder = models.CharField(max_length=200)
    balance = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal('0.00'), 
                                   validators=[MinValueValidator(Decimal('0.00'))])
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Account'
        verbose_name_plural = 'Accounts'
    
    def __str__(self):
        status = "Active" if self.is_active else "Closed"
        return f"Account #{self.account_number} | {self.account_holder} | ${self.balance} | {status}"
    
    def deposit(self, amount, description=""):
        """Deposit money into the account"""
        if amount <= 0:
            raise ValueError("Deposit amount must be positive")
        
        if not self.is_active:
            raise ValueError("Account is closed")
        
        self.balance += Decimal(str(amount))
        self.save()
        
        Transaction.objects.create(
            account=self,
            transaction_type='DEPOSIT',
            amount=Decimal(str(amount)),
            balance_after=self.balance,
            description=description
        )
        return self.balance
    
    def withdraw(self, amount, description=""):
        """Withdraw money from the account"""
        if amount <= 0:
            raise ValueError("Withdrawal amount must be positive")
        
        if not self.is_active:
            raise ValueError("Account is closed")
        
        if Decimal(str(amount)) > self.balance:
            raise ValueError(f"Insufficient funds. Current balance: ${self.balance}")
        
        self.balance -= Decimal(str(amount))
        self.save()
        
        Transaction.objects.create(
            account=self,
            transaction_type='WITHDRAWAL',
            amount=Decimal(str(amount)),
            balance_after=self.balance,
            description=description
        )
        return self.balance
    
    def close_account(self):
        """Close the account"""
        self.is_active = False
        self.save()
    
    def get_transaction_count(self):
        """Get total number of transactions"""
        return self.transactions.count()


class Transaction(models.Model):
    """Transaction Model"""
    TRANSACTION_TYPES = [
        ('INITIAL', 'Initial Deposit'),
        ('DEPOSIT', 'Deposit'),
        ('WITHDRAWAL', 'Withdrawal'),
        ('TRANSFER_IN', 'Transfer In'),
        ('TRANSFER_OUT', 'Transfer Out'),
    ]
    
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=15, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    balance_after = models.DecimalField(max_digits=15, decimal_places=2)
    description = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-timestamp']
        verbose_name = 'Transaction'
        verbose_name_plural = 'Transactions'
    
    def __str__(self):
        return f"[{self.timestamp.strftime('%Y-%m-%d %H:%M:%S')}] {self.get_transaction_type_display()}: ${self.amount} | Balance: ${self.balance_after}"

