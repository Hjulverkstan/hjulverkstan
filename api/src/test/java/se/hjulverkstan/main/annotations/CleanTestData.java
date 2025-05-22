package se.hjulverkstan.main.annotations;

import org.springframework.test.context.jdbc.Sql;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/** This annotation is used to clean the test data after the test class execution.
 It will execute the clean.sql script to remove all test data from the database.
 This is useful to ensure that the database is clean before running the next test class
 and to avoid any side effects from previous tests.
 The execution phase is set to AFTER_TEST_CLASS to ensure that the clean.sql script
 is executed after all the tests in the class have been run.
 This annotation can be used in conjunction with @Sql to execute the clean.sql script
 after the test class execution.
 Make sure that the table you want to clean is referenced in the clean.sql script.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Sql(
        scripts = "classpath:clean.sql",
        executionPhase = Sql.ExecutionPhase.AFTER_TEST_CLASS
)
public @interface CleanTestData { }