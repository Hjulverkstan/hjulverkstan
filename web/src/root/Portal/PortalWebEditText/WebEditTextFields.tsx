import * as DataForm from '@components/DataForm';
import { usePortalWebEditLocale } from '../PortalWebEditLocale';
import { Global } from '@data/webedit/types';
import { Languages } from 'lucide-react';

export default function WebEditTextFields() {
  const locale = usePortalWebEditLocale();

  return (
    <>
      {locale != Global ? (
        <DataForm.Input
          variant="translation"
          placeholder="Write translation"
          label="Value"
          dataKey="value"
        />
      ) : (
        <div
          className="text-muted-foreground flex h-full flex-col items-center
            justify-center p-4 text-center text-sm"
        >
          <p>Choose a language to edit translations.</p>
        </div>
      )}
    </>
  );
}
