import * as enums from '@data/vehicle/enums';
import { useLocationsAsEnumsQ } from '@data/location/queries';
import { VehicleType } from '@data/vehicle/types';
import { maxGearCount, minGearCount } from '@data/vehicle/form';
import * as DataForm from '@components/DataForm';

export default function ShopInventoryFields() {
  const { body, mode } = DataForm.useDataForm();
  const locationEnumsQ = useLocationsAsEnumsQ();

  return (
    <>
      {body.vehicleType !== VehicleType.BATCH && (
        <DataForm.Input
          type="string"
          placeholder="ex 'WASD'"
          label="Regtag"
          dataKey="regTag"
        />
      )}

      <DataForm.Select
        label="Location"
        dataKey="locationId"
        options={locationEnumsQ.data ?? []}
      />

      <DataForm.Select
        label="Vehicle type"
        dataKey="vehicleType"
        options={enums.vehicleType}
        disabled={mode === DataForm.Mode.EDIT}
      />

      {body.vehicleType === VehicleType.STROLLER && (
        <DataForm.Select
          key={body.vehicleType}
          label="Stroller type"
          dataKey="strollerType"
          options={enums.strollerType}
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

      {body.vehicleType !== VehicleType.BATCH && (
        <DataForm.Select
          label="Vehicle status"
          dataKey="vehicleStatus"
          options={enums.vehicleStatus}
        />
      )}

      {body.vehicleType === VehicleType.BIKE && (
        <>
          <DataForm.Select
            key={body.vehicleType}
            label="Bike type"
            dataKey="bikeType"
            options={enums.bikeType}
          />
          <DataForm.Select
            label="Brand"
            dataKey="brand"
            options={enums.brand}
          />
          <DataForm.Select label="Size" dataKey="size" options={enums.size} />
          <DataForm.Select
            label="Brake type"
            dataKey="brakeType"
            options={enums.brakeType}
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
      )}

      <DataForm.Input
        placeholder="Write a comment..."
        label="Comment"
        dataKey="comment"
      />
    </>
  );
}
