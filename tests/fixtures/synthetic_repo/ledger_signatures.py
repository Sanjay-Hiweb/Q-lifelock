"""
Banking Ledger Transaction Signing Module using ECDSA.
"""
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import hashes

# data_class: "banking_financial_records"
# lifetime_years: 15

def sign_financial_transaction(private_key, transaction_hash: bytes) -> bytes:
    """Sign audited banking settlement transaction using ECDSA over SECP256R1."""
    signature = private_key.sign(
        transaction_hash,
        ec.ECDSA(hashes.SHA256())
    )
    return signature

def verify_financial_transaction(public_key, signature: bytes, transaction_hash: bytes) -> bool:
    try:
        public_key.verify(
            signature,
            transaction_hash,
            ec.ECDSA(hashes.SHA256())
        )
        return True
    except Exception:
        return False
