import { useMemo } from 'react';
import { format } from 'date-fns';

import { useCustomersAsEnumsQ } from '@data/customer/queries';
import { useEmployeesAsEnumsQ } from '@data/employee/queries';
import { useLocationsAsEnumsQ } from '@data/location/queries';
import { useVehiclesAsEnumsQ } from '@data/vehicle/queries';
import * as enumsRaw from '@data/ticket/enums';
import { TicketAggregated, TicketStatus } from '@data/ticket/types';
import * as C from '@utils/common';

import BadgeGroup from '@components/BadgeGroup';
import IconLabel from '@components/IconLabel';
import WarningBadge from '@components/WarningBadge';
import * as DataTable from '@components/DataTable';
import usePortalSlugs from '@hooks/useSlugs';
import { useTranslateRawEnums } from '@hooks/useTranslateRawEnums';
import { findEnum, findEnumSafe } from '@utils/enums';

export default function useColumns() {
  const { coreUrl } = usePortalSlugs();

  const enums = useTranslateRawEnums(enumsRaw);
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
          renderFn: ({ id, warnings = [] }, { selected }) => {
            const variant = selected
              ? 'contrast'
              : warnings.length
                ? 'red'
                : 'outline';

            return warnings.length ? (
              <WarningBadge id={id} warnings={warnings} variant={variant} />
            ) : (
              <BadgeGroup badges={[{ label: `#${id}`, variant }]} />
            );
          },
        },

        {
          key: 'ticketType',
          name: 'Type',
          renderFn: ({ ticketType }) => (
            <IconLabel {...findEnum(enums, ticketType)} />
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
                    ...findEnum(enums, ticketStatus),
                    tooltip:
                      daysSinceUpdate === undefined
                        ? undefined
                        : ticketStatus === TicketStatus.CLOSED
                          ? `Closed ${C.formatDays(daysSinceUpdate)}`
                          : `Status updated ${C.formatDays(daysSinceUpdate)}`,
                  },
                ]}
              />
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
                    ...findEnumSafe(customerEnumsQ.data, customerId),
                    href: `${coreUrl}/customers/${customerId}`,
                  },
                ]}
              />
            ),
        },

        {
          key: 'location',
          name: 'Location',
          renderFn: ({ locationId }) =>
            locationEnumsQ.data && (
              <BadgeGroup
                badges={[
                  {
                    ...findEnumSafe(locationEnumsQ.data, locationId),
                    variant: 'outline',
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
                  ...findEnumSafe(vehicleEnumsQ.data, id),
                  href: `${coreUrl}/inventory/${id}`,
                }))}
              />
            ),
        },

        {
          key: 'employeeId',
          name: 'Employee',
          renderFn: ({ employeeId }) =>
            employeeEnumsQ.data && (
              <IconLabel {...findEnumSafe(employeeEnumsQ.data, employeeId)} />
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
          renderFn: ({ updatedAt }) => updatedAt && (
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
