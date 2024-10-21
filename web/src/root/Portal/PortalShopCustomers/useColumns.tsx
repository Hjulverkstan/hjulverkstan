import { useMemo } from 'react';
import { format } from 'date-fns';

import * as enums from '@data/customer/enums';
import { AggregatedCustomer } from '@data/customer/types';

import * as DataTable from '@components/DataTable';
import IconLabel from '@components/IconLabel';
import { useTicketsAsEnumsQ } from '@data/ticket/queries';
import { TicketBadges } from '../PortalShopTickets/useColumns';
import BadgeGroup from '@components/BadgeGroup';

export default function useColumns() {
  const ticketEnumsQ = useTicketsAsEnumsQ();

  return useMemo(
    () =>
      [
        {
          key: 'firstName',
          name: 'Name',
          renderFn: (
            { customerType, firstName, lastName, organizationName },
            { selected },
          ) => (
            <BadgeGroup
              badges={[
                {
                  icon: enums.find(customerType).icon!,
                  variant: selected ? 'contrast' : 'outline',
                  label: organizationName
                    ? `${organizationName} (${firstName} ${lastName})`
                    : `${firstName} ${lastName}`,
                },
              ]}
            />
          ),
        },

        {
          key: 'ticketIds',
          name: 'Tickets',
          renderFn: ({ ticketIds }) => <TicketBadges ticketIds={ticketIds} />,
        },

        {
          key: 'personalIdentityNumber',
          name: 'Pers. Identity No.',
          renderFn: ({ personalIdentityNumber, age }) => {
            return (
              <IconLabel label={`${personalIdentityNumber.slice(0, -4)}****`}>
                <span className="pl-1 text-gray-500"> (age: {age})</span>
              </IconLabel>
            );
          },
        },

        {
          key: 'phoneNumber',
          name: 'Phone No.',
          renderFn: ({ phoneNumber }) => <IconLabel label={phoneNumber} />,
        },

        {
          key: 'email',
          name: 'Email',
          renderFn: ({ email }) => <IconLabel label={email} />,
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
          renderFn: ({ createdAt }) => (
            <IconLabel label={format(new Date(createdAt), 'yyyy-MM-dd')} />
          ),
        },

        {
          key: 'updatedAt',
          name: 'Edited at',
          renderFn: ({ updatedAt }) => (
            <IconLabel label={format(new Date(updatedAt), 'yyyy-MM-dd')} />
          ),
        },
      ] as Array<DataTable.Column<AggregatedCustomer>>,
    [ticketEnumsQ.data],
  );
}
