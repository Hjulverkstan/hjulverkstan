package se.hjulverkstan.main.feature.customer;

import se.hjulverkstan.main.error.exceptions.MissingArgumentException;

public class CustomerUtils {
    public static void validateDtoBySelf (CustomerDto dto) {
        if (dto.getCustomerType().equals(CustomerType.ORGANIZATION) && dto.getOrganizationName() == null) {
            throw new MissingArgumentException("Organization name");
        }
    }
}
