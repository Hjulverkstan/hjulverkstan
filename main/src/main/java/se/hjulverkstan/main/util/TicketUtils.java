package se.hjulverkstan.main.util;

import se.hjulverkstan.main.model.Ticket;

public class TicketUtils {
     public static String ValidateTicket(Ticket t) {
        if(null == t.getTicketType()) return null; 
        switch (t.getTicketType()) {
            case REPAIR -> {
                if ( t.getRepairDescription().equals("")) {
                    return null;
                }
                else {
                    return  "Repair description is required\"";
                }
             }
            case RECEIVE -> {
                if ( t.getTicketStatus() != null) {
                    return "Status must be null for receive tickets";
                }
                else {
                    return null;
                }
             }
             case DONATE -> {
                if ( t.getTicketStatus() != null) {
                    return "Status must be null for donate tickets";
                }
                else {
                    return null;
                }
             }
            default -> {
                return null;
             }
        }
    }
}
