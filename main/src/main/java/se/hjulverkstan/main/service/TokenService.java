package se.hjulverkstan.main.service;

import jakarta.servlet.http.HttpServletResponse;
import se.hjulverkstan.Exceptions.TokenRefreshException;
import se.hjulverkstan.main.dto.auth.UserDetails;

public interface TokenService {
    /**
     * Creates and sets authentication cookies containing the JWT and refresh token for a user,
     * then adds these tokens as HTTP-only cookies in the HttpServletResponse.
     *
     * @param response The HttpServletResponse in which to set the cookies.
     * @param userDetails The user details used to generate the JWT and refresh token.
     */
    void createAuthenticationCookies(HttpServletResponse response, UserDetails userDetails);

    /**
     * Refreshes the authentication by verifying the existing refresh token and issuing new JWT and refresh token.
     * and sets them as HTTP-only cookies in the response.
     *
     * @param response The HttpServletResponse in which to set the new cookies.
     * @param requestRefreshToken The refresh token provided by the client to obtain new tokens.
     * @throws TokenRefreshException If the refresh token is invalid or not found in the database.
     */
    void refreshToken(HttpServletResponse response, String requestRefreshToken);


    /**
     * Clears authentication cookies from the HttpServletResponse.
     *
     * @param response The HttpServletResponse from which to clear the cookies.
     */
    void clearAuthenticationCookies(HttpServletResponse response);
}
