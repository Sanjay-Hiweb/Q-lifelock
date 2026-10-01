"""
Authentication and Token Service using RSA Signatures.
"""
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes

# Classification metadata
# data_class: "user_passwords_credentials"
# lifetime_years: 5
# key_size: 2048

def generate_auth_keypair():
    """Generate RSA 2048-bit keypair for API authentication."""
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048
    )
    return private_key

def sign_session_jwt(private_key, token_payload: bytes) -> bytes:
    """Sign user authentication token using PKCS1v15 padding (RS256)."""
    signature = private_key.sign(
        token_payload,
        padding.PKCS1v15(),
        hashes.SHA256()
    )
    return signature

def verify_session_jwt(public_key, signature: bytes, token_payload: bytes) -> bool:
    """Verify user token signature."""
    try:
        public_key.verify(
            signature,
            token_payload,
            padding.PKCS1v15(),
            hashes.SHA256()
        )
        return True
    except Exception:
        return False
