package se.hjulverkstan.main;
import static org.junit.jupiter.api.Assertions.assertEquals;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.junit.jupiter.api.Test;
import se.hjulverkstan.main.model.webedit.EscapeJsonStringSerializer;

import java.io.StringWriter;

public class EscapeJsonStringSerializerTest {

    @Test
    public void testSerialize() throws Exception {
        EscapeJsonStringSerializer serializer = new EscapeJsonStringSerializer();

        String input = "{\"type\":\"doc\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"Write somethingasd asd asd asd asd\"}]},{\"type\":\"paragraph\"},{\"type\":\"paragraph\"},{\"type\":\"paragraph\"},{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"asdasd \"}]},{\"type\":\"paragraph\"},{\"type\":\"bulletList\",\"content\":[{\"type\":\"listItem\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"asdasd\"}]}]}]},{\"type\":\"paragraph\"}]}";
        System.out.println(input);
        StringWriter writer = new StringWriter();
        JsonGenerator gen = new com.fasterxml.jackson.core.JsonFactory().createGenerator(writer);
        SerializerProvider serializers = null;

        serializer.serialize(input, gen, serializers);
        gen.flush();

        String result = writer.toString();

        System.out.println(result);
        String expectedResult = "\"{\\\"type\\\":\\\"doc\\\",\\\"content\\\":[{\\\"type\\\":\\\"paragraph\\\",\\\"content\\\":[{\\\"type\\\":\\\"text\\\",\\\"text\\\":\\\"Write somethingasd asd asd asd asd\\\"}]},{\\\"type\\\":\\\"paragraph\\\"},{\\\"type\\\":\\\"paragraph\\\"},{\\\"type\\\":\\\"paragraph\\\"},{\\\"type\\\":\\\"paragraph\\\",\\\"content\\\":[{\\\"type\\\":\\\"text\\\",\\\"text\\\":\\\"asdasd \\\"}]},{\\\"type\\\":\\\"paragraph\\\"},{\\\"type\\\":\\\"bulletList\\\",\\\"content\\\":[{\\\"type\\\":\\\"listItem\\\",\\\"content\\\":[{\\\"type\\\":\\\"paragraph\\\",\\\"content\\\":[{\\\"type\\\":\\\"text\\\",\\\"text\\\":\\\"asdasd\\\"}]}]}]},{\\\"type\\\":\\\"paragraph\\\"}]}\"";
        assertEquals(expectedResult, result);
    }
}