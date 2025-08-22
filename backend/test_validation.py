#!/usr/bin/env python3
"""Test script for validation functions"""

from utils.validation import validate_email, validate_password, validate_name, validate_property_data

def test_validation_system():
    print('=== Testing Email Validation ===')
    test_emails = ['test@example.com', 'invalid-email', '', 'test@.com']
    for email in test_emails:
        result = validate_email(email)
        print(f'{email}: Valid={result[0]}, Errors={result[1]}')

    print('\n=== Testing Password Validation ===')
    test_passwords = ['WeakPwd1!', 'weak', '', 'UPPERCASE123!', 'lowercase123!']
    for pwd in test_passwords:
        result = validate_password(pwd)
        print(f'{pwd}: Valid={result[0]}, Errors={result[1][:2]}...')

    print('\n=== Testing Name Validation ===')
    test_names = ['John Doe', 'A', '', 'John123', 'Mary-Jane O\'Connor']
    for name in test_names:
        result = validate_name(name)
        print(f'{name}: Valid={result[0]}, Errors={result[1]}')

    print('\n=== Testing Property Validation ===')
    valid_property = {
        'title': 'Beautiful Family Home',
        'property_type': 'house',
        'price': 350000,
        'address': '123 Main St',
        'city': 'Springfield',
        'state': 'IL',
        'zip_code': '62701',
        'bedrooms': 3,
        'bathrooms': 2
    }
    result = validate_property_data(valid_property)
    print(f'Valid property: Valid={result[0]}, Errors={result[1]}')

    invalid_property = {
        'title': 'Bad',  # Too short
        'property_type': '',  # Required
        'price': -100,  # Invalid
        'address': '',  # Required
        'city': '',  # Required
        'state': '',  # Required
        'zip_code': ''  # Required
    }
    result = validate_property_data(invalid_property)
    print(f'Invalid property: Valid={result[0]}, Error count={len(result[1])}')
    print('First 3 errors:', result[1][:3])

    print('\nValidation system test completed successfully!')

if __name__ == '__main__':
    test_validation_system()
