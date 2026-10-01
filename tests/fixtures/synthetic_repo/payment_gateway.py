"""
Payment Gateway Cardholder Data Encryption Service.
"""
from cryptography.hazmat.primitives.asymmetric import padding, rsa
from cryptography.hazmat.primitives import hashes

# data_class: "payment_card_pci"
# lifetime_years: 7
# key_size: 4096

def encrypt_credit_card_payload(rsa_public_key, card_payload: bytes) -> bytes:
    """Encrypt cardholder primary account number using RSA OAEP."""
    ciphertext = rsa_public_key.encrypt(
        card_payload,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )
    return ciphertext
