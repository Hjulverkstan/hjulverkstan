package se.hjulverkstan.main.util;

import se.hjulverkstan.Exceptions.UnsupportedArgumentException;
import se.hjulverkstan.main.model.webedit.Language;

public class WebEditUtils {
    public static Language validateLanguage(String lang) {
        try {
            return Language.valueOf(lang.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new UnsupportedArgumentException("Invalid language code: " + lang);
        }
    }
}
