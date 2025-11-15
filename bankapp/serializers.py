from rest_framework import serializers
from .models import Account, Transaction


class TransactionSerializer(serializers.ModelSerializer):
    """Serializer for Transaction model"""
    transaction_type_display = serializers.CharField(source='get_transaction_type_display', read_only=True)
    
    class Meta:
        model = Transaction
        fields = ['id', 'transaction_type', 'transaction_type_display', 'amount', 
                 'balance_after', 'description', 'timestamp']
        read_only_fields = ['id', 'timestamp']


class AccountSerializer(serializers.ModelSerializer):
    """Serializer for Account model"""
    transaction_count = serializers.IntegerField(source='get_transaction_count', read_only=True)
    transactions = TransactionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Account
        fields = ['account_number', 'account_holder', 'balance', 'is_active', 
                 'created_at', 'updated_at', 'transaction_count', 'transactions']
        read_only_fields = ['account_number', 'created_at', 'updated_at']


class AccountListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for account list"""
    transaction_count = serializers.IntegerField(source='get_transaction_count', read_only=True)
    
    class Meta:
        model = Account
        fields = ['account_number', 'account_holder', 'balance', 'is_active', 
                 'created_at', 'transaction_count']


class CreateAccountSerializer(serializers.ModelSerializer):
    """Serializer for creating a new account"""
    initial_balance = serializers.DecimalField(max_digits=15, decimal_places=2, 
                                              default=0.00, write_only=True, required=False)
    
    class Meta:
        model = Account
        fields = ['account_holder', 'initial_balance']
    
    def create(self, validated_data):
        initial_balance = validated_data.pop('initial_balance', 0)
        
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
            account_holder=validated_data['account_holder'],
            balance=initial_balance
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
        
        return account


class DepositSerializer(serializers.Serializer):
    """Serializer for deposit operation"""
    amount = serializers.DecimalField(max_digits=15, decimal_places=2, min_value=0.01)
    description = serializers.CharField(required=False, allow_blank=True)


class WithdrawSerializer(serializers.Serializer):
    """Serializer for withdraw operation"""
    amount = serializers.DecimalField(max_digits=15, decimal_places=2, min_value=0.01)
    description = serializers.CharField(required=False, allow_blank=True)


class TransferSerializer(serializers.Serializer):
    """Serializer for transfer operation"""
    from_account = serializers.CharField()
    to_account = serializers.CharField()
    amount = serializers.DecimalField(max_digits=15, decimal_places=2, min_value=0.01)
    
    def validate(self, data):
        if data['from_account'] == data['to_account']:
            raise serializers.ValidationError("Source and destination accounts cannot be the same.")
        return data

