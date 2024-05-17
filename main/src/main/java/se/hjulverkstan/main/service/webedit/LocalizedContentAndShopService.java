package se.hjulverkstan.main.service.webedit;

import se.hjulverkstan.main.dto.webedit.AllWebEditEntitiesByLangDto;
import se.hjulverkstan.main.model.webedit.Language;

public interface LocalizedContentAndShopService {
    AllWebEditEntitiesByLangDto getAllLocalisedData(Language lang);
}