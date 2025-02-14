import { useMemo } from 'react';

import { useCustomersAsEnumsQ } from '@data/customer/queries';
import { useEmployeesAsEnumsQ } from '@data/employee/queries';
import { useLocationsAsEnumsQ } from '@data/location/queries';
import * as enums from '@data/ticket/enums';
import { TicketAggregated, TicketStatus } from '@data/ticket/types';
import { useVehiclesAsEnumsQ } from '@data/vehicle/queries';
import { useTicketsAsEnumsQ, useTicketsQ } from '@data/ticket/queries';
import * as U from '@utils';

import BadgeGroup from '@components/BadgeGroup';
import * as DataTable from '@components/DataTable';
import IconLabel from '@components/IconLabel';
import { Badge } from '@components/shadcn/Badge';
import { format } from 'date-fns';
import usePortalSlugs from '@hooks/useSlugs';

//

export function TicketBadges({ ticketIds }: { ticketIds: string[] }) {
  const { coreUrl } = usePortalSlugs();

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

  const badges = ticketIds
    .filter((ticketId) => ticketsQ.data.find((t) => t.id == ticketId))
    .map((ticketId) => {
      const ticket = ticketsQ.data.find((t) => t.id === ticketId)!;
      const ticketEnum = ticketEnumsQ.data.find((e) => e.value === ticketId)!;
      const customerEnum = customerEnumsQ.data.find(
        (e) => e.value === ticket.customerId,
      )!;
      const employeeEnum = employeeEnumsQ.data.find(
        (e) => e.value === ticket.employeeId,
      )!;

      return {
        ...ticketEnum,
        href: `${coreUrl}/ticketz/${ticketId}`,
        tooltip: (
          <div className="flex">
            {customerEnum.icon && (
              <customerEnum.icon className="mr-1 h-4 w-4" />
            )}
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
  const { coreUrl } = usePortalSlugs();
  const locationEnumsQ = useLocationsAsEnumsQ();
  const vehicleEnumsQ = useVehiclesAsEnumsQ();
  const customerEnumsQ = useCustomersAsEnumsQ();
  const employeeEnumsQ = useEmployeesAsEnumsQ();

  return useMemo(
    () =>
      [
        {
          key: 'id',
          name: '#',
          renderFn: ({ id }, { selected }) => (
            <Badge variant={selected ? 'contrast' : 'outline'}>#{id}</Badge>
          ),
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
                    href: `${coreUrl}/customers/${customerId}`,
                  },
                ]}
              />
            ),
        },

        {
          key: 'ticketStatus',
          name: 'Status',
          renderFn: ({ ticketStatus, daysSinceUpdate }) =>
            ticketStatus && (
              <BadgeGroup
                badges={[
                  {
                    ...enums.find(ticketStatus),
                    tooltip:
                      daysSinceUpdate === undefined
                        ? undefined
                        : ticketStatus === TicketStatus.CLOSED
                          ? `Closed ${U.formatDays(daysSinceUpdate)}`
                          : `Status updated ${U.formatDays(daysSinceUpdate)}`,
                  },
                ]}
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
                  href: `${coreUrl}/inventory/${id}`,
                }))}
              />
            ),
        },

        {
          key: 'locations',
          name: 'Vehicle Locations',
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
              {row.startDate ? format(row.startDate, 'yyyy-MM-dd') : ''}
            </span>
          ),
        },

        {
          key: 'endDate',
          name: 'End Date',
          renderFn: (row) =>
            row.endDate && (
              <span className="text-muted-foreground text-elipsis">
                {row.endDate ? format(row.endDate, 'yyyy-MM-dd') : 'N/A'}
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

        {
          key: 'createdat',
          name: 'Created at',
          renderFn: ({ createdAt }) => (
            <IconLabel label={format(new Date(createdAt), 'yyyy-MM-dd')} />
          ),
        },

        {
          key: 'updatedat',
          name: 'Edited at',
          renderFn: ({ updatedAt }) => (
            <IconLabel label={format(new Date(updatedAt), 'yyyy-MM-dd')} />
          ),
        },
      ] as Array<DataTable.Column<TicketAggregated>>,
    [
      coreUrl,
      locationEnumsQ.data,
      vehicleEnumsQ.data,
      customerEnumsQ.data,
      employeeEnumsQ.data,
    ],
  );
}
