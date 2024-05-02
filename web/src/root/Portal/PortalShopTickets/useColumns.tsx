import { useMemo } from 'react';

import { useCustomersAsEnumsQ } from '@data/customer/queries';
import { useEmployeesAsEnumsQ } from '@data/employee/queries';
import { useLocationsAsEnumsQ } from '@data/location/queries';
import * as enums from '@data/ticket/enums';
import { TicketAggregated } from '@data/ticket/types';
import { useVehiclesAsEnumsQ } from '@data/vehicle/queries';

import BadgeGroup from '@components/BadgeGroup';
import * as DataTable from '@components/DataTable';
import IconLabel from '@components/IconLabel';
import { format, isBefore, startOfDay } from 'date-fns';
import { Calendar, CheckCircle, CircleDot } from 'lucide-react';

//

export default function useColumns() {
  const locationEnumsQ = useLocationsAsEnumsQ();
  const vehicleEnumsQ = useVehiclesAsEnumsQ();
  const customerEnumsQ = useCustomersAsEnumsQ();
  const employeeEnumsQ = useEmployeesAsEnumsQ();

  return useMemo(
    () =>
      [
        {
          key: 'ticketType',
          name: 'Type',
          renderFn: ({ ticketType }) => (
            <IconLabel {...enums.find(ticketType)} />
          ),
        },
        {
          key: 'customerId',
          name: 'Customer',
          renderFn: ({ customerId }) => {
            if (customerEnumsQ.data) {
              const { name: label, icon } = customerEnumsQ.data.find(
                (e) => e.value === customerId,
              )!;

              return <BadgeGroup badges={[{ label, icon }]} />;
            }
          },
        },
        {
          key: 'status',
          name: 'Status',
          renderFn: ({ isOpen, endDate }) => {
            const badge = isOpen
              ? endDate &&
                isBefore(startOfDay(new Date(endDate)), startOfDay(new Date()))
                ? {
                    label: 'Due',
                    icon: Calendar,
                    variant: 'destructive' as 'destructive',
                  }
                : {
                    label: 'Open',
                    icon: CircleDot,
                    variant: 'success' as 'successOutline',
                  }
              : {
                  label: 'Closed',
                  icon: CheckCircle,
                  variant: 'outline' as 'outline',
                };

            return <BadgeGroup badges={[badge]} />;
          },
        },
        {
          key: 'locations',
          name: 'Locations',
          renderFn: ({ locationIds }) =>
            locationEnumsQ.data && (
              <BadgeGroup
                badges={locationIds.map((id) => {
                  const { name: label, icon } = locationEnumsQ.data.find(
                    (e) => e.value === id,
                  )!;
                  return { label, icon, variant: 'outline' };
                })}
              />
            ),
        },
        {
          key: 'vehicleIds',
          name: 'Vehicles',
          renderFn: ({ vehicleIds }) =>
            vehicleEnumsQ.data && (
              <BadgeGroup
                badges={vehicleIds.map((id) => ({
                  label: vehicleEnumsQ.data.find((e) => e.value === id)!.name,
                }))}
              />
            ),
        },
        {
          key: 'employeeId',
          name: 'Employee',
          renderFn: ({ employeeId }) => {
            if (employeeEnumsQ.data) {
              const employee = employeeEnumsQ.data.find(
                (e) => e.value === employeeId,
              )!;

              return <IconLabel {...employee} />;
            }
          },
        },
        {
          key: 'startDate',
          name: 'Start Date',
          renderFn: (row) => (
            <span className="text-muted-foreground text-elipsis">
              {format(row.startDate, 'yyyy-MM-dd')}
            </span>
          ),
        },
        {
          key: 'endDate',
          name: 'End Date',
          renderFn: (row) =>
            row.endDate && (
              <span className="text-muted-foreground text-elipsis">
                {format(row.endDate, 'yyyy-MM-dd')}
              </span>
            ),
        },
        {
          key: 'comment',
          name: 'Comment',
          renderFn: (row) => (
            <span className="text-muted-foreground text-elipsis">
              {row.comment}
            </span>
          ),
        },
        {
          key: 'repairDesc',
          name: 'Repair Desc.',
          renderFn: ({ repairDescription }) => (
            <span className="text-muted-foreground text-elipsis">
              {repairDescription}
            </span>
          ),
        },
      ] as Array<DataTable.Column<TicketAggregated>>,
    [
      locationEnumsQ.data,
      vehicleEnumsQ.data,
      customerEnumsQ.data,
      employeeEnumsQ.data,
    ],
  );
}
