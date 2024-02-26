package se.hjulverkstan.main.service;

import se.hjulverkstan.main.dto.EmployeeDto;
import se.hjulverkstan.main.dto.NewEmployeeDto;
import se.hjulverkstan.main.dto.NewWorkshopDto;
import se.hjulverkstan.main.dto.WorkshopDto;
import se.hjulverkstan.main.dto.responses.GetAllWorkshopDto;

public interface WorkshopService {
    public GetAllWorkshopDto getAllWorkshop();
    public WorkshopDto getWorkshopById(Long id);
    public WorkshopDto deleteWorkshop(Long id);
    public WorkshopDto editWorkshop(Long id, WorkshopDto workshop);
    public WorkshopDto createWorkshop(NewWorkshopDto newWorkshop);
}
