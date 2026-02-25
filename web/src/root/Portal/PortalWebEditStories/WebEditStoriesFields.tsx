import * as DataForm from '@components/DataForm';

import { usePortalWebEditLang } from '../PortalWebEditLang';

export default function WebEditStoriesFields() {
  const lang = usePortalWebEditLang();

  return (
    <>
      <DataForm.Image
        label="Image"
        dataKey="imageURL"
      />

      <DataForm.Input
        placeholder="Write title..."
        label="Title"
        dataKey="title"
      />

      <DataForm.Input
        placeholder="Write slug (url)..."
        label="Slug"
        dataKey="slug"
      />

      <DataForm.RichText
        variant="translation"
        label="Body Text"
        dataKey="bodyText"
      />
    </>
  );
}
