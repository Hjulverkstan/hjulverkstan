package se.hjulverkstan.main.common.exception;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ApiError {
	private String error;
	private String message;
	private Integer status;

}
