package se.hjulverkstan.main.feature.webedit.releases;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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

    @Enumerated(EnumType.STRING)
    @Column(name = "release_status", nullable = false)
    private ReleaseStatus releaseStatus;

    @Column(name = "")
    private Long releaseId;

    @Column(name = "deleted")
    private boolean deleted;

    public boolean isNotPublished () {
        return releaseStatus != ReleaseStatus.PUBLISHED;
    }

    // Calling super on a Releasable instantiates it as a draft.
    protected Releasable () {
        this.releaseStatus = ReleaseStatus.DRAFT;
        this.releaseId = null;
        this.deleted = false;
    }
}