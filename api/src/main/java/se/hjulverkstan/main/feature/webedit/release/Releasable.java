package se.hjulverkstan.main.feature.webedit.release;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;
import se.hjulverkstan.main.shared.auditable.Auditable;

import java.util.UUID;

@MappedSuperclass
@Getter
@Setter
public abstract class Releasable extends Auditable {
    @Column(name = "identity_id", nullable = false, updatable = false)
    private UUID identityId;
}