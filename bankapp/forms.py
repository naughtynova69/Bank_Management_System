from django import forms
from .models import Account, Transaction


class AccountForm(forms.ModelForm):
    """Form for creating a new account"""
    initial_balance = forms.DecimalField(
        max_digits=15, 
        decimal_places=2, 
        required=False, 
        initial=0.00,
        widget=forms.NumberInput(attrs={'class': 'form-control', 'step': '0.01', 'min': '0'})
    )
    
    class Meta:
        model = Account
        fields = ['account_holder', 'initial_balance']
        widgets = {
            'account_holder': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter account holder name'}),
        }


class DepositForm(forms.Form):
    """Form for depositing money"""
    amount = forms.DecimalField(
        max_digits=15,
        decimal_places=2,
        widget=forms.NumberInput(attrs={'class': 'form-control', 'step': '0.01', 'min': '0.01', 'placeholder': 'Enter amount'})
    )
    description = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={'class': 'form-control', 'rows': 3, 'placeholder': 'Optional description'})
    )


class WithdrawForm(forms.Form):
    """Form for withdrawing money"""
    amount = forms.DecimalField(
        max_digits=15,
        decimal_places=2,
        widget=forms.NumberInput(attrs={'class': 'form-control', 'step': '0.01', 'min': '0.01', 'placeholder': 'Enter amount'})
    )
    description = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={'class': 'form-control', 'rows': 3, 'placeholder': 'Optional description'})
    )


class TransferForm(forms.Form):
    """Form for transferring money between accounts"""
    from_account = forms.ModelChoiceField(
        queryset=Account.objects.filter(is_active=True),
        widget=forms.Select(attrs={'class': 'form-control'}),
        empty_label="Select source account"
    )
    to_account = forms.ModelChoiceField(
        queryset=Account.objects.filter(is_active=True),
        widget=forms.Select(attrs={'class': 'form-control'}),
        empty_label="Select destination account"
    )
    amount = forms.DecimalField(
        max_digits=15,
        decimal_places=2,
        widget=forms.NumberInput(attrs={'class': 'form-control', 'step': '0.01', 'min': '0.01', 'placeholder': 'Enter amount'})
    )
    
    def clean(self):
        cleaned_data = super().clean()
        from_account = cleaned_data.get('from_account')
        to_account = cleaned_data.get('to_account')
        amount = cleaned_data.get('amount')
        
        if from_account and to_account:
            if from_account == to_account:
                raise forms.ValidationError("Source and destination accounts cannot be the same.")
            
            if amount and from_account.balance < amount:
                raise forms.ValidationError(f"Insufficient funds. Available balance: ${from_account.balance}")
        
        return cleaned_data

