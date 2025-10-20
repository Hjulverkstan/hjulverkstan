import React, { useState } from 'react';

import { Page } from '@components/Page';
import { Section } from '@components/Section';
import { SectionContent } from '@components/SectionContent';
import { CardContact } from '@components/CardContact';
import { usePreloadedDataLocalized } from '@hooks/usePreloadedData';
import { Base, Body } from '@components/Card';
import { ChevronRight } from 'lucide-react';
import { Bullet } from '@components/Bullet';
import { cn } from '@utils/common';

const faqs = [
  {
    question: 'Do you offer bike rentals?',
    answer:
      'Yes, we offer a variety of bikes for short- and long-term rentals.',
  },
  {
    question: 'What types of bikes do you lend?',
    answer: "We lend city bikes, children's bikes, and bikes with child seats.",
  },
  {
    question: 'Do I need to bring ID?',
    answer: 'Yes, a valid ID is required to borrow a bike.',
  },
  {
    question: 'Can I return the bike at a different location?',
    answer: 'Normally, you must return the bike to the same location.',
  },
];

interface FaqItemProps {
  question: string;
  answer: string;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="text-foreground">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full text-left"
      >
        <Bullet
          icon={ChevronRight}
          iconSize={30}
          iconClassName={cn(
            'min-w-[30px] shrink-0 transition-transform duration-200',
            isOpen && 'rotate-90',
          )}
        >
          <p className="text-h3 text-foreground font-bold">{question}</p>
        </Bullet>
      </button>

      {isOpen && <Body className="text-foreground ml-10 mt-6">{answer}</Body>}
    </div>
  );
};

const Contact: React.FC = () => {
  const { data } = usePreloadedDataLocalized();

  const middleIndex = Math.ceil(faqs.length / 2);
  const faqLeft = faqs.slice(0, middleIndex);
  const faqRight = faqs.slice(middleIndex);

  return (
    <Page heading={data.text.contactLabel} variant="muted">
      <Section variant="muted">
        <SectionContent>
          <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-2">
            {data.shops.map((shop) => (
              <CardContact shop={shop} />
            ))}
          </div>
        </SectionContent>

        <SectionContent heading={data.text.contactFAQ}>
          <Base variant="padded">
            <div className="flex w-full flex-col gap-10 xl:flex-row">
              <div className="flex w-full flex-col gap-10 xl:w-1/2">
                {faqLeft.map(({ question, answer }, index) => (
                  <FaqItem key={index} question={question} answer={answer} />
                ))}
              </div>
              <div className="flex w-full flex-col gap-10 xl:w-1/2">
                {faqRight.map(({ question, answer }, index) => (
                  <FaqItem key={index} question={question} answer={answer} />
                ))}
              </div>
            </div>
          </Base>
        </SectionContent>
      </Section>
    </Page>
  );
};

export default Contact;
