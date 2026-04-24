package se.hjulverkstan.main.feature.webedit.story;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import se.hjulverkstan.main.feature.webedit.translation.Language;
import se.hjulverkstan.main.shared.ListResponseDto;

@RestController
@RequestMapping("v1/api/web-edit/story")
@PreAuthorize("hasRole('ROLE_ADMIN')")
@RequiredArgsConstructor
public class StoryController {

    private final StoryService storyService;

    @GetMapping()
    public ListResponseDto<StoryDto> getAllStories(@RequestParam Language lang) {
        return storyService.getAllStoriesByLang(lang);
    }

    @GetMapping("/{id}")
    public StoryDto getStory(@PathVariable Long id, @RequestParam Language lang) {
        return storyService.getStoryByLangAndId(id, lang);
    }

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    public StoryDto createStory(@Valid @RequestBody StoryDto dto, Language lang) {
        return storyService.createStoryByLang(dto, lang);
    }

    @PutMapping("/{id}")
    public StoryDto editStory(@PathVariable Long id, @Valid @RequestBody StoryDto dto, @RequestParam Language lang) {
        return storyService.editStoryByLang(id, dto, lang);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void softDeleteStory(@PathVariable Long id, @RequestParam Language lang) {
        storyService.softDeleteStory(id, lang);
    }

    @DeleteMapping("/{id}/hard")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteStory(@PathVariable Long id, @RequestParam Language lang) {
        storyService.hardDeleteStory(id, lang);
    }
}
