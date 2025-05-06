import React from 'react';
import { ArrowRight } from 'lucide-react';

import { IconLink } from '@components/shadcn/Button';
import { Base, Body, Image, Row, Title } from '@components/Card';
import { Story } from '@data/webedit/story/types';

interface CardStoryProps {
  story: Story;
  className?: string;
}

export const CardStory: React.FC<CardStoryProps> = ({ story, className }) => (
  <Base variant="imageBackground" className={className}>
    <Image variant="background" src={story.imageURL} alt={story.title} />
    <Title variant="imageBackground">{story.title}</Title>
    <Row className="items-end">
      <Body className="line-clamp-3">{story.bodyText}</Body>
      <IconLink
        to={`/stories${story.slug}`}
        variant="background"
        subVariant="rounded"
        size="large"
        icon={ArrowRight}
        aria-label={story.title}
      />
    </Row>
  </Base>
);
