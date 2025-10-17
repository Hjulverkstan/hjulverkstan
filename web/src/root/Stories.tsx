import { Page } from '@components/Page';
import { Section } from '@components/Section';
import { SectionContent } from '@components/SectionContent';
import { CardStory } from '@components/CardStory';
import { usePreloadedDataLocalized } from '@hooks/usePreloadedData';
import { useTranslations } from '@hooks/useTranslations';

export default function Stories() {
  const { data } = usePreloadedDataLocalized();

  const { t } = useTranslations();

  return (
    <Page heading={t('stories')}>
      <Section>
        <SectionContent>
          <div className="grid gap-8 lg:grid-cols-2">
            {data.stories.map((story) => (
              <CardStory
                key={story.id}
                story={story}
                className="aspect-video rounded-xl"
              />
            ))}
          </div>
        </SectionContent>
      </Section>
    </Page>
  );
}
