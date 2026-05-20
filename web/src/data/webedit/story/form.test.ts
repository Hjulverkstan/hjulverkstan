import { describe, expect, it } from 'vitest';
import { createStoryZ, initStory } from './form';

describe('story form utilities', () => {
  describe('initStory', () => {
    it('should initialize as empty object', () => {
      expect(initStory).toEqual({});
    });
  });

  describe('createStoryZ', () => {
    const schema = createStoryZ();

    it('should validate a valid story', () => {
      const valid = { title: 'My Story', slug: 'my-story' };
      expect(schema.safeParse(valid).success).toBe(true);
    });

    it('should fail when title is empty', () => {
      const result = schema.safeParse({ title: '', slug: 'my-story' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.path[0] === 'title')).toBe(
          true,
        );
      }
    });

    it('should fail when slug is missing', () => {
      const result = schema.safeParse({ title: 'A Story' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.path[0] === 'slug')).toBe(
          true,
        );
      }
    });
  });
});
