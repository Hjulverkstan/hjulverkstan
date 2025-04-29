package se.hjulverkstan.main.controller.webedit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(controllers = ShopController.class)
public class ShopControllerIT {

    @Autowired
    private MockMvc mockMvc;

}
