package se.hjulverkstan.main.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import se.hjulverkstan.main.dto.NewWorkshopDto;
import se.hjulverkstan.main.dto.WorkshopDto;
import se.hjulverkstan.main.dto.responses.GetAllWorkshopDto;
import se.hjulverkstan.main.service.WorkshopService;

@RestController
@RequestMapping("/workshop")
public class WorkshopController {
    private final WorkshopService service;

    public WorkshopController(WorkshopService service) {
        this.service = service;
    }

    @GetMapping()
    public ResponseEntity<GetAllWorkshopDto> getAllWorkshops() {
        return new ResponseEntity<>(service.getAllWorkshop(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkshopDto> getWorkshopById(@PathVariable Long id) {
        return new ResponseEntity<>(service.getWorkshopById(id), HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<WorkshopDto> createWorkshop(@RequestBody NewWorkshopDto newWorkshop) {
        return new ResponseEntity<>(service.createWorkshop(newWorkshop), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkshopDto> editWorkshop(@PathVariable Long id, @RequestBody WorkshopDto workshop) {
        return new ResponseEntity<>(service.editWorkshop(id, workshop), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<WorkshopDto> deleteWorkshop(@PathVariable Long id) {
        return new ResponseEntity<>(service.deleteWorkshop(id), HttpStatus.OK);
    }
}
