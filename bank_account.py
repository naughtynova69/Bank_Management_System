from datetime import datetime
from typing import List, Dict


class Transaction:
    """Represents a bank transaction"""
    
    def __init__(self, transaction_type: str, amount: float, balance_after: float, description: str = ""):
        self.timestamp = datetime.now()
        self.type = transaction_type
        self.amount = amount
        self.balance_after = balance_after
        self.description = description
    
    def __str__(self):
        return f"[{self.timestamp.strftime('%Y-%m-%d %H:%M:%S')}] {self.type}: ${self.amount:.2f} | Balance: ${self.balance_after:.2f} | {self.description}"


class Account:
    """Represents a bank account"""
    
    def __init__(self, account_number: str, account_holder: str, initial_balance: float = 0.0):
        self.account_number = account_number
        self.account_holder = account_holder
        self.balance = initial_balance
        self.transactions: List[Transaction] = []
        self.is_active = True
        
        if initial_balance > 0:
            self.transactions.append(
                Transaction("INITIAL", initial_balance, self.balance, "Account opened")
            )
    
    def deposit(self, amount: float, description: str = "") -> bool:
        """Deposit money into the account"""
        if amount <= 0:
            print("Error: Deposit amount must be positive")
            return False
        
        if not self.is_active:
            print("Error: Account is closed")
            return False
        
        self.balance += amount
        self.transactions.append(
            Transaction("DEPOSIT", amount, self.balance, description)
        )
        print(f"Successfully deposited ${amount:.2f}. New balance: ${self.balance:.2f}")
        return True
    
    def withdraw(self, amount: float, description: str = "") -> bool:
        """Withdraw money from the account"""
        if amount <= 0:
            print("Error: Withdrawal amount must be positive")
            return False
        
        if not self.is_active:
            print("Error: Account is closed")
            return False
        
        if amount > self.balance:
            print(f"Error: Insufficient funds. Current balance: ${self.balance:.2f}")
            return False
        
        self.balance -= amount
        self.transactions.append(
            Transaction("WITHDRAWAL", amount, self.balance, description)
        )
        print(f"Successfully withdrew ${amount:.2f}. New balance: ${self.balance:.2f}")
        return True
    
    def get_balance(self) -> float:
        """Get current account balance"""
        return self.balance
    
    def get_transaction_history(self, limit: int = None) -> List[Transaction]:
        """Get transaction history"""
        if limit:
            return self.transactions[-limit:]
        return self.transactions
    
    def close_account(self):
        """Close the account"""
        self.is_active = False
        print(f"Account {self.account_number} has been closed")
    
    def to_dict(self) -> Dict:
        """Convert account to dictionary for storage"""
        return {
            'account_number': self.account_number,
            'account_holder': self.account_holder,
            'balance': self.balance,
            'is_active': self.is_active
        }
    
    def __str__(self):
        status = "Active" if self.is_active else "Closed"
        return f"Account #{self.account_number} | {self.account_holder} | Balance: ${self.balance:.2f} | Status: {status}"
