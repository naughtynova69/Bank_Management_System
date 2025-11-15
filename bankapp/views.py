from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.db.models import Sum, Count
from django.db import transaction as db_transaction
from .models import Account, Transaction
from .forms import AccountForm, DepositForm, WithdrawForm, TransferForm


def home(request):
    """Home page with bank summary"""
    total_accounts = Account.objects.count()
    active_accounts = Account.objects.filter(is_active=True).count()
    total_deposits = Account.objects.aggregate(total=Sum('balance'))['total'] or 0
    total_transactions = Transaction.objects.count()
    
    context = {
        'total_accounts': total_accounts,
        'active_accounts': active_accounts,
        'total_deposits': total_deposits,
        'total_transactions': total_transactions,
    }
    return render(request, 'bankapp/home.html', context)


def account_list(request):
    """List all accounts"""
    accounts = Account.objects.all()
    context = {'accounts': accounts}
    return render(request, 'bankapp/account_list.html', context)


def account_detail(request, account_number):
    """View account details and transactions"""
    account = get_object_or_404(Account, account_number=account_number)
    transactions = account.transactions.all()[:50]  # Last 50 transactions
    
    context = {
        'account': account,
        'transactions': transactions,
    }
    return render(request, 'bankapp/account_detail.html', context)


def create_account(request):
    """Create a new account"""
    if request.method == 'POST':
        form = AccountForm(request.POST)
        if form.is_valid():
            # Generate account number
            last_account = Account.objects.order_by('-account_number').first()
            if last_account:
                try:
                    next_num = int(last_account.account_number) + 1
                except ValueError:
                    next_num = 1001
            else:
                next_num = 1001
            
            account = Account.objects.create(
                account_number=str(next_num),
                account_holder=form.cleaned_data['account_holder'],
                balance=form.cleaned_data.get('initial_balance', 0)
            )
            
            # Create initial transaction if balance > 0
            if account.balance > 0:
                Transaction.objects.create(
                    account=account,
                    transaction_type='INITIAL',
                    amount=account.balance,
                    balance_after=account.balance,
                    description='Account opened'
                )
            
            messages.success(request, f'Account {account.account_number} created successfully!')
            return redirect('account_detail', account_number=account.account_number)
    else:
        form = AccountForm()
    
    return render(request, 'bankapp/create_account.html', {'form': form})


def deposit(request, account_number):
    """Deposit money into an account"""
    account = get_object_or_404(Account, account_number=account_number)
    
    if request.method == 'POST':
        form = DepositForm(request.POST)
        if form.is_valid():
            try:
                account.deposit(
                    form.cleaned_data['amount'],
                    form.cleaned_data.get('description', '')
                )
                messages.success(request, f'Successfully deposited ${form.cleaned_data["amount"]}. New balance: ${account.balance}')
                return redirect('account_detail', account_number=account_number)
            except ValueError as e:
                messages.error(request, str(e))
    else:
        form = DepositForm()
    
    return render(request, 'bankapp/deposit.html', {'form': form, 'account': account})


def withdraw(request, account_number):
    """Withdraw money from an account"""
    account = get_object_or_404(Account, account_number=account_number)
    
    if request.method == 'POST':
        form = WithdrawForm(request.POST)
        if form.is_valid():
            try:
                account.withdraw(
                    form.cleaned_data['amount'],
                    form.cleaned_data.get('description', '')
                )
                messages.success(request, f'Successfully withdrew ${form.cleaned_data["amount"]}. New balance: ${account.balance}')
                return redirect('account_detail', account_number=account_number)
            except ValueError as e:
                messages.error(request, str(e))
    else:
        form = WithdrawForm()
    
    return render(request, 'bankapp/withdraw.html', {'form': form, 'account': account})


def transfer(request):
    """Transfer money between accounts"""
    if request.method == 'POST':
        form = TransferForm(request.POST)
        if form.is_valid():
            from_account = form.cleaned_data['from_account']
            to_account = form.cleaned_data['to_account']
            amount = form.cleaned_data['amount']
            
            try:
                with db_transaction.atomic():
                    # Withdraw from source
                    from_account.withdraw(amount, f'Transfer to account {to_account.account_number}')
                    
                    # Deposit to destination
                    to_account.deposit(amount, f'Transfer from account {from_account.account_number}')
                
                messages.success(request, f'Successfully transferred ${amount} from account {from_account.account_number} to {to_account.account_number}')
                return redirect('account_detail', account_number=from_account.account_number)
            except ValueError as e:
                messages.error(request, str(e))
    else:
        form = TransferForm()
    
    return render(request, 'bankapp/transfer.html', {'form': form})


def close_account(request, account_number):
    """Close an account"""
    account = get_object_or_404(Account, account_number=account_number)
    
    if request.method == 'POST':
        account.close_account()
        messages.success(request, f'Account {account_number} has been closed')
        return redirect('account_list')
    
    return render(request, 'bankapp/close_account.html', {'account': account})

