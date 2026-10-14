package se.hjulverkstan.main.security.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.test.util.ReflectionTestUtils;
import se.hjulverkstan.main.feature.location.Location;
import se.hjulverkstan.main.feature.user.User;
import se.hjulverkstan.main.feature.user.UserRepository;
import se.hjulverkstan.main.security.model.CustomUserDetails;
import se.hjulverkstan.main.security.model.ERole;
import se.hjulverkstan.main.security.model.Role;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomUserDetailsServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CustomUserDetailsService userDetailsService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPassword("hashedpassword");

        Role roleUser = new Role(1, ERole.ROLE_USER);
        Role roleAdmin = new Role(2, ERole.ROLE_ADMIN);
        testUser.setRoles(List.of(roleUser, roleAdmin));
        
        Location location = new Location();
        ReflectionTestUtils.setField(location, "id", 100L);
        testUser.setDefaultLocation(location);
    }

    @Test
    void loadUserByUsername_Success_MappingsAreCorrect() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));

        UserDetails userDetails = userDetailsService.loadUserByUsername("testuser");

        assertInstanceOf(CustomUserDetails.class, userDetails);
        CustomUserDetails customDetails = (CustomUserDetails) userDetails;

        // Identity Mapping
        assertEquals(1L, customDetails.getId());
        assertEquals("testuser", customDetails.getUsername());
        assertEquals("test@example.com", customDetails.getEmail());
        assertEquals("hashedpassword", customDetails.getPassword());
        assertEquals(100L, customDetails.getLocationId());

        // Authority Matrix Mapping
        List<String> authorities = customDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();
        assertEquals(2, authorities.size());
        assertTrue(authorities.contains("ROLE_USER"));
        assertTrue(authorities.contains("ROLE_ADMIN"));

        // Status Mapping
        assertTrue(customDetails.isEnabled());
        assertTrue(customDetails.isAccountNonExpired());
        assertTrue(customDetails.isAccountNonLocked());
        assertTrue(customDetails.isCredentialsNonExpired());
    }

    @Test
    void loadUserByUsername_UserNotFound_ThrowsException() {
        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> userDetailsService.loadUserByUsername("unknown"));
    }

    @Test
    void loadUserByUsername_NoLocation_LocationIdIsNull() {
        testUser.setDefaultLocation(null);
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));

        UserDetails userDetails = userDetailsService.loadUserByUsername("testuser");
        CustomUserDetails customDetails = (CustomUserDetails) userDetails;

        assertNull(customDetails.getLocationId());
    }

    @Test
    void getAuthoritiesAsRoles_ReturnsCorrectERoles() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));

        CustomUserDetails userDetails = (CustomUserDetails) userDetailsService.loadUserByUsername("testuser");
        List<ERole> roles = userDetails.getAuthoritiesAsRoles();

        assertEquals(2, roles.size());
        assertTrue(roles.contains(ERole.ROLE_USER));
        assertTrue(roles.contains(ERole.ROLE_ADMIN));
    }
}
