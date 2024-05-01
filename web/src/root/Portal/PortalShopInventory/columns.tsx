import * as ticketEnums from '@data/ticket/enums';
import * as locationEnums from '@data/location/enums';
import * as enums from '@data/vehicle/enums';
import { VehicleAggregated, VehicleStatus } from '@data/vehicle/types';

import * as DataTable from '@components/DataTable';
import BadgeGroup from '@components/BadgeGroup';
import { Badge } from '@components/shadcn/Badge';
import IconLabel from '@components/IconLabel';

//

export default [
  {
    key: 'regTag',
    name: 'Reg.',
    renderFn: ({ regTag }) => <Badge variant="outline">{regTag}</Badge>,
  },
  {
    key: 'location',
    name: 'Location',
    renderFn: ({ location }) => {
      const { icon } = locationEnums.find(location.locationType);

      return <BadgeGroup badges={[{ label: location.name, icon }]} />;
    },
  },
  {
    key: 'vehicleType',
    name: 'Type',
    renderFn: ({ vehicleType, bikeType, strollerType }) => (
      <IconLabel {...enums.find(vehicleType)}>
        {(strollerType || bikeType) && (
          <span className="text-muted-foreground pl-1">
            {bikeType && enums.find(bikeType).name}
            {strollerType && enums.find(strollerType).name}
          </span>
        )}
      </IconLabel>
    ),
  },
  {
    key: 'vehicleStatus',
    name: 'Status',
    renderFn: ({ vehicleStatus }) => {
      if (vehicleStatus) {
        const { icon, name: label } = enums.find(vehicleStatus);

        const variant = {
          [VehicleStatus.AVAILABLE]: 'successOutline',
          [VehicleStatus.UNAVAILABLE]: 'warnOutline',
          [VehicleStatus.BROKEN]: 'destructiveOutline',
        }[vehicleStatus] as any;

        return <BadgeGroup badges={[{ label, icon, variant }]} />;
      }
    },
  },
  {
    key: 'ticketIds',
    name: 'Tickets',
    renderFn: ({ tickets }) => {
      const open =
        tickets
          ?.filter((ticket) => ticket.isOpen)
          .map(({ ticketType, customerFirstName }) => ({
            variant: 'warn' as 'warn',
            label: customerFirstName ?? '',
            icon: ticketEnums.find(ticketType).icon,
          })) ?? [];

      const amountClosed = tickets?.filter((ticket) => !ticket.isOpen).length;
      const closed = amountClosed ? [{ label: amountClosed + ' closed' }] : [];

      return <BadgeGroup badges={[...open, ...closed]} />;
    },
  },
  {
    key: 'brand',
    name: 'Brand',
    renderFn: ({ brand }) => brand && <IconLabel {...enums.find(brand)} />,
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
        <span className={gearCount === 1 ? 'opacity-50' : ''}>{gearCount}</span>
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
    renderFn: ({ batchCount }) => !!batchCount && <span>{batchCount}</span>,
  },
  {
    key: 'comment',
    name: 'Comment',
    renderFn: (row) => (
      <span className="text-muted-foreground text-elipsis">{row.comment}</span>
    ),
  },
] as Array<DataTable.Column<VehicleAggregated>>;
