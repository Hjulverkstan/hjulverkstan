import { Page } from '@components/Page';
import { Section } from '@components/Section';
import { SectionContent } from '@components/SectionContent';
import type { Story } from '@data/webedit/story/types';
import { usePreloadedDataLocalized } from '@hooks/usePreloadedData';
import { useParams } from 'react-router-dom';
import { TiptapContentAsHtml } from '@components/TiptapContentAsHtml';
import { ImageWithFallback } from '@components/ImageWithFallback';
import { endpoints } from '@data/api';
import Error from '@components/Error';

export default function StoryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data } = usePreloadedDataLocalized();

  const story = data.stories.find((s: Story) => s.slug === slug);

  return (
    <Page heading={story?.title} headingWidth="medium">
      <Section>
        <SectionContent contentWidth="medium">
          <div
            className="mt-4 flex max-h-[550px] items-center justify-center
              overflow-hidden rounded-lg md:mt-0"
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
          <div className="flex justify-center pt-16 lg:pt-24">
            <TiptapContentAsHtml content={story?.bodyText} />
          </div>
        </SectionContent>
      </Section>
    </Page>
  );
}
