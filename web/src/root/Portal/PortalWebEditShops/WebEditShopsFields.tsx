import * as DataForm from '@components/DataForm';

import { usePortalWebEditLocale } from '../PortalWebEditLocale';
import { useLocationsAsEnumsQ } from '@data/location/queries';
import { Global } from '@data/webedit/types';

export default function WebEditShopsFields() {
  const locationEnumsQ = useLocationsAsEnumsQ();
  const locale = usePortalWebEditLocale();

  return (
    <>
      <DataForm.Image
        label="Image"
        dataKey="imageURL"
        disabled={locale !== Global}
      />

      <DataForm.Select
        enums={locationEnumsQ.data ?? []}
        label="Location"
        dataKey="locationId"
        disabled={locale !== Global}
      />

      <DataForm.Input
        placeholder="Write name..."
        label="Name"
        dataKey="name"
        disabled={locale !== Global}
      />

      <DataForm.Input
        placeholder="Url of the shop"
        label="Slug"
        dataKey="slug"
        disabled={locale !== Global}
      />

      <DataForm.Input
        placeholder="Write address..."
        label="Address"
        dataKey="address"
        disabled={locale !== Global}
      />

      <DataForm.Input
        placeholder="Write latitude..."
        label="Latitude"
        dataKey="latitude"
        disabled={locale !== Global}
      />

      <DataForm.Input
        placeholder="Write longitude..."
        label="Longitude"
        dataKey="longitude"
        disabled={locale !== Global}
      />

      {locale !== Global && 'TODO: RTE Editor'}

      <DataForm.Collapsible label="Opening Hours">
        <>
          <DataForm.Input
            label="Monday"
            dataKey="openHours.mon"
            placeholder="H:MM - H:MM"
            disabled={locale !== Global}
          />
          <DataForm.Input
            label="Tuesday"
            dataKey="openHours.tue"
            placeholder="H:MM - H:MM"
            disabled={locale !== Global}
          />
          <DataForm.Input
            label="Wednesday"
            dataKey="openHours.wed"
            placeholder="H:MM - H:MM"
            disabled={locale !== Global}
          />
          <DataForm.Input
            label="Thursday"
            dataKey="openHours.thu"
            placeholder="H:MM - H:MM"
            disabled={locale !== Global}
          />
          <DataForm.Input
            label="Friday"
            dataKey="openHours.fri"
            placeholder="H:MM - H:MM"
            disabled={locale !== Global}
          />
          <DataForm.Input
            label="Saturday"
            dataKey="openHours.sat"
            placeholder="H:MM - H:MM"
            disabled={locale !== Global}
          />
          <DataForm.Input
            label="Sunday"
            dataKey="openHours.sun"
            placeholder="H:MM - H:MM"
            disabled={locale !== Global}
          />

          <DataForm.Switch
            onLabel="Temporary"
            offLabel="Not temporary"
            label="Temporary hours"
            dataKey="hasTempraryHours"
            disabled={locale !== Global}
          />
        </>
      </DataForm.Collapsible>
    </>
  );
}
