package se.hjulverkstan.main.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import se.hjulverkstan.Exceptions.ApiException;
import se.hjulverkstan.Exceptions.BikeNotFoundException;
import se.hjulverkstan.main.model.Bike;
import se.hjulverkstan.main.repository.BikeRepository;

import java.util.List;
import java.util.Optional;

@Service
public class BikeServiceImpl implements BikeService {

    @Autowired
    private BikeRepository bikeRepository;

    @Override
    public void createBike(Bike bike) {
        bikeRepository.save(bike);

    }

    @Override
    public List<Bike> getAllBikes() throws BikeNotFoundException {
        try{
            return bikeRepository.findAll();
        } catch(Exception e){
            throw new BikeNotFoundException("Couldn't find all bikes");
        }
    }

    @Override
    public void deleteBike(Long id) throws BikeNotFoundException {
        Optional<Bike> bikeToDelete =bikeRepository.findById(id);
        if ( bikeToDelete.isEmpty()) {
            throw new BikeNotFoundException("Couldn't find the bike with the ID : " + id);
        }
        bikeToDelete.ifPresent(bikeRepository::delete);

    }
}
