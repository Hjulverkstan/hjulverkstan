package se.hjulverkstan.main.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.jdbc.Sql;
import se.hjulverkstan.main.annotations.RepositoryTest;

@RepositoryTest
@Import(CustomerServiceImpl.class)
@Sql(scripts = {
        "classpath:script/customer.sql"
})
public class CustomerServiceIT {

    @Autowired
    private CustomerService customerService;

    // Test getAllCustomer
    // Test getCustomerById, both negative and positive
    // Test deleteCustomer, both negative and positive
    // Test editCustomer, both negative and positive
    // Test createCustomer, both negative and positive

}
