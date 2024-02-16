package se.hjulverkstan.main.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import se.hjulverkstan.main.model.Bike;
import se.hjulverkstan.main.repository.BikeRepository;

import java.util.List;

@Service
public class BikeServiceImpl implements BikeService {

    @Autowired
    private BikeRepository bikeRepository;

    @Override
    public void createBike(Bike bike) {
        bikeRepository.save(bike);
    }

    @Override
    public List<Bike> getAllBikes() {
        return bikeRepository.findAll();
    }

    @Override
    public void deleteBike(Long id) {
        bikeRepository.findById(id);

    }
}
