from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import transaction as db_transaction
from .models import Account, Transaction
from .serializers import (
    AccountSerializer, AccountListSerializer, CreateAccountSerializer,
    TransactionSerializer, DepositSerializer, WithdrawSerializer, TransferSerializer
)


class AccountViewSet(viewsets.ModelViewSet):
    """ViewSet for Account operations"""
    queryset = Account.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CreateAccountSerializer
        elif self.action == 'list':
            return AccountListSerializer
        return AccountSerializer
    
    def get_queryset(self):
        queryset = Account.objects.all()
        is_active = self.request.query_params.get('is_active', None)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        return queryset.order_by('-created_at')
    
    def create(self, request, *args, **kwargs):
        serializer = CreateAccountSerializer(data=request.data)
        if serializer.is_valid():
            account = serializer.save()
            return Response(AccountSerializer(account).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def deposit(self, request, pk=None):
        """Deposit money into an account"""
        account = self.get_object()
        serializer = DepositSerializer(data=request.data)
        
        if serializer.is_valid():
            try:
                account.deposit(
                    serializer.validated_data['amount'],
                    serializer.validated_data.get('description', '')
                )
                return Response({
                    'message': f'Successfully deposited ${serializer.validated_data["amount"]}',
                    'account': AccountSerializer(account).data
                }, status=status.HTTP_200_OK)
            except ValueError as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def withdraw(self, request, pk=None):
        """Withdraw money from an account"""
        account = self.get_object()
        serializer = WithdrawSerializer(data=request.data)
        
        if serializer.is_valid():
            try:
                account.withdraw(
                    serializer.validated_data['amount'],
                    serializer.validated_data.get('description', '')
                )
                return Response({
                    'message': f'Successfully withdrew ${serializer.validated_data["amount"]}',
                    'account': AccountSerializer(account).data
                }, status=status.HTTP_200_OK)
            except ValueError as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def close(self, request, pk=None):
        """Close an account"""
        account = self.get_object()
        if not account.is_active:
            return Response({'error': 'Account is already closed'}, status=status.HTTP_400_BAD_REQUEST)
        
        account.close_account()
        return Response({
            'message': f'Account {account.account_number} has been closed',
            'account': AccountSerializer(account).data
        }, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['get'])
    def transactions(self, request, pk=None):
        """Get transactions for an account"""
        account = self.get_object()
        transactions = account.transactions.all()[:50]
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)


class TransactionViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Transaction operations (read-only)"""
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    
    def get_queryset(self):
        queryset = Transaction.objects.all()
        account_number = self.request.query_params.get('account', None)
        if account_number:
            queryset = queryset.filter(account__account_number=account_number)
        return queryset.order_by('-timestamp')


@api_view(['POST'])
def transfer(request):
    """Transfer money between accounts"""
    serializer = TransferSerializer(data=request.data)
    
    if serializer.is_valid():
        from_account = get_object_or_404(Account, account_number=serializer.validated_data['from_account'])
        to_account = get_object_or_404(Account, account_number=serializer.validated_data['to_account'])
        amount = serializer.validated_data['amount']
        
        try:
            with db_transaction.atomic():
                # Withdraw from source
                from_account.withdraw(amount, f'Transfer to account {to_account.account_number}')
                
                # Deposit to destination
                to_account.deposit(amount, f'Transfer from account {from_account.account_number}')
            
            return Response({
                'message': f'Successfully transferred ${amount} from account {from_account.account_number} to {to_account.account_number}',
                'from_account': AccountSerializer(from_account).data,
                'to_account': AccountSerializer(to_account).data
            }, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def bank_summary(request):
    """Get bank summary statistics"""
    from django.db.models import Sum, Count
    
    total_accounts = Account.objects.count()
    active_accounts = Account.objects.filter(is_active=True).count()
    total_deposits = Account.objects.aggregate(total=Sum('balance'))['total'] or 0
    total_transactions = Transaction.objects.count()
    
    return Response({
        'total_accounts': total_accounts,
        'active_accounts': active_accounts,
        'total_deposits': float(total_deposits),
        'total_transactions': total_transactions
    })

