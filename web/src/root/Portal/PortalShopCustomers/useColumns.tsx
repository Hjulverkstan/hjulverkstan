import { useMemo } from 'react';

import * as enums from '@data/customer/enums';
import { Customer } from '@data/customer/types';

import * as DataTable from '@components/DataTable';
import IconLabel from '@components/IconLabel';
import { useTicketsAsEnumsQ } from '@data/ticket/queries';
import { TicketBadges } from '../PortalShopTickets/useColumns';
import BadgeGroup from '@components/BadgeGroup';

//

export default function useColumns() {
  const ticketEnumsQ = useTicketsAsEnumsQ();

  return useMemo(
    () =>
      [
        {
          key: 'name',
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
          key: 'tickets',
          name: 'Tickets',
          renderFn: ({ ticketIds }) => <TicketBadges ticketIds={ticketIds} />,
        },

        {
          key: 'persidnr',
          name: 'Pers. Identity No.',
          renderFn: ({ personalIdentityNumber }) => (
            <IconLabel label={personalIdentityNumber} />
          ),
        },

        {
          key: 'phonenr',
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
      ] as Array<DataTable.Column<Customer>>,
    [ticketEnumsQ.data],
  );
}
