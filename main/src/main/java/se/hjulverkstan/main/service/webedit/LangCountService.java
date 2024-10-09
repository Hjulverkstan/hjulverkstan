package se.hjulverkstan.main.service.webedit;

import se.hjulverkstan.main.common.exception.UnsupportedArgumentException;
import se.hjulverkstan.main.dto.webedit.LangCountPerEntityDto;

public interface LangCountService {
    /**
     * Retrieves the count of localized content entries per language for a specified entity type.
     * This method initializes counts for all languages to zero and then updates these counts based
     * on the actual data retrieved from the database for either 'generalcontent' or 'shop'.
     *
     * @param entity The type of entity to count localized content for.
     * @return A {@link LangCountPerEntityDto} object containing a map of languages and their
     * corresponding count of localized content entries.
     * @throws UnsupportedArgumentException If the provided entity type is not supported.
     */
    LangCountPerEntityDto getLangCountByEntity(String entity);
}
