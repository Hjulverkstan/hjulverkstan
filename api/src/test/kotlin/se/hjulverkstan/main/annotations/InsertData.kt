package se.hjulverkstan.main.annotations

import org.springframework.test.context.jdbc.Sql


@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
@Sql(executionPhase = Sql.ExecutionPhase.BEFORE_TEST_CLASS)
annotation class InsertData(
    val scripts: Array<String>
)