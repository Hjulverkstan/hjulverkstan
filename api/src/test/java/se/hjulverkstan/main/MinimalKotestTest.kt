package se.hjulverkstan.main

import io.kotest.core.spec.style.ShouldSpec
import io.kotest.matchers.shouldBe

class MinimalKotestTest : ShouldSpec({
    should("verify true is true") {
        true shouldBe true
    }
})