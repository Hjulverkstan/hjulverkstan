package se.hjulverkstan.main.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(controllers = VehicleController.class)
public class VehicleControllerIT {

    @Autowired
    private MockMvc mockMvc;

}
