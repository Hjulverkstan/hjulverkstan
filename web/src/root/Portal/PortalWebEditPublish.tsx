import { Rocket } from 'lucide-react';
import { Badge } from '@components/shadcn/Badge';
import { Button } from '@components/shadcn/Button';

export default () => (
  <Button variant="blueMuted" subVariant="flat" className="gap-2">
    <Rocket className="h-4 w-4" />
    Publish
    <Badge
      borderless
      variant="blueStrong"
      className="rounded-sm px-1 font-normal"
    >
      0
    </Badge>
  </Button>
);
