import * as DataForm from '@components/DataForm';

import { useLocationsAsEnumsQ } from '@data/location/queries';

export default function WebEditShopsFields() {
  const locationEnumsQ = useLocationsAsEnumsQ();

  return (
    <>
      <DataForm.Image
        label="Image"
        dataKey="imageURL"
      />

      <DataForm.Select
        enums={locationEnumsQ.data ?? []}
        label="Location"
        dataKey="locationId"
      />

      <DataForm.Input
        placeholder="Url of the shop"
        label="Slug"
        dataKey="slug"
      />

      <DataForm.Input
        placeholder="Write latitude..."
        label="Latitude"
        dataKey="latitude"
      />

      <DataForm.Input
        placeholder="Write longitude..."
        label="Longitude"
        dataKey="longitude"
      />

      <DataForm.Collapsible label="Opening Hours">
        <>
          <DataForm.Input
            label="Monday"
            dataKey="openHours.mon"
            placeholder="H:MM - H:MM"
          />
          <DataForm.Input
            label="Tuesday"
            dataKey="openHours.tue"
            placeholder="H:MM - H:MM"
          />
          <DataForm.Input
            label="Wednesday"
            dataKey="openHours.wed"
            placeholder="H:MM - H:MM"
          />
          <DataForm.Input
            label="Thursday"
            dataKey="openHours.thu"
            placeholder="H:MM - H:MM"
          />
          <DataForm.Input
            label="Friday"
            dataKey="openHours.fri"
            placeholder="H:MM - H:MM"
          />
          <DataForm.Input
            label="Saturday"
            dataKey="openHours.sat"
            placeholder="H:MM - H:MM"
          />
          <DataForm.Input
            label="Sunday"
            dataKey="openHours.sun"
            placeholder="H:MM - H:MM"
          />

          <DataForm.Switch
            onLabel="Temporary"
            offLabel="Not temporary"
            label="Temporary hours"
            dataKey="hasTemporaryHours"
          />
        </>
      </DataForm.Collapsible>
    </>
  );
}
