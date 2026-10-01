"""
Secure Telehealth Key Agreement Service using Elliptic Curve Diffie-Hellman.
"""
from cryptography.hazmat.primitives.asymmetric import ec

# Critical Data Class: Long-term Protected Health Information (HIPAA)
# data_class: "patient_health_records"
# lifetime_years: 30

class TelehealthSessionExchange:
    def __init__(self):
        # Generate ephemeral or static EC key for ECDH agreement
        self.server_private_key = ec.generate_private_key(ec.SECP384R1())

    def derive_shared_secret(self, client_public_key) -> bytes:
        """Derive session encryption key using ECDH."""
        shared_key = self.server_private_key.exchange(
            ec.ECDH(),
            client_public_key
        )
        return shared_key
