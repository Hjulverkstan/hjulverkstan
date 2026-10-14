package se.hjulverkstan.main.shared.auditable;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class AuditableDto {
    public AuditableDto (Auditable auditable) {
        createdAt = auditable.getCreatedAt();
        updatedAt = auditable.getUpdatedAt();
        createdBy = auditable.getCreatedBy() != null ? auditable.getCreatedBy().toString() : null;
        updatedBy = auditable.getUpdatedBy() != null ? auditable.getUpdatedBy().toString() : null;
    }

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String createdBy;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String updatedBy;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime createdAt;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime updatedAt;
}
