import { useNavigate, useParams } from 'react-router-dom';
import { Pencil, Save, XIcon } from 'lucide-react';

import { Mode, useDataForm } from '@components/DataForm';
import { IconButton } from '@components/ui/Button';
import { ReactNode } from 'react';
import { useToast } from '@components/ui/use-toast';
import { createErrorToast } from './toast';

export interface PortalFormProps {
  isSubmitting: boolean;
  /* muateAsync from useMutation() */
  createMutation: (body: any) => Promise<any>;
  /* muateAsync from useMutation() */
  saveMutation: (body: any) => Promise<any>;
  children: ReactNode;
}

export default function PortalForm({
  isSubmitting,
  createMutation,
  saveMutation,
  children,
}: PortalFormProps) {
  const { id = '' } = useParams();
  const { mode, data, validationIssues } = useDataForm();
  const { toast } = useToast();
  const navigate = useNavigate();

  const onCreate = () => {
    if (!validationIssues.length) {
      createMutation(data)
        .then((res: any) => navigate('../' + res.id))
        .catch((err: any) => {
          console.error(err);
          toast(
            createErrorToast({ verbLabel: 'create', dataLabel: 'vehicle' }),
          );
        });
    }
  };

  const onSave = () => {
    if (!validationIssues.length) {
      saveMutation(data)
        .then((res: any) => navigate('../' + res.id))
        .catch((err: any) => {
          console.error(err);
          toast(createErrorToast({ verbLabel: 'save', dataLabel: 'vehicle' }));
        });
    }
  };

  const { title, handler, tooltip } = {
    [Mode.READ]: {
      title: 'Vehicle',
      handler: () => navigate('edit'),
      tooltip: 'Edit',
    },
    [Mode.EDIT]: {
      title: 'Edit vehicle',
      handler: onSave,
      tooltip: 'Save',
    },
    [Mode.CREATE]: {
      title: 'Add vehicle',
      handler: onCreate,
      tooltip: 'Create',
    },
  }[mode];

  return (
    <div className="flex flex-col rounded-md border bg-muted ">
      <div className="flex h-10 min-w-60 items-center border-b px-2">
        <h3 className="flex-grow pl-2 align-middle text-sm font-medium">
          {title}
        </h3>
        <IconButton
          key={mode}
          disabled={isSubmitting || !!validationIssues.length}
          onClick={handler}
          variant={mode === Mode.READ ? 'ghost' : 'default'}
          icon={mode === Mode.READ ? Pencil : Save}
          tooltip={tooltip}
        />
        <IconButton
          disabled={isSubmitting}
          onClick={() => navigate(mode === Mode.EDIT ? `../${id}` : '..')}
          variant="ghost"
          icon={XIcon}
          tooltip="Close"
        />
      </div>
      <div className="space-y-4 px-2 pb-3 pt-4">{children}</div>
    </div>
  );
}
