import * as enums from '@data/ticket/enums';
import { useVehiclesAsEnumsQ } from '@data/vehicle/queries';
import { useEmployeesAsEnumsQ } from '@data/employee/queries';
import { useCustomersAsEnumsQ } from '@data/customer/queries';
import * as DataForm from '@components/DataForm';
import { TicketType } from '@data/ticket/types';

export default function ShopTicketFields() {
  const { body } = DataForm.useDataForm();

  const vehicleEnumsQ = useVehiclesAsEnumsQ();
  const employeeEnumsQ = useEmployeesAsEnumsQ();
  const customerEnumsQ = useCustomersAsEnumsQ();

  return (
    <>
      <DataForm.Select label="Type" dataKey="ticketType" enums={enums.type} />

      <DataForm.Switch
        label="Status"
        dataKey="isOpen"
        switchLabel="Toggle is open"
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

      <DataForm.DatePicker label="Start Date" dataKey="startDate" />

      {(body.ticketType === TicketType.RENT ||
        body.ticketType === TicketType.REPAIR) && (
        <DataForm.DatePicker
          fromDate={body.startDate}
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
