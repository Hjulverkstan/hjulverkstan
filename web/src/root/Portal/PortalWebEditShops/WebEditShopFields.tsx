import * as DataForm from '@components/DataForm';

export default function WebEditShopFields() {
  return (
    <>
      <DataForm.Input
        label="Name"
        dataKey="name"
        placeholder="Enter shop name..."
      />

      <DataForm.Input
        label="Address"
        dataKey="address"
        placeholder="Enter address..."
      />

      <DataForm.Image label="Image URL" dataKey="imageURL" />

      <DataForm.Input
        label="Latitude"
        dataKey="latitude"
        type="number"
        placeholder="Enter latitude"
      />

      <DataForm.Input
        label="Longitude"
        dataKey="longitude"
        type="number"
        placeholder="Enter longitude"
      />

      <DataForm.Input
        label="Image URL"
        dataKey="imageURL"
        placeholder="Enter image URL (optional)"
      />

      <DataForm.Switch
        label="Has Temporary Hours"
        dataKey="hasTemporaryHours"
      />

      <DataForm.Input
        label="Location ID"
        dataKey="locationId"
        type="number"
        placeholder="Enter location ID"
      />

      <DataForm.Collapsible label="Opening Hours">
        <>
          <DataForm.Input
            label="Monday"
            dataKey="openHours.mon"
            placeholder="e.g., 9:00 - 18:00"
          />
          <DataForm.Input
            label="Tuesday"
            dataKey="openHours.tue"
            placeholder="e.g., 9:00 - 18:00"
          />
          <DataForm.Input
            label="Wednesday"
            dataKey="openHours.wed"
            placeholder="e.g., 9:00 - 18:00"
          />
          <DataForm.Input
            label="Thursday"
            dataKey="openHours.thu"
            placeholder="e.g., 9:00 - 18:00"
          />
          <DataForm.Input
            label="Friday"
            dataKey="openHours.fri"
            placeholder="e.g., 9:00 - 18:00"
          />
          <DataForm.Input
            label="Saturday"
            dataKey="openHours.sat"
            placeholder="Optional"
          />
          <DataForm.Input
            label="Sunday"
            dataKey="openHours.sun"
            placeholder="Optional"
          />
        </>
      </DataForm.Collapsible>

      <DataForm.Input
        label={<span className="font-bold">Description *</span>}
        dataKey="bodyText"
        placeholder="Enter description..."
      />
    </>
  );
}
