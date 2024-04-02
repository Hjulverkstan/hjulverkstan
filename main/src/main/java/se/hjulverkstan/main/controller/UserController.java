package se.hjulverkstan.main.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.hjulverkstan.main.dto.user.SignupRequest;
import se.hjulverkstan.main.service.UserServiceImpl;

@RestController
@RequestMapping("v1/user")
public class UserController {

    UserServiceImpl userService;

    public UserController(UserServiceImpl userService){
        this.userService = userService;
    }


    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        return ResponseEntity.ok(userService.createUser(signUpRequest));
    }

    @GetMapping()
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @Valid @RequestBody SignupRequest signUpRequest){
        return ResponseEntity.ok(userService.updateUser(id,signUpRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id){
        return ResponseEntity.ok(userService.deleteUser(id));
    }

}
