package se.hjulverkstan.main.dto;

public class ImageDeleteResponse {
    private String message;

    public ImageDeleteResponse(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
