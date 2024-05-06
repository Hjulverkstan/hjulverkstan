import { useMemo } from 'react';

import { useCustomersAsEnumsQ } from '@data/customer/queries';
import { useEmployeesAsEnumsQ } from '@data/employee/queries';
import { useLocationsAsEnumsQ } from '@data/location/queries';
import * as enums from '@data/ticket/enums';
import { TicketAggregated, TicketStatus } from '@data/ticket/types';
import { useVehiclesAsEnumsQ } from '@data/vehicle/queries';
import { useTicketsAsEnumsQ, useTicketsQ } from '@data/ticket/queries';

import BadgeGroup from '@components/BadgeGroup';
import * as DataTable from '@components/DataTable';
import IconLabel from '@components/IconLabel';
import { Badge } from '@components/shadcn/Badge';
import { format } from 'date-fns';
import useBaseUrl from '@hooks/useBaseUrl';

//

export function TicketBadges({ ticketIds }: { ticketIds: string[] }) {
  const baseUrl = useBaseUrl();

  const ticketsQ = useTicketsQ();
  const ticketEnumsQ = useTicketsAsEnumsQ();
  const employeeEnumsQ = useEmployeesAsEnumsQ();
  const customerEnumsQ = useCustomersAsEnumsQ();

  if (
    !ticketsQ.data ||
    !ticketEnumsQ.data ||
    !employeeEnumsQ.data ||
    !customerEnumsQ.data
  )
    return null;

  const badges = ticketIds.map((ticketId) => {
    const { customerId, employeeId } = ticketsQ.data.find(
      (t) => t.id === ticketId,
    )!;

    const ticketEnum = ticketEnumsQ.data.find((e) => e.value === ticketId)!;
    const customerEnum = customerEnumsQ.data.find(
      (e) => e.value === customerId,
    )!;
    const employeeEnum = employeeEnumsQ.data.find(
      (e) => e.value === employeeId,
    )!;

    return {
      ...ticketEnum,
      href: `${baseUrl}/ticketz/${ticketId}`,
      tooltip: (
        <div className="flex">
          {customerEnum.icon && <customerEnum.icon className="mr-1 h-4 w-4" />}
          {customerEnum.label}
          {' / '}@{employeeEnum.label}
        </div>
      ),
    };
  });

  const open = badges.filter((b) => b.variant !== 'outline');
  const closedCount = badges.filter((b) => b.variant === 'outline').length;

  return (
    <div className="flex gap-2">
      {!!open.length && <BadgeGroup badges={open} />}
      {!!closedCount && (
        <BadgeGroup
          badges={[{ label: `${closedCount} closed`, variant: 'outline' }]}
        />
      )}
    </div>
  );
}

export default function useColumns() {
  const baseUrl = useBaseUrl();
  const locationEnumsQ = useLocationsAsEnumsQ();
  const vehicleEnumsQ = useVehiclesAsEnumsQ();
  const customerEnumsQ = useCustomersAsEnumsQ();
  const employeeEnumsQ = useEmployeesAsEnumsQ();

  return useMemo(
    () =>
      [
        {
          key: 'id',
          name: 'No.',
          renderHeaderFn: () => null,
          renderFn: ({ id }) => <Badge variant="outline">#{id}</Badge>,
        },

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
          renderFn: ({ customerId }) =>
            customerEnumsQ.data && (
              <BadgeGroup
                badges={[
                  {
                    ...customerEnumsQ.data.find((e) => e.value === customerId)!,
                    href: `${baseUrl}/customers/${customerId}`,
                  },
                ]}
              />
            ),
        },

        {
          key: 'status',
          name: 'Status',
          renderFn: ({ status, daysLeft }) => (
            <BadgeGroup
              badges={[
                {
                  ...enums.find(status),
                  tooltip:
                    (daysLeft &&
                      status !== TicketStatus.CLOSED &&
                      ((daysLeft === 0 && 'Ends today') ||
                        (daysLeft > 0 && `${daysLeft} days left`) ||
                        (daysLeft < 0 &&
                          `${-daysLeft} days passed end date`))) ||
                    undefined,
                },
              ]}
            />
          ),
        },

        {
          key: 'locations',
          name: 'Locations',
          renderFn: ({ locationIds }) =>
            locationEnumsQ.data && (
              <BadgeGroup
                badges={locationIds.map((id) => ({
                  ...locationEnumsQ.data.find((e) => e.value === id)!,
                  variant: 'outline',
                }))}
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
                  label: vehicleEnumsQ.data.find((e) => e.value === id)!.label,
                  href: `${baseUrl}/inventory/${id}`,
                }))}
              />
            ),
        },

        {
          key: 'employeeId',
          name: 'Employee',
          renderFn: ({ employeeId }) =>
            employeeEnumsQ.data && (
              <IconLabel
                {...employeeEnumsQ.data.find((e) => e.value === employeeId)!}
              />
            ),
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
      baseUrl,
      locationEnumsQ.data,
      vehicleEnumsQ.data,
      customerEnumsQ.data,
      employeeEnumsQ.data,
    ],
  );
}
