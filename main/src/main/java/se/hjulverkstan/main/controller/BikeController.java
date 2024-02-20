package se.hjulverkstan.main.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.hjulverkstan.Exceptions.BikeNotFoundException;
import se.hjulverkstan.main.model.Bike;
import se.hjulverkstan.main.service.BikeService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/bike")
public class BikeController {
    private final BikeService bikeService;

    public BikeController(BikeService bikeService) {
        this.bikeService = bikeService;
    }

    @PostMapping("/createBike")
    public ResponseEntity<String> createBike(@RequestBody Bike bike) {
        try {
            bikeService.createBike(bike);
            return ResponseEntity.ok("Successfully created a bike");
        } catch (Exception e) {
            System.err.println("Error creating a bike : " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create a bike");
        }
    }


    @GetMapping("/getAllBikes")
    public ResponseEntity<List<Bike>> getAll() throws BikeNotFoundException {
        return new ResponseEntity<>(bikeService.getAllBikes(), HttpStatus.OK);
    }

    @GetMapping("/deleteBike/{id}")
    public void deleteBike(@PathVariable Long id) throws BikeNotFoundException {
        bikeService.deleteBike(id);
    }


}
