package se.hjulverkstan.main.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NewEmployeeDto {
    private String name;
    @JsonProperty("last_name")
    private String lastName;
    @JsonProperty("phone_number")
    private String phoneNumber;
    private String email;
    //TODO: remove comment when workshops added
    /*private Long workshopId;*/

    // Metadata
    @JsonProperty("updated_by")
    private Long updatedBy;
    private String comment;
}
