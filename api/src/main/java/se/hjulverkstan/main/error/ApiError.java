package se.hjulverkstan.main.error;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ApiError {
	private String error;
	private String message;
	private Integer status;
}
