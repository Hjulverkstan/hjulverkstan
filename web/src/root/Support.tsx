import {
  CoinsIcon,
  Hammer,
  HeartHandshake,
  PackagePlusIcon,
} from 'lucide-react';

import { Page } from '@components/Page';
import { Section } from '@components/Section';
import { SectionContent } from '@components/SectionContent';
import { CardDefault } from '@components/CardDefault';
import { usePreloadedDataLocalized } from '@hooks/usePreloadedData';
import { useTranslations } from '@hooks/useTranslations';

export default function Support() {
  const { data } = usePreloadedDataLocalized();

  const { t } = useTranslations();

  return (
    <Page heading={t('support')}>
      <Section>
        <SectionContent>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
            <CardDefault
              icon={PackagePlusIcon}
              title={data.text.supportDonateMaterialTitle}
              body={data.text.supportDonateMaterialBody}
              link="/"
              ariaLabel="Learn more about donating material"
              variant="muted"
            />
            <CardDefault
              icon={CoinsIcon}
              title={data.text.supportDonateSwishTitle}
              body={data.text.supportDonateSwishBody}
              link="/"
              ariaLabel="Learn more about donating via Swish"
              variant="muted"
            />
            <CardDefault
              icon={Hammer}
              title={data.text.supportWorkTitle}
              body={data.text.supportWorkBody}
              link="/"
              ariaLabel="Learn more about working with us"
              variant="muted"
            />
            <CardDefault
              icon={HeartHandshake}
              title={data.text.supportPartnerTitle}
              body={data.text.supportPartnerBody}
              link="/"
              ariaLabel="Learn more about becoming a partner"
              linkLabel={t('contactUsLinkLabel')}
              variant="muted"
            />
          </div>
        </SectionContent>
      </Section>
    </Page>
  );
}
