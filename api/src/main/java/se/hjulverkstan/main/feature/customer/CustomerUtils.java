package se.hjulverkstan.main.feature.customer;

import se.hjulverkstan.main.shared.ValidationUtils;

public class CustomerUtils {
    public static void validateDtoBySelf (CustomerDto dto) {
        ValidationUtils.validateNotNull(dto.getCustomerType(), "customerType");
        ValidationUtils.validateNotBlank(dto.getFirstName(), "firstName");
        ValidationUtils.validateNotBlank(dto.getPhoneNumber(), "phoneNumber");
        ValidationUtils.validateEmail(dto.getEmail(), "email");
        
        if (dto.getPersonalIdentityNumber() != null) {
            ValidationUtils.validatePattern(dto.getPersonalIdentityNumber(), "^(\\d{6}|\\d{8})-\\d{4}$", "personalIdentityNumber (YYYYMMDD-XXXX or XXXXXX-XXXX)");
        }

        if (dto.getCustomerType() == CustomerType.ORGANIZATION) {
            ValidationUtils.validateNotBlank(dto.getOrganizationName(), "organizationName");
        }
    }
}
