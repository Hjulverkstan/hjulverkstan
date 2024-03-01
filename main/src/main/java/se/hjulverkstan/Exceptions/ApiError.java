package se.hjulverkstan.Exceptions;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ApiError {
	private String error;
	private String message;
	private Integer status;

}
