import * as DataForm from '@components/DataForm';
import { useCustomersAsEnumsQ } from '@data/customer/queries';
import { useEmployeesAsEnumsQ } from '@data/employee/queries';
import * as enumsRaw from '@data/ticket/enums';
import { TicketType } from '@data/ticket/types';
import { useVehiclesAsEnumsQ, useVehiclesQ } from '@data/vehicle/queries';
import { max, parseISO } from 'date-fns';
import { useTranslateRawEnums } from '@hooks/useTranslateRawEnums';
import { useLocationsAsEnumsQ } from '@data/location/queries';

export default function ShopTicketFields() {
  const { body, mode } = DataForm.useDataForm();
  const vehiclesQ = useVehiclesQ();

  const enums = useTranslateRawEnums(enumsRaw);

  const firstIsCustomerOwned = body.vehicleIds?.length
    ? vehiclesQ.data?.find((v) => v.id === body.vehicleIds[0])?.isCustomerOwned
    : undefined;

  const employeeEnumsQ = useEmployeesAsEnumsQ();
  const customerEnumsQ = useCustomersAsEnumsQ();
  const locationEnumsQ = useLocationsAsEnumsQ();
  const vehicleEnumsQ = useVehiclesAsEnumsQ({
    filterByLocationId: body.locationId,
    filterCustomerOwned:
      body.ticketType === TicketType.RENT ||
      body.ticketType === TicketType.DONATE
        ? false
        : body.ticketType === TicketType.RECEIVE
          ? true
          : firstIsCustomerOwned
  });

  return (
    <>
      <DataForm.Select
        label="Type"
        dataKey="ticketType"
        enums={
          firstIsCustomerOwned
            ? enums.ticketType.filter(
                (t) =>
                  t.value !== TicketType.RENT && t.value !== TicketType.DONATE,
              )
            : enums.ticketType
        }
        disabled={mode === DataForm.Mode.EDIT}
      />

      <DataForm.Select
        label="Customer"
        dataKey="customerId"
        enums={customerEnumsQ.data ?? []}
      />

      <DataForm.Select
        enums={locationEnumsQ.data ?? []}
        label="Location"
        dataKey="locationId"
        disabled={body.vehicleIds.length}
      />

      <DataForm.Select
        label="Vehicles"
        dataKey="vehicleIds"
        enums={vehicleEnumsQ.data ?? []}
        disabled={!body.locationId}
        isMultiSelect
      />

      <DataForm.Select
        label="Employee"
        dataKey="employeeId"
        enums={employeeEnumsQ.data ?? []}
        fat
      />

      {(body.ticketType === TicketType.RENT) && (
        <DataForm.DatePicker
          label="Start Date"
          dataKey="startDate"
          fromDate={new Date()}
        />
      )}

      {(body.ticketType === TicketType.RENT) && (
        <DataForm.DatePicker
          fromDate={max([
            body.startDate ? parseISO(body.startDate) : new Date(),
            new Date(),
          ])}
          label="End Date"
          dataKey="endDate"
        />
      )}

      {body.ticketType === TicketType.REPAIR && (
        <DataForm.Input
          placeholder="Write a repair desc..."
          label="Repair Description"
          dataKey="repairDescription"
        />
      )}

      <DataForm.Input
        placeholder="Write a comment..."
        label="Comment"
        dataKey="comment"
      />
    </>
  );
}
