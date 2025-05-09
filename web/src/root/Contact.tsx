import { Page } from '@components/Page';
import { Section } from '@components/Section';
import { SectionContent } from '@components/SectionContent';
import { CardContact } from '@components/CardContact';
import { usePreloadedDataLocalized } from '@hooks/usePreloadedData';

export default function Contact() {
  const { data } = usePreloadedDataLocalized();
  return (
    <Page heading="Contact" variant="muted">
      <Section variant="muted" className="pt-0">
        <SectionContent>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {data.shops.map((shop) => (
              <CardContact
                key={shop.id}
                name={shop.name}
                address={shop.address}
                phone="0707123567"
                email="contact@hjulverkstan.org"
                openHours={shop.openHours}
                latitude={shop.latitude}
                longitude={shop.longitude}
              />
            ))}
          </div>
        </SectionContent>
      </Section>
    </Page>
  );
}
