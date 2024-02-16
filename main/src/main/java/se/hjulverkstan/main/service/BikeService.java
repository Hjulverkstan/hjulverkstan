package se.hjulverkstan.main.service;

import se.hjulverkstan.main.model.Bike;

import java.util.List;

public interface BikeService {

    public void createBike(Bike bike);

    List<Bike> getAllBikes();

    public void deleteBike(Long id);
}
