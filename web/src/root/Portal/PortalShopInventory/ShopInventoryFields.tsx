import * as enums from '@data/vehicle/enums';
import { useLocationsAsEnumsQ } from '@data/location/queries';
import { VehicleType } from '@data/vehicle/types';
import { maxGearCount, minGearCount } from '@data/vehicle/form';
import * as DataForm from '@components/DataForm';
import { Mode } from '@components/DataForm';

export default function ShopInventoryFields() {
  const { body, mode } = DataForm.useDataForm();
  const locationEnumsQ = useLocationsAsEnumsQ();

  return (
    <>
      {(mode === Mode.EDIT || mode === Mode.READ) && (
        <DataForm.Image
          label="Image"
          dataKey="imageURL"
          disableImageUpload="Open portal on a mobile device to upload images."
        />
      )}

      <DataForm.Select
        label="Location"
        dataKey="locationId"
        enums={locationEnumsQ.data ?? []}
      />

      <DataForm.Select
        label="Ownership"
        dataKey="isCustomerOwned"
        enums={enums.isCustomerOwned}
        disabled={mode !== DataForm.Mode.CREATE}
      />

      {mode === Mode.CREATE &&
        body.vehicleType !== VehicleType.BATCH &&
        !body.isCustomerOwned && (
          <DataForm.Select
            label="Vehicle status"
            dataKey="vehicleStatus"
            enums={enums.vehicleStatus}
          />
        )}

      {body.vehicleType !== VehicleType.BATCH &&
        body.isCustomerOwned === false && (
          <DataForm.Input
            type="string"
            placeholder="ex 'WASD'"
            label="Regtag"
            dataKey="regTag"
            disabled={body.isCustomerOwned === true}
          />
        )}

      {mode !== DataForm.Mode.CREATE && body.isCustomerOwned === true && (
        <DataForm.Input
          type={'string'}
          placeholder={'ID'}
          label={'ID'}
          dataKey={'id'}
          disabled={true}
        />
      )}

      <DataForm.Select
        label="Vehicle type"
        dataKey="vehicleType"
        enums={enums.vehicleType}
        disabled={mode === DataForm.Mode.EDIT}
      />

      {body.vehicleType === VehicleType.STROLLER && (
        <DataForm.Select
          key={body.vehicleType}
          label="Stroller type"
          dataKey="strollerType"
          enums={enums.strollerType}
        />
      )}

      {body.vehicleType === VehicleType.BATCH && (
        <DataForm.Input
          type="number"
          label="Batch count"
          dataKey="batchCount"
          placeholder={'Set number of vehicles'}
        />
      )}

      <DataForm.Input
        placeholder="Write a comment..."
        label="Comment"
        dataKey="comment"
      />

      {body.vehicleType === VehicleType.BIKE && (
        <DataForm.Collapsible label="Vehicle details">
          <>
            <DataForm.Select
              key={body.vehicleType}
              label="Bike type"
              dataKey="bikeType"
              enums={enums.bikeType}
            />
            <DataForm.Select
              label="Brand"
              dataKey="brand"
              enums={enums.brand}
              allowDeselect
            />
            <DataForm.Select label="Size" dataKey="size" enums={enums.size} />
            <DataForm.Select
              label="Brake type"
              dataKey="brakeType"
              enums={enums.brakeType}
            />
            <DataForm.Input
              type="number"
              placeholder="Set gear count"
              min={minGearCount}
              max={maxGearCount}
              label="Gears"
              dataKey="gearCount"
              description="Gear count (ie 21 for 3x7)"
            />
          </>
        </DataForm.Collapsible>
      )}
    </>
  );
}
