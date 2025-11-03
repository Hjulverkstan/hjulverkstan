import * as DataForm from '@components/DataForm';
import { usePortalWebEditLang } from '../PortalWebEditLang';
import { Global } from '@data/webedit/types';
import { Languages } from 'lucide-react';

export default function WebEditTextFields() {
  const lang = usePortalWebEditLang();

  return (
    <>
      {lang != Global ? (
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
