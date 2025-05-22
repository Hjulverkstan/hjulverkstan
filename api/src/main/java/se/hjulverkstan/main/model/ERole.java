package se.hjulverkstan.main.model;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum ERole {
    ROLE_USER,
    ROLE_ADMIN,
    ROLE_PIPELINE;

    public enum Role {
        USER(1, "User"),
        ADMIN(2, "Admin"),
        PIPELINE(3, "Pipeline");

        private final int vallue;
        private final String displayName;
        Role(int value, String displayName) {
            this.vallue = value;
            this.displayName = displayName;
        }

        @JsonCreator
        public static Role fromValue(int value) {
            for (Role role : Role.values()) {
                if (role.vallue == value) {
                    return role;
                }
            }
            throw new IllegalArgumentException("No role found for value: " + value);
        }
    }
}
