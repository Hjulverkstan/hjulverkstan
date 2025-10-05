package se.hjulverkstan.main.feature.webedit.story;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import se.hjulverkstan.main.feature.webedit.localisation.Language;

@RestController
@RequestMapping("v1/api/web-edit/story")
@PreAuthorize("hasRole('ROLE_ADMIN')")
@RequiredArgsConstructor
public class StoryController {

    private final StoryService storyService;

    @GetMapping("/{lang}")
    public GetAllStoryDto getAllStories(@PathVariable Language lang) {
        return storyService.getAllStoriesByLang(lang, null);
    }

    @GetMapping("/{lang}/{id}")
    public StoryDto getStory(@PathVariable Language lang, @PathVariable Long id) {
        return storyService.getStoryByLangAndId(lang, id);
    }

    @PostMapping("/{lang}")
    @ResponseStatus(HttpStatus.CREATED)
    public StoryDto createStory(@PathVariable Language lang, @Valid @RequestBody StoryDto dto) {
        return storyService.createStoryByLang(lang, dto);
    }

    @PutMapping("/{lang}/{id}")
    public StoryDto editStory(@PathVariable Language lang, @PathVariable Long id, @Valid @RequestBody StoryDto dto) {
        return storyService.editStoryByLang(lang, id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteStory(@PathVariable Long id) {
        storyService.deleteStory(id);
    }
}
