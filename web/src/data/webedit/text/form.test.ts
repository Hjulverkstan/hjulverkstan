import { describe, expect, it } from 'vitest';
import { createTextZ } from './form';

describe('text form utilities', () => {
  describe('createTextZ', () => {
    const schema = createTextZ();

    it('should validate when value is a non-empty string', () => {
      expect(schema.safeParse({ value: 'Hello' }).success).toBe(true);
    });

    it('should validate when value is an empty string', () => {
      expect(schema.safeParse({ value: '' }).success).toBe(true);
    });
  });
});
