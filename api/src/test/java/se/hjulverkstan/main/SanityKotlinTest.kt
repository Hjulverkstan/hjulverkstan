package se.hjulverkstan.main

import io.kotest.core.spec.style.StringSpec
import io.kotest.matchers.shouldBe

class SanityKotlinTest : StringSpec({

    "basic kotlin test runs" {
        val a = 2 + 2
        a shouldBe 4
    }

})
