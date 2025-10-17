import { useMemo } from 'react';
import { format } from 'date-fns';

import WarningBadge from '@components/WarningBadge';
import IconLabel from '@components/IconLabel';
import { TicketBadges } from '../PortalShopTickets/useColumns';
import BadgeGroup from '@components/BadgeGroup';

import * as DataTable from '@components/DataTable';
import { Vehicle } from '@data/vehicle/types';
import * as enumsRaw from '@data/vehicle/enums';
import { useLocationsAsEnumsQ } from '@data/location/queries';
import { useEnums } from '@hooks/useEnums';

//

export default function useColumns() {
  const enums = useEnums(enumsRaw);
  const locationEnumsQ = useLocationsAsEnumsQ();

  return useMemo(
    () =>
      [
        {
          key: 'regTag',
          name: '#',
          renderFn: (
            { regTag, id, isCustomerOwned, warnings = [] },
            { selected },
          ) => {
            const baseBadge = enums.find(isCustomerOwned);

            const variant = selected
              ? 'contrast'
              : warnings.length
                ? 'red'
                : 'outline';

            return warnings.length ? (
              <WarningBadge id={id} warnings={warnings} variant={variant} />
            ) : (
              <BadgeGroup
                badges={[
                  {
                    icon: baseBadge.icon,
                    label: isCustomerOwned ? `#${id}` : regTag,
                    variant,
                  },
                ]}
              />
            );
          },
        },

        {
          key: 'vehicleType',
          name: 'Type',
          renderFn: ({ vehicleType, bikeType, strollerType }) => (
            <IconLabel {...enums.find(vehicleType)}>
              {(strollerType || bikeType) && (
                <span className="text-muted-foreground pl-1">
                  {bikeType && enums.find(bikeType).label}
                  {strollerType && enums.find(strollerType).label}
                </span>
              )}
            </IconLabel>
          ),
        },

        {
          key: 'vehicleStatus',
          name: 'Status',
          renderFn: ({ vehicleStatus }) =>
            vehicleStatus && (
              <BadgeGroup badges={[enums.find(vehicleStatus)]} />
            ),
        },

        {
          key: 'locationId',
          name: 'Location',
          renderFn: ({ locationId }) =>
            locationEnumsQ.data && (
              <IconLabel
                {...locationEnumsQ.data.find((e) => e.value === locationId)!}
              />
            ),
        },

        {
          key: 'ticketIds',
          name: 'Tickets',
          renderFn: ({ ticketIds }) => <TicketBadges ticketIds={ticketIds} />,
        },

        {
          key: 'brand',
          name: 'Brand',
          renderFn: ({ brand }) =>
            brand && <IconLabel {...enums.find(brand)} />,
        },

        {
          key: 'size',
          name: 'Size',
          renderFn: ({ size }) => size && <IconLabel {...enums.find(size)} />,
        },

        {
          key: 'gearCount',
          name: 'Gears',
          renderFn: ({ gearCount }) =>
            !!gearCount && (
              <span className={gearCount === 1 ? 'opacity-50' : ''}>
                {gearCount}
              </span>
            ),
        },

        {
          key: 'brakeType',
          name: 'Brakes',
          renderFn: ({ brakeType }) =>
            brakeType && <IconLabel {...enums.find(brakeType)} />,
        },

        {
          key: 'batchCount',
          name: 'Batch count',
          renderFn: ({ batchCount }) =>
            !!batchCount && <span>{batchCount}</span>,
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
          key: 'createdAt',
          name: 'Created at',
          renderFn: ({ createdAt }) =>
            createdAt ? (
              <IconLabel label={format(new Date(createdAt), 'yyyy-MM-dd')} />
            ) : null,
        },

        {
          key: 'updatedAt',
          name: 'Edited at',
          renderFn: ({ updatedAt }) =>
            updatedAt ? (
              <IconLabel label={format(new Date(updatedAt), 'yyyy-MM-dd')} />
            ) : null,
        },
      ] as Array<DataTable.Column<Vehicle>>,
    [locationEnumsQ.data],
  );
}
