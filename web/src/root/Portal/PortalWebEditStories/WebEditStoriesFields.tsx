import * as DataForm from '@components/DataForm';

import { usePortalWebEditLang } from '../PortalWebEditLang';
import { Global } from '@data/webedit/types';

export default function WebEditStoriesFields() {
  const lang = usePortalWebEditLang();

  return (
    <>
      <DataForm.Image
        label="Image"
        dataKey="imageURL"
        disabled={lang !== Global}
      />

      <DataForm.Input
        placeholder="Write title..."
        label="Title"
        dataKey="title"
        disabled={lang !== Global}
      />

      <DataForm.Input
        placeholder="Write slug (url)..."
        label="Slug"
        dataKey="slug"
        disabled={lang !== Global}
      />

      {lang !== Global && (
        <DataForm.RichText
          variant="translation"
          placeholder="No translation yet..."
          label="Body Text"
          dataKey="bodyText"
        />
      )}
    </>
  );
}
