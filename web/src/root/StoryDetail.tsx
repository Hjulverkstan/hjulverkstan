import { Page } from '@components/Page';
import { Section } from '@components/Section';
import { SectionContent } from '@components/SectionContent';
import type { Story } from '@data/webedit/story/types';
import { usePreloadedDataLocalized } from '@hooks/usePreloadedData';
import { useParams } from 'react-router-dom';
import { TiptapContent } from '@components/TiptapContent';
import { ImageWithFallback } from '@components/ImageWithFallback';
import { endpoints } from '@data/api';
import Error from '@components/Error';

export default function StoryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data } = usePreloadedDataLocalized();

  const story = data.stories.find((s: Story) => s.slug === slug);

  return (
    <Page heading={story?.title} width="medium">
      <Section>
        <SectionContent className="max-w-[1360px]">
          <div
            className="flex max-h-[550px] items-center justify-center
              overflow-hidden rounded-lg"
          >
            <ImageWithFallback
              src={story?.imageURL}
              alt={story?.title}
              fallback={
                <Error
                  className="h-full w-full object-contain"
                  error={{
                    error: 'NOT_FOUND',
                    endpoint: endpoints.image,
                  }}
                />
              }
            />
          </div>
          <div className="flex justify-center pt-24">
            <TiptapContent
              className="tiptap-custom max-w-[840px] space-y-7"
              content={story?.bodyText}
            />
          </div>
        </SectionContent>
      </Section>
    </Page>
  );
}
