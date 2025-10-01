import { Page } from '@components/Page';
import { Section } from '@components/Section';
import { SectionContent } from '@components/SectionContent';
import { CardStory } from '@components/CardStory';
import { usePreloadedDataLocalized } from '@hooks/usePreloadedData';

export default function Stories() {
  const { data } = usePreloadedDataLocalized();

  return (
    <Page heading="Stories">
      <Section>
        <SectionContent>
          <div className="grid gap-8 lg:grid-cols-2">
            {data.story.map((story) => (
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
