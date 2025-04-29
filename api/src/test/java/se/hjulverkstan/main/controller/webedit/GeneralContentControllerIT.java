package se.hjulverkstan.main.controller.webedit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(controllers = GeneralContentController.class)
public class GeneralContentControllerIT {

    @Autowired
    private MockMvc mockMvc;

}
