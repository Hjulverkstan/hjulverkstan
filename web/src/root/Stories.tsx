import { Page } from '@components/Page';
import { Section } from '@components/Section';
import { SectionContent } from '@components/SectionContent';
import { stories } from './tempData';
import { CardStory } from '@components/CardStory';

export default function Stories() {
  return (
    <Page>
      <Section variant="muted">
        <SectionContent heading="Stories">
          <div className="grid gap-8 lg:grid lg:grid-cols-2">
            {stories.slice(0, 6).map((story) => (
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
