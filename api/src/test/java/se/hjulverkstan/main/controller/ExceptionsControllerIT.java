package se.hjulverkstan.main.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(controllers = ExceptionsController.class)
public class ExceptionsControllerIT {

    @Autowired
    private MockMvc mockMvc;

}
