package se.hjulverkstan.main.shared;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
public class AuditableDto {
    public AuditableDto (Auditable auditable) {
        createdAt = auditable.getCreatedAt();
        updatedAt = auditable.getUpdatedAt();
        updatedAt = LocalDateTime.now();
        createdBy = auditable.getCreatedBy();
    }

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long createdBy;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long updatedBy;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime createdAt;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime updatedAt;
}
