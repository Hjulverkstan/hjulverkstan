package se.hjulverkstan.main.service;

import se.hjulverkstan.Exceptions.BikeNotFoundException;
import se.hjulverkstan.main.model.Bike;

import java.util.List;

public interface BikeService {

    public void createBike(Bike bike);

    List<Bike> getAllBikes() throws BikeNotFoundException;

    public void deleteBike(Long id) throws BikeNotFoundException;
}
