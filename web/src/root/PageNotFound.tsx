import { Milestone } from 'lucide-react';

import Message from '@components/Message';
import { Link } from '@components/shadcn/Button';

export default function PageNotFound() {
  return (
    <Message
      className="h-full"
      icon={Milestone}
      message="The address you've entered does not exist."
    >
      <Link className="mt-3" variant="contrast" to="/">
        Go to main page
      </Link>
    </Message>
  );
}
