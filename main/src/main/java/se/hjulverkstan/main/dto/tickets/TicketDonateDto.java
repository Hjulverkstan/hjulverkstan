package se.hjulverkstan.main.dto.tickets;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.hjulverkstan.main.model.TicketDonate;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketDonateDto extends TicketDto {
    @JsonProperty("donated_by")
    private String donatedBy;
    @JsonProperty("donation_date")
    private LocalDateTime donationDate;

    public TicketDonateDto(TicketDonate ticket) {
        super(ticket);
        this.donatedBy = ticket.getDonatedBy();
        this.donationDate = ticket.getDonationDate();
    }
}
