import * as DataForm from '@components/DataForm';
import { useCustomersAsEnumsQ, useCustomersQ } from '@data/customer/queries';
import { CustomerType } from '@data/customer/types';
import { useEmployeesAsEnumsQ } from '@data/employee/queries';
import { useLocationsAsEnumsQ } from '@data/location/queries';
import * as enumsRaw from '@data/ticket/enums';
import { TicketType } from '@data/ticket/types';
import { useVehiclesAsEnumsQ } from '@data/vehicle/queries';
import { useTranslateRawEnums } from '@hooks/useTranslateRawEnums';
import { max, parseISO } from 'date-fns';
import { useEffect } from 'react';

export default function ShopTicketFields() {
  const { body, mode, setBodyProp } = DataForm.useDataForm();
  const enums = useTranslateRawEnums(enumsRaw);

  const customersQ = useCustomersQ();

  const selectedCustomer = customersQ.data?.find(
    (c) => c.id === body.customerId,
  );
  const isOrgCustomer = selectedCustomer?.customerType === CustomerType.ORG;
  const isPersonCustomer =
    selectedCustomer?.customerType === CustomerType.PERSON;

  const filteredCustomerEnums = (useCustomersAsEnumsQ().data ?? []).filter(
    (e) => {
      const c = customersQ.data?.find((cust) => cust.id === e.value);
      if (!c) return true;

      if (
        body.ticketType === TicketType.RECEIVE &&
        c.customerType === CustomerType.PERSON
      )
        return false;
      if (
        body.ticketType === TicketType.RENT &&
        c.customerType === CustomerType.ORG
      )
        return false;

      return true;
    },
  );

  useEffect(() => {
    if (mode === DataForm.Mode.CREATE && body.customerId) {
      const isStillAllowed = filteredCustomerEnums.some(
        (c) => c.value === body.customerId,
      );
      if (!isStillAllowed) {
        setBodyProp('customerId', undefined);
      }
    }
  }, [body.ticketType, customersQ.data, body.customerId, setBodyProp, mode]);

  let showOrgBikes: boolean | undefined = undefined;
  if (
    body.ticketType === TicketType.RENT ||
    body.ticketType === TicketType.DONATE
  ) {
    showOrgBikes = true;
  } else if (body.ticketType === TicketType.RECEIVE) {
    showOrgBikes = false;
  } else if (body.ticketType === TicketType.REPAIR) {
    showOrgBikes = isPersonCustomer ? false : isOrgCustomer ? true : undefined;
  }

  const vehicleEnumsQ = useVehiclesAsEnumsQ({
    filterByLocationId: body.locationId,
    showOrgBikes,
  });

  useEffect(() => {
    if (
      mode === DataForm.Mode.CREATE &&
      body.vehicleIds?.length &&
      vehicleEnumsQ.data
    ) {
      const allowedIds = vehicleEnumsQ.data.map((v) => v.value);
      const validSelectedVehicles = body.vehicleIds.filter((id: string) =>
        allowedIds.includes(id),
      );

      if (validSelectedVehicles.length !== body.vehicleIds.length) {
        setBodyProp('vehicleIds', validSelectedVehicles);
      }
    }
  }, [vehicleEnumsQ.data, setBodyProp, mode]);

  return (
    <>
      <DataForm.Select
        label="Type"
        dataKey="ticketType"
        enums={enums.ticketType}
        disabled={mode === DataForm.Mode.EDIT}
        allowDeselect
      />

      <DataForm.Select
        label="Customer"
        dataKey="customerId"
        enums={filteredCustomerEnums}
        allowDeselect
      />

      <DataForm.Select
        label="Location"
        dataKey="locationId"
        enums={useLocationsAsEnumsQ({ allowedTypes: ['SHOP'] }).data ?? []}
        disabled={!!body.vehicleIds?.length}
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
        enums={useEmployeesAsEnumsQ().data ?? []}
        fat
      />

      {body.ticketType === TicketType.RENT && (
        <>
          <DataForm.DatePicker
            label="Start Date"
            dataKey="startDate"
            fromDate={new Date()}
          />
          <DataForm.DatePicker
            label="End Date"
            dataKey="endDate"
            fromDate={max([
              body.startDate ? parseISO(body.startDate) : new Date(),
              new Date(),
            ])}
          />
        </>
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
