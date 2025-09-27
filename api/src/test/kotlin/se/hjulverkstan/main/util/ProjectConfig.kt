package se.hjulverkstan.main.util

import io.kotest.core.config.AbstractProjectConfig
import io.kotest.core.spec.IsolationMode
import io.kotest.extensions.spring.SpringExtension

class ProjectConfig : AbstractProjectConfig() {
    override fun extensions() = listOf(
        SpringExtension
    )
}