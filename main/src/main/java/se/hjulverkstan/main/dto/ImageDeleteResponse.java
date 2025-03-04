package se.hjulverkstan.main.dto;

import lombok.Data;

@Data
public class ImageDeleteResponse {
    private final String imageURL;
    private final String message;
}