package se.hjulverkstan.main.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import se.hjulverkstan.main.model.Bike;
import se.hjulverkstan.main.service.BikeService;

import java.net.http.HttpResponse;
import java.util.List;

@RestController
@RequestMapping("/bike")
public class BikeController {
    private BikeService bikeService;

    public BikeController(BikeService bikeService) {
        this.bikeService = bikeService;
    }
    @GetMapping()
    public ResponseEntity<List<Bike>> getAll() {
        return new ResponseEntity<>(bikeService.getAllBikes(), HttpStatus.OK);
    }
}
