import json
import os
from typing import Dict, Optional
from bank_account import Account, Transaction


class Bank:
    """Main bank management system"""
    
    def __init__(self, bank_name: str = "MyBank"):
        self.bank_name = bank_name
        self.accounts: Dict[str, Account] = {}
        self.next_account_number = 1001
    
    def create_account(self, account_holder: str, initial_balance: float = 0.0) -> Optional[Account]:
        """Create a new bank account"""
        if initial_balance < 0:
            print("Error: Initial balance cannot be negative")
            return None
        
        account_number = str(self.next_account_number)
        self.next_account_number += 1
        
        account = Account(account_number, account_holder, initial_balance)
        self.accounts[account_number] = account
        
        print(f"Account created successfully!")
        print(f"Account Number: {account_number}")
        print(f"Account Holder: {account_holder}")
        print(f"Initial Balance: ${initial_balance:.2f}")
        
        return account
    
    def get_account(self, account_number: str) -> Optional[Account]:
        """Retrieve an account by account number"""
        account = self.accounts.get(account_number)
        if not account:
            print(f"Error: Account {account_number} not found")
        return account
    
    def transfer(self, from_account_number: str, to_account_number: str, amount: float) -> bool:
        """Transfer money between accounts"""
        if amount <= 0:
            print("Error: Transfer amount must be positive")
            return False
        
        from_account = self.get_account(from_account_number)
        to_account = self.get_account(to_account_number)
        
        if not from_account or not to_account:
            return False
        
        if not from_account.is_active or not to_account.is_active:
            print("Error: One or both accounts are closed")
            return False
        
        if from_account.balance < amount:
            print(f"Error: Insufficient funds in account {from_account_number}")
            return False
        
        from_account.balance -= amount
        from_account.transactions.append(
            Transaction("TRANSFER_OUT", amount, from_account.balance, 
                       f"Transfer to account {to_account_number}")
        )
        
        to_account.balance += amount
        to_account.transactions.append(
            Transaction("TRANSFER_IN", amount, to_account.balance, 
                       f"Transfer from account {from_account_number}")
        )
        
        print(f"Successfully transferred ${amount:.2f} from account {from_account_number} to {to_account_number}")
        return True
    
    def list_all_accounts(self):
        """List all accounts in the bank"""
        if not self.accounts:
            print("No accounts found")
            return
        
        print(f"\n{'='*70}")
        print(f"{self.bank_name} - All Accounts")
        print(f"{'='*70}")
        for account in self.accounts.values():
            print(account)
        print(f"{'='*70}\n")
    
    def close_account(self, account_number: str) -> bool:
        """Close an account"""
        account = self.get_account(account_number)
        if not account:
            return False
        
        account.close_account()
        return True
    
    def save_to_file(self, filename: str = "bank_data.json"):
        """Save bank data to a JSON file"""
        data = {
            'bank_name': self.bank_name,
            'next_account_number': self.next_account_number,
            'accounts': {
                acc_num: account.to_dict() 
                for acc_num, account in self.accounts.items()
            }
        }
        
        try:
            with open(filename, 'w') as f:
                json.dump(data, f, indent=4)
            print(f"Bank data saved successfully to {filename}")
            return True
        except Exception as e:
            print(f"Error saving bank data: {e}")
            return False
    
    def load_from_file(self, filename: str = "bank_data.json"):
        """Load bank data from a JSON file"""
        if not os.path.exists(filename):
            print(f"File {filename} not found")
            return False
        
        try:
            with open(filename, 'r') as f:
                data = json.load(f)
            
            self.bank_name = data.get('bank_name', 'MyBank')
            self.next_account_number = data.get('next_account_number', 1001)
            
            self.accounts = {}
            for acc_num, acc_data in data.get('accounts', {}).items():
                account = Account(
                    acc_data['account_number'],
                    acc_data['account_holder'],
                    acc_data['balance']
                )
                account.is_active = acc_data.get('is_active', True)
                account.transactions = []
                self.accounts[acc_num] = account
            
            print(f"Bank data loaded successfully from {filename}")
            return True
        except Exception as e:
            print(f"Error loading bank data: {e}")
            return False
    
    def get_total_deposits(self) -> float:
        """Get total deposits across all accounts"""
        return sum(account.balance for account in self.accounts.values())
    
    def __str__(self):
        return f"{self.bank_name} - Total Accounts: {len(self.accounts)} | Total Deposits: ${self.get_total_deposits():.2f}"
