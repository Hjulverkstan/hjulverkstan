import * as DataForm from '@components/DataForm';
import { useCustomersAsEnumsQ } from '@data/customer/queries';
import { useEmployeesAsEnumsQ } from '@data/employee/queries';
import * as enums from '@data/ticket/enums';
import { TicketType } from '@data/ticket/types';
import { useVehiclesAsEnumsQ } from '@data/vehicle/queries';
import { max, parseISO } from 'date-fns';

export default function ShopTicketFields() {
  const { body, mode } = DataForm.useDataForm();

  const vehicleEnumsQ = useVehiclesAsEnumsQ({
    filterCustomerOwned: body.ticketType === TicketType.RENT ? true : undefined,
  });
  const employeeEnumsQ = useEmployeesAsEnumsQ();
  const customerEnumsQ = useCustomersAsEnumsQ();

  return (
    <>
      <DataForm.Select
        label="Type"
        dataKey="ticketType"
        enums={enums.ticketType}
        disabled={mode === DataForm.Mode.EDIT}
      />

      <DataForm.Select
        label="Customer"
        dataKey="customerId"
        enums={customerEnumsQ.data ?? []}
      />

      <DataForm.Select
        label="Vehicles"
        dataKey="vehicleIds"
        enums={vehicleEnumsQ.data ?? []}
        isMultiSelect
      />

      <DataForm.Select
        label="Employee"
        dataKey="employeeId"
        enums={employeeEnumsQ.data ?? []}
        fat
      />

      {(body.ticketType === TicketType.RENT ||
        body.ticketType === TicketType.REPAIR) && (
        <DataForm.DatePicker
          label="Start Date"
          dataKey="startDate"
          fromDate={new Date()}
        />
      )}

      {(body.ticketType === TicketType.RENT ||
        body.ticketType === TicketType.REPAIR) && (
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
