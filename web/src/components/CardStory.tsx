import { ArrowRight } from 'lucide-react';

import { IconLink } from '@components/shadcn/Button';
import { Base, Body, Image, Row, Title } from '@components/Card';
import { Story } from '@data/webedit/story/types';
import { usePreloadedDataLocalized } from '@hooks/usePreloadedData';
import { TiptapContent } from '@components/TiptapContent';

interface CardStoryProps {
  story: Story;
  className?: string;
}

export const CardStory: React.FC<CardStoryProps> = ({ story, className }) => {
  const { currLocale } = usePreloadedDataLocalized();

  return (
    <Base variant="imageBackground" className={className}>
      <Image variant="background" src={story.imageURL} alt={story.title} />
      <Title variant="imageBackground">{story.title}</Title>
      <Row className="items-end">
        <Body className="line-clamp-3">
          <TiptapContent content={story?.bodyText} />
        </Body>
        <IconLink
          to={`/${currLocale}/stories/${story.slug}`}
          variant="background"
          subVariant="rounded"
          size="large"
          icon={ArrowRight}
          aria-label={story.title}
        />
      </Row>
    </Base>
  );
};
