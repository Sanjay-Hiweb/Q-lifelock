"""
IoT Firmware Manifest Signing Service.
"""
from cryptography.hazmat.primitives.asymmetric import padding, rsa
from cryptography.hazmat.primitives import hashes

# data_class: "intellectual_property_trade_secrets"
# lifetime_years: 25
# key_size: 4096

def sign_bootloader_image(firmware_signing_key, image_bytes: bytes) -> bytes:
    """Sign bootloader firmware image using RSA-PSS padding."""
    sig = firmware_signing_key.sign(
        image_bytes,
        padding.PSS(
            mgf=padding.MGF1(hashes.SHA256()),
            salt_length=padding.PSS.MAX_LENGTH
        ),
        hashes.SHA256()
    )
    return sig
