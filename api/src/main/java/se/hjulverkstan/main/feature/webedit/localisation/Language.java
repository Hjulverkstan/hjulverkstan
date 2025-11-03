package se.hjulverkstan.main.feature.webedit.localisation;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Language {
    SV("sv"), // Swedish
    EN("en"), // English
    AR("ar"), // Arabic
    FA("fa"), // Persian
    SO("so"), // Somali
    BS("bs"), // Bosnian
    TR("tr");  // Turkish

    private final String lang;

    Language(String lang) {
        this.lang = lang;
    }

    @JsonValue
    public String getKey () {
        return lang.toLowerCase();
    }
}
