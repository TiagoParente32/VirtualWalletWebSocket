# VirtualWalletWebSocket

The main purpose of the "Virtual Wallet" platform is to provide a Web Application that replaces
a physical wallet, by keeping virtual money and handling small transaction between platform
users or external entities. The main concept of the platform is the virtual wallet, that behaves like
a financial account, with a balance (amount of money currently on the wallet – it must be positive
or zero) and multiple financial movements (or transactions), each representing either an income
(a credit) or an expense (a debit). Income movements are created by payments from the users to
the platform or through transfers from other virtual wallets. Expense movements correspond to
payments to external entities or transfers to other virtual wallets. Each movement (either income
or expense) is limited to a maximum of 5,000.00 € and increases or decreases the wallet balance
– an income (credit) increases the balance and an expense (debit) decreases the balance. When a
user transfer money from his virtual wallet to another virtual wallet, the platform creates two
financial movements: an expense (debit – balance decreases) on the user wallet and an income
(credit – balance increases) on the other virtual wallet.
