import { Page } from '@components/Page';
import { Section } from '@components/Section';
import { SectionContent } from '@components/SectionContent';
import { CardDefault } from '@components/CardDefault';
import {
  CoinsIcon,
  Hammer,
  HeartHandshake,
  PackagePlusIcon,
} from 'lucide-react';

export default function Support() {
  return (
    <Page heading="Support">
      <Section>
        <SectionContent>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
            <CardDefault
              icon={PackagePlusIcon}
              title="Donate material"
              body="Support us with bikes, tools, or other useful items. Your donation helps keep the project rolling."
              link="/"
              ariaLabel="Learn more about donating material"
              variant="muted"
            />
            <CardDefault
              icon={CoinsIcon}
              title="Donate via Swish"
              body="Swish a contribution, every bit helps us empower young people and build a stronger community."
              link="/"
              ariaLabel="Learn more about donating via Swish"
              variant="muted"
            />
            <CardDefault
              icon={Hammer}
              title="Work with us"
              body="We offer opportunities to get involved, learn new skills, and be part of our workshops."
              link="/"
              ariaLabel="Learn more about working with us"
              variant="muted"
            />
            <CardDefault
              icon={HeartHandshake}
              title="Become a partner"
              body="We welcome partnerships that promote sustainability and inclusion. Feel free to reach out!"
              link="/"
              ariaLabel="Learn more about becoming a partner"
              linkLabel="Contact us"
              variant="muted"
            />
          </div>
        </SectionContent>
      </Section>
    </Page>
  );
}
