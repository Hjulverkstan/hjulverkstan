package se.hjulverkstan.main.service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import se.hjulverkstan.Exceptions.ElementNotFoundException;
import se.hjulverkstan.main.dto.NewWorkshopDto;
import se.hjulverkstan.main.dto.WorkshopDto;
import se.hjulverkstan.main.dto.responses.GetAllWorkshopDto;
import se.hjulverkstan.main.model.Workshop;
import se.hjulverkstan.main.repository.WorkshopRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class WorkshopServiceImpl implements WorkshopService {
    private final WorkshopRepository workshopRepository;
    public static final String ELEMENT_NAME = "Workshop";

    @Autowired
    public WorkshopServiceImpl(WorkshopRepository workshopRepository) {
        this.workshopRepository = workshopRepository;
    }

    @Override
    public GetAllWorkshopDto getAllWorkshop() {
        List<Workshop> workshops = workshopRepository.findAll();
        List<WorkshopDto> responseList = new ArrayList<>();

        for (Workshop workshop : workshops) {
            responseList.add(new WorkshopDto(workshop));
        }

        return new GetAllWorkshopDto(responseList);
    }

    @Override
    public WorkshopDto getWorkshopById(Long id) {
        Optional<Workshop> workshopOpt = workshopRepository.findById(id);
        if (workshopOpt.isEmpty()) {
            throw new ElementNotFoundException(ELEMENT_NAME);
        }

        return new WorkshopDto(workshopOpt.get());
    }

    @Override
    public WorkshopDto deleteWorkshop(Long id) {
        Optional<Workshop> workshopOpt = workshopRepository.findById(id);
        if (workshopOpt.isEmpty()) {
            throw new ElementNotFoundException(ELEMENT_NAME);
        }

        workshopRepository.delete(workshopOpt.get());
        return new WorkshopDto(workshopOpt.get());
    }

    @Override
    public WorkshopDto editWorkshop(Long id, WorkshopDto workshop) {
        Optional<Workshop> workshopOpt = workshopRepository.findById(id);
        if (workshopOpt.isEmpty()) {
            throw new ElementNotFoundException(ELEMENT_NAME);
        }

        Workshop selectedWorkshop = workshopOpt.get();

        selectedWorkshop.setAddress(workshop.getAddress());
        selectedWorkshop.setPhoneNumber(workshop.getPhoneNumber());
        selectedWorkshop.setLatitude(workshop.getLatitude());
        selectedWorkshop.setLongitude(workshop.getLongitude());
        selectedWorkshop.setComment(workshop.getComment());
        selectedWorkshop.setUpdatedAt(workshop.getUpdatedAt());
        selectedWorkshop.setUpdatedBy(workshop.getUpdatedBy());

        workshopRepository.save(selectedWorkshop);
        return workshop;
    }

    @Override
    public WorkshopDto createWorkshop(NewWorkshopDto newWorkshop) {
        Workshop workshop = new Workshop();
        workshop.setAddress(newWorkshop.getAddress());
        workshop.setPhoneNumber(newWorkshop.getPhoneNumber());
        workshop.setLatitude(newWorkshop.getLatitude());
        workshop.setLongitude(newWorkshop.getLongitude());
        workshop.setComment(newWorkshop.getComment());
        workshop.setCreatedAt(LocalDateTime.now());
        workshop.setUpdatedBy(newWorkshop.getUpdatedBy());

        workshopRepository.save(workshop);
        return new WorkshopDto(workshop);
    }
}
