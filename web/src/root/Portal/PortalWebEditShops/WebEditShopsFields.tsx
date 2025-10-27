import * as DataForm from '@components/DataForm';

import { usePortalWebEditLang } from '../PortalWebEditLang';
import { useLocationsAsEnumsQ } from '@data/location/queries';
import { Global } from '@data/webedit/types';

export default function WebEditShopsFields() {
  const locationEnumsQ = useLocationsAsEnumsQ();
  const lang = usePortalWebEditLang();

  return (
    <>
      <DataForm.Image
        label="Image"
        dataKey="imageURL"
        disabled={lang !== Global}
      />

      <DataForm.Select
        enums={locationEnumsQ.data ?? []}
        label="Location"
        dataKey="locationId"
        disabled={lang !== Global}
      />

      <DataForm.Input
        placeholder="Write name..."
        label="Name"
        dataKey="name"
        disabled={lang !== Global}
      />

      <DataForm.Input
        placeholder="Url of the shop"
        label="Slug"
        dataKey="slug"
        disabled={lang !== Global}
      />

      <DataForm.Input
        placeholder="Write address..."
        label="Address"
        dataKey="address"
        disabled={lang !== Global}
      />

      <DataForm.Input
        placeholder="Write latitude..."
        label="Latitude"
        dataKey="latitude"
        disabled={lang !== Global}
      />

      <DataForm.Input
        placeholder="Write longitude..."
        label="Longitude"
        dataKey="longitude"
        disabled={lang !== Global}
      />

      {lang !== Global && (
        <DataForm.RichText
          variant="translation"
          label="Body Text"
          dataKey="bodyText"
        />
      )}

      <DataForm.Collapsible label="Opening Hours">
        <>
          <DataForm.Input
            label="Monday"
            dataKey="openHours.mon"
            placeholder="H:MM - H:MM"
            disabled={lang !== Global}
          />
          <DataForm.Input
            label="Tuesday"
            dataKey="openHours.tue"
            placeholder="H:MM - H:MM"
            disabled={lang !== Global}
          />
          <DataForm.Input
            label="Wednesday"
            dataKey="openHours.wed"
            placeholder="H:MM - H:MM"
            disabled={lang !== Global}
          />
          <DataForm.Input
            label="Thursday"
            dataKey="openHours.thu"
            placeholder="H:MM - H:MM"
            disabled={lang !== Global}
          />
          <DataForm.Input
            label="Friday"
            dataKey="openHours.fri"
            placeholder="H:MM - H:MM"
            disabled={lang !== Global}
          />
          <DataForm.Input
            label="Saturday"
            dataKey="openHours.sat"
            placeholder="H:MM - H:MM"
            disabled={lang !== Global}
          />
          <DataForm.Input
            label="Sunday"
            dataKey="openHours.sun"
            placeholder="H:MM - H:MM"
            disabled={lang !== Global}
          />

          <DataForm.Switch
            onLabel="Temporary"
            offLabel="Not temporary"
            label="Temporary hours"
            dataKey="hasTempraryHours"
            disabled={lang !== Global}
          />
        </>
      </DataForm.Collapsible>
    </>
  );
}
