import { useMemo } from 'react';
import { format } from 'date-fns';

import WarningBadge from '@components/WarningBadge';
import IconLabel from '@components/IconLabel';
import BadgeGroup from '@components/BadgeGroup';

import * as DataTable from '@components/DataTable';
import { VehicleAggregated } from '@data/vehicle/types';
import * as enumsRaw from '@data/vehicle/enums';
import { useLocationsAsEnumsQ } from '@data/location/queries';
import { useTranslateRawEnums } from '@hooks/useTranslateRawEnums';
import { findEnum, findEnumSafe } from '@utils/enums';

import { ShopTicketsBadges } from '../PortalShopTickets/ShopTicketsBadges';

//

export default function useColumns() {
  const enums = useTranslateRawEnums(enumsRaw);
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
            const baseBadge = findEnum(enums, isCustomerOwned);

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
            <IconLabel {...findEnum(enums, vehicleType)}>
              {(strollerType || bikeType) && (
                <span className="text-muted-foreground pl-1">
                  {bikeType && findEnum(enums, bikeType).label}
                  {strollerType && findEnum(enums, strollerType).label}
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
              <BadgeGroup badges={[findEnum(enums, vehicleStatus)]} />
            ),
        },

        {
          key: 'locationId',
          name: 'Location',
          renderFn: ({ locationId }) =>
            locationEnumsQ.data && (
              <IconLabel {...findEnumSafe(locationEnumsQ.data, locationId)} />
            ),
        },

        {
          key: 'ticketIds',
          name: 'Tickets',
          renderFn: ({ ticketIds }) => (
            <ShopTicketsBadges ticketIds={ticketIds} />
          ),
        },

        {
          key: 'brand',
          name: 'Brand',
          renderFn: ({ brand }) =>
            brand && <IconLabel {...findEnum(enums, brand)} />,
        },

        {
          key: 'size',
          name: 'Size',
          renderFn: ({ size }) =>
            size && <IconLabel {...findEnum(enums, size)} />,
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
            brakeType && <IconLabel {...findEnum(enums, brakeType)} />,
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
      ] as Array<DataTable.Column<VehicleAggregated>>,
    [locationEnumsQ.data],
  );
}
