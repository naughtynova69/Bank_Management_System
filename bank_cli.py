#!/usr/bin/env python3
"""
Bank Management System - Command Line Interface
"""

from bank import Bank
from bank_account import Account


def print_menu():
    """Display the main menu"""
    print("\n" + "="*50)
    print("    BANK MANAGEMENT SYSTEM")
    print("="*50)
    print("1.  Create New Account")
    print("2.  Deposit Money")
    print("3.  Withdraw Money")
    print("4.  Transfer Money")
    print("5.  Check Balance")
    print("6.  View Transaction History")
    print("7.  List All Accounts")
    print("8.  Close Account")
    print("9.  Bank Summary")
    print("10. Save Data")
    print("11. Load Data")
    print("0.  Exit")
    print("="*50)


def get_float_input(prompt: str) -> float:
    """Get and validate float input"""
    while True:
        try:
            value = float(input(prompt))
            return value
        except ValueError:
            print("Invalid input. Please enter a valid number.")


def get_account_number(prompt: str = "Enter account number: ") -> str:
    """Get account number from user"""
    return input(prompt).strip()


def create_account(bank: Bank):
    """Create a new account"""
    print("\n--- Create New Account ---")
    account_holder = input("Enter account holder name: ").strip()
    
    if not account_holder:
        print("Error: Account holder name cannot be empty")
        return
    
    initial_balance = get_float_input("Enter initial deposit (or 0): $")
    bank.create_account(account_holder, initial_balance)


def deposit_money(bank: Bank):
    """Deposit money into an account"""
    print("\n--- Deposit Money ---")
    account_number = get_account_number()
    account = bank.get_account(account_number)
    
    if account:
        amount = get_float_input("Enter deposit amount: $")
        description = input("Enter description (optional): ").strip()
        account.deposit(amount, description)


def withdraw_money(bank: Bank):
    """Withdraw money from an account"""
    print("\n--- Withdraw Money ---")
    account_number = get_account_number()
    account = bank.get_account(account_number)
    
    if account:
        amount = get_float_input("Enter withdrawal amount: $")
        description = input("Enter description (optional): ").strip()
        account.withdraw(amount, description)


def transfer_money(bank: Bank):
    """Transfer money between accounts"""
    print("\n--- Transfer Money ---")
    from_account = get_account_number("Enter source account number: ")
    to_account = get_account_number("Enter destination account number: ")
    amount = get_float_input("Enter transfer amount: $")
    
    bank.transfer(from_account, to_account, amount)


def check_balance(bank: Bank):
    """Check account balance"""
    print("\n--- Check Balance ---")
    account_number = get_account_number()
    account = bank.get_account(account_number)
    
    if account:
        print(f"\nAccount: {account.account_holder}")
        print(f"Account Number: {account.account_number}")
        print(f"Current Balance: ${account.get_balance():.2f}")
        print(f"Status: {'Active' if account.is_active else 'Closed'}")


def view_transaction_history(bank: Bank):
    """View transaction history for an account"""
    print("\n--- Transaction History ---")
    account_number = get_account_number()
    account = bank.get_account(account_number)
    
    if account:
        transactions = account.get_transaction_history()
        
        if not transactions:
            print("No transactions found")
            return
        
        print(f"\nTransaction History for Account {account_number} ({account.account_holder})")
        print("-" * 80)
        
        for transaction in transactions:
            print(transaction)
        
        print("-" * 80)
        print(f"Total Transactions: {len(transactions)}")


def close_account(bank: Bank):
    """Close an account"""
    print("\n--- Close Account ---")
    account_number = get_account_number()
    account = bank.get_account(account_number)
    
    if account:
        confirm = input(f"Are you sure you want to close account {account_number}? (yes/no): ").strip().lower()
        if confirm == 'yes':
            bank.close_account(account_number)
        else:
            print("Account closure cancelled")


def bank_summary(bank: Bank):
    """Display bank summary"""
    print(f"\n{'='*50}")
    print(f"  BANK SUMMARY")
    print(f"{'='*50}")
    print(bank)
    print(f"{'='*50}")


def main():
    """Main application loop"""
    bank = Bank("MyBank")
    
    print("\n*** Welcome to Bank Management System ***")
    
    while True:
        print_menu()
        choice = input("\nEnter your choice (0-11): ").strip()
        
        if choice == '1':
            create_account(bank)
        elif choice == '2':
            deposit_money(bank)
        elif choice == '3':
            withdraw_money(bank)
        elif choice == '4':
            transfer_money(bank)
        elif choice == '5':
            check_balance(bank)
        elif choice == '6':
            view_transaction_history(bank)
        elif choice == '7':
            bank.list_all_accounts()
        elif choice == '8':
            close_account(bank)
        elif choice == '9':
            bank_summary(bank)
        elif choice == '10':
            filename = input("Enter filename to save (default: bank_data.json): ").strip()
            bank.save_to_file(filename if filename else "bank_data.json")
        elif choice == '11':
            filename = input("Enter filename to load (default: bank_data.json): ").strip()
            bank.load_from_file(filename if filename else "bank_data.json")
        elif choice == '0':
            save_prompt = input("Do you want to save data before exiting? (yes/no): ").strip().lower()
            if save_prompt == 'yes':
                bank.save_to_file()
            print("\nThank you for using Bank Management System!")
            print("Goodbye!")
            break
        else:
            print("Invalid choice. Please try again.")
        
        input("\nPress Enter to continue...")


if __name__ == "__main__":
    main()
