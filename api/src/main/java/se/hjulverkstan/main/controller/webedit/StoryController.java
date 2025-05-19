package se.hjulverkstan.main.controller.webedit;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import se.hjulverkstan.main.dto.webedit.*;
import se.hjulverkstan.main.model.webedit.Language;
import se.hjulverkstan.main.service.webedit.StoryService;
import static se.hjulverkstan.main.util.WebEditUtils.validateLanguage;
import java.util.List;

@RestController
@RequestMapping("v1/api/web-edit/story")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class StoryController {
    private final StoryService storyService;

    public StoryController(StoryService storyService) {
        this.storyService = storyService;
    }

    @GetMapping
    public ResponseEntity<List<StoryDto>> getAllStories(@RequestParam(name ="lang") String lang) {
        Language language = validateLanguage(lang);
        return new ResponseEntity<>(storyService.getAllStoriesByLang(language), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StoryDto> getStory(@PathVariable Long id, @RequestParam(name = "lang") String lang) {
        Language language = validateLanguage(lang);
        return new ResponseEntity<>(storyService.getStoryByIdAndLang(id, language), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<StoryDto> deleteStory(@PathVariable Long id) {
        return new ResponseEntity<>(storyService.deleteStory(id), HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<StoryDto> createStory(@Valid @RequestBody NewStoryWithLangDto newStory) {
        return new ResponseEntity<>(storyService.createStory(newStory), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StoryDto> editStory(@PathVariable Long id, @Valid @RequestBody UpdateStoryWithLangDto story) {
        return new ResponseEntity<>(storyService.editStory(id, story), HttpStatus.OK);
    }
}
