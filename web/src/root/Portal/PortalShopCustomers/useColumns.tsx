import { useMemo } from 'react';

import * as enums from '@data/customer/enums';
import { Customer } from '@data/customer/types';

import * as DataTable from '@components/DataTable';
import IconLabel from '@components/IconLabel';
import { useTicketsAsEnumsQ } from '@data/ticket/queries';
import { TicketBadges } from '../PortalShopTickets/useColumns';

//

export default function useColumns() {
  const ticketEnumsQ = useTicketsAsEnumsQ();

  return useMemo(
    () =>
      [
        {
          key: 'customerType',
          name: 'Type',
          renderFn: ({ customerType }) => (
            <IconLabel {...enums.find(customerType)} />
          ),
        },

        {
          key: 'name',
          name: 'Name',
          renderFn: ({ firstName, lastName, organizationName }) => (
            <IconLabel label={organizationName ?? `${firstName} ${lastName}`}>
              {organizationName && (
                <span className="text-muted-foreground/60 pl-1">
                  ({firstName} {lastName})
                </span>
              )}
            </IconLabel>
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
