package se.hjulverkstan.main.data.factory

import java.awt.image.BufferedImage
import java.io.ByteArrayOutputStream
import javax.imageio.ImageIO

object ImageEndpointFactory {

    private fun generateFakeImage(width: Int = 100, height: Int = 50, format: String): ByteArray {
        val image = BufferedImage(width, height, BufferedImage.TYPE_INT_RGB)
        val output = ByteArrayOutputStream()
        ImageIO.write(image, format, output)
        return output.toByteArray()
    }

    fun generateFakePngImage(): ByteArray =
        generateFakeImage(width = 100, height = 50, format = "png")

    fun generateHugeFakePngImage(): ByteArray =
        generateFakeImage(width = 10_000, height = 10_000, format = "png")

    fun generateFakeGifImage(): ByteArray =
        generateFakeImage(width = 100, height = 50, format = "gif")

}