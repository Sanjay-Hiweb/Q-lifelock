"""Data Lifetime Engine and Categorization."""
from typing import Optional, Tuple
from .models import DataLifetimeCategory, DataSensitivity


def years_to_category(years: Optional[int]) -> DataLifetimeCategory:
    """Map explicit years to standardized Q-LIFELOCK lifetime categories."""
    if years is None:
        return DataLifetimeCategory.UNKNOWN
    if years < 1:
        return DataLifetimeCategory.UNDER_1_YEAR
    elif 1 <= years <= 3:
        return DataLifetimeCategory.Y1_TO_3
    elif 3 < years <= 5:
        return DataLifetimeCategory.Y3_TO_5
    elif 5 < years <= 10:
        return DataLifetimeCategory.Y5_TO_10
    elif 10 < years <= 20:
        return DataLifetimeCategory.Y10_TO_20
    elif 20 < years <= 30:
        return DataLifetimeCategory.Y20_TO_30
    else:
        return DataLifetimeCategory.OVER_30_YEARS


def category_to_default_years(cat: DataLifetimeCategory) -> Optional[int]:
    """Map category to conservative representative years."""
    mapping = {
        DataLifetimeCategory.UNDER_1_YEAR: 0,
        DataLifetimeCategory.Y1_TO_3: 2,
        DataLifetimeCategory.Y3_TO_5: 4,
        DataLifetimeCategory.Y5_TO_10: 8,
        DataLifetimeCategory.Y10_TO_20: 15,
        DataLifetimeCategory.Y20_TO_30: 25,
        DataLifetimeCategory.OVER_30_YEARS: 35,
        DataLifetimeCategory.UNKNOWN: None,
    }
    return mapping.get(cat)


def assess_hndl_exposure_window(
    analysis_year: int,
    lifetime_years: Optional[int],
    crqc_horizon_year: int,
) -> Tuple[bool, int]:
    """
    Evaluate Harvest Now Decrypt Later (HNDL) exposure window.
    
    Returns:
        (is_exposed_after_crqc, exposure_overlap_years)
        is_exposed_after_crqc: True if data confidentiality requirement extends beyond CRQC arrival.
        exposure_overlap_years: Number of years the data remains sensitive after CRQC is active.
    """
    if lifetime_years is None:
        return (False, 0)
    
    data_expiration_year = analysis_year + lifetime_years
    if data_expiration_year > crqc_horizon_year:
        overlap = data_expiration_year - crqc_horizon_year
        return (True, overlap)
    return (False, 0)


# Standard data class defaults based on regulatory frameworks (HIPAA, PCI-DSS, DoD, GDPR)
DATA_CLASS_PRESETS = {
    "patient_health_records": (DataSensitivity.CRITICAL, 30),  # HIPAA: 30+ yrs
    "banking_financial_records": (DataSensitivity.HIGH, 15),     # SOX / GLBA: 10-20 yrs
    "intellectual_property_trade_secrets": (DataSensitivity.CRITICAL, 25),
    "national_defense_classified": (DataSensitivity.CRITICAL, 40),
    "customer_pii_identity": (DataSensitivity.HIGH, 10),
    "payment_card_pci": (DataSensitivity.HIGH, 7),
    "user_passwords_credentials": (DataSensitivity.HIGH, 5),
    "api_session_tokens": (DataSensitivity.LOW, 0),             # < 1 year
    "ephemeral_handshake": (DataSensitivity.LOW, 0),
}


def infer_data_lifetime_preset(data_class_name: Optional[str]) -> Tuple[DataSensitivity, Optional[int]]:
    """Infer sensitivity and lifetime from declared data class preset if available."""
    if not data_class_name:
        return (DataSensitivity.UNKNOWN, None)
    clean_name = data_class_name.lower().replace("-", "_").strip()
    return DATA_CLASS_PRESETS.get(clean_name, (DataSensitivity.UNKNOWN, None))
