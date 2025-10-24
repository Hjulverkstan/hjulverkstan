import { useAggregatedQueries } from '@hooks/useAggregatedQueries';
import usePortalSlugs from '@hooks/useSlugs';
import { useTicketsAsEnumsQ, useTicketsQ } from '@data/ticket/queries';
import { useEmployeesAsEnumsQ } from '@data/employee/queries';
import { useCustomersAsEnumsQ } from '@data/customer/queries';
import BadgeGroup, { Badge } from '@components/BadgeGroup';
import { findEnum } from '@utils/enums';

export interface ShopTicketsBadgesProps {
  ticketIds: string[];
}

export const ShopTicketsBadges = ({ ticketIds }: ShopTicketsBadgesProps) => {
  const { baseUrl } = usePortalSlugs();

  // Use aggregated queries here to unify query handling and use try/catch
  // around findEnum() in case some relations are out of sync.

  const badgeQ = useAggregatedQueries(
    (tickets, ticketEnums, customerEnums, employeeEnums) =>
      tickets.map((ticket): Badge => {
        try {
          const ticketEnum = findEnum(ticketEnums, ticket.id);
          const customerEnum = findEnum(customerEnums, ticket.customerId);
          const employeeEnum = findEnum(employeeEnums, ticket.employeeId);

          return {
            ...ticketEnum,
            href: `${baseUrl}/shop/tickets/${ticket.id}`,
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
        } catch (e) {
          console.error('<ShopTicketBadges /> failed to get all enums:');
          console.error(e);
          return {} as Badge;
        }
      }),
    [
      useTicketsQ({ ticketIds }),
      useTicketsAsEnumsQ(),
      useCustomersAsEnumsQ(),
      useEmployeesAsEnumsQ(),
    ],
  );

  if (!badgeQ.data) {
    if (badgeQ.error) {
      console.error(
        'Something went wrong with in <ShopTicketsBadges />',
        badgeQ.error,
      );
    }
    return null;
  }

  const open = badgeQ.data.filter((b) => b.variant !== 'outline');
  const closedCount = badgeQ.data.filter((b) => b.variant === 'outline').length;

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
};
