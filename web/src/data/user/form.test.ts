import { describe, expect, it } from 'vitest';
import { createUserZ, initUser } from './form';
import { AuthRole } from '@data/auth/types';
import { Mode } from '@components/DataForm';

describe('user form utilities', () => {
  describe('initUser', () => {
    it('should initialize with an empty roles array', () => {
      expect(initUser.roles).toEqual([]);
    });
  });

  describe('createUserZ', () => {
    const validBase = {
      roles: [AuthRole.USER],
      username: 'john123',
      email: 'john@example.com',
    };

    describe('Mode.CREATE', () => {
      const schema = createUserZ(Mode.CREATE);

      it('should validate a fully valid user', () => {
        const valid = {
          ...validBase,
          password: 'secret',
          passwordrepeat: 'secret',
        };
        expect(schema.safeParse(valid).success).toBe(true);
      });

      it('should fail when passwords do not match', () => {
        const invalid = {
          ...validBase,
          password: 'secret',
          passwordrepeat: 'different',
        };
        const result = schema.safeParse(invalid);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(
            result.error.issues.some(
              (i) => i.message === 'Passwords must match',
            ),
          ).toBe(true);
        }
      });

      it('should fail when username contains uppercase letters', () => {
        const invalid = {
          ...validBase,
          username: 'John123',
          password: 'secret',
          passwordrepeat: 'secret',
        };
        const result = schema.safeParse(invalid);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(
            result.error.issues.some(
              (i) => i.message === 'Only lowercase and numbers are allowed',
            ),
          ).toBe(true);
        }
      });

      it('should fail when roles array is empty', () => {
        const invalid = {
          ...validBase,
          roles: [],
          password: 'secret',
          passwordrepeat: 'secret',
        };
        const result = schema.safeParse(invalid);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(
            result.error.issues.some(
              (i) => i.message === 'At least one role is required',
            ),
          ).toBe(true);
        }
      });

      it('should fail when password is shorter than 3 characters', () => {
        const invalid = { ...validBase, password: 'ab', passwordrepeat: 'ab' };
        const result = schema.safeParse(invalid);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(
            result.error.issues.some(
              (i) => i.message === 'Password must be at least 3 characters',
            ),
          ).toBe(true);
        }
      });
    });

    describe('Mode.EDIT', () => {
      const schema = createUserZ(Mode.EDIT);

      it('should validate a user without a password in edit mode', () => {
        expect(schema.safeParse(validBase).success).toBe(true);
      });

      it('should fail when email is invalid in edit mode', () => {
        const invalid = { ...validBase, email: 'not-an-email' };
        expect(schema.safeParse(invalid).success).toBe(false);
      });
    });
  });
});
