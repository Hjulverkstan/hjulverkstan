import { Page } from '@components/Page';
import { Section } from '@components/Section';
import { SectionContent } from '@components/SectionContent';
import type { Story } from '@data/webedit/story/types';
import { usePreloadedDataLocalized } from '@hooks/usePreloadedData';
import { useParams } from 'react-router-dom';
import { TiptapContent } from '@components/TiptapContent';

export default function StoryDetail() {
  const { id } = useParams<{ id: string }>();
  const { data } = usePreloadedDataLocalized();

  const story = data.story.find((s: Story) => s.id === id);

  return (
    <Page>
      <Section className="pt-10 md:py-0 md:pb-32">
        <SectionContent>
          <div className="pt-10 lg:px-[105px]">
            <div>
              <h1 className="pb-6 text-2xl md:text-3xl lg:pb-16 lg:text-5xl">
                {story?.title}
              </h1>
              <div
                className="flex max-h-[550px] flex-col items-center
                  justify-center overflow-hidden rounded-lg"
              >
                <img
                  className="h-full w-full object-contain"
                  src={story?.imageURL}
                  alt={story?.title}
                />
              </div>
            </div>
            <div className="space-y-7 pt-16 lg:px-[20%] lg:pt-32">
              <TiptapContent content={story?.bodyText} />
            </div>
          </div>
        </SectionContent>
      </Section>
    </Page>
  );
}
