import { z } from 'zod';

export const withErrMsg = (message: string) => ({
  errorMap: (issue: any) => ({ ...issue, message }),
});

export const isReq = (dataLabel: string) =>
  withErrMsg(`${dataLabel} is required.`);

export const reqString = (dataLabel: string) =>
  z.string(isReq(dataLabel)).min(1, { message: `${dataLabel} is required.` });

/**
 * Validates a Swedish personal identity number (personnummer).
 *
 * The function checks if the provided personal identity number (PIN) is valid according to Swedish standards.
 * The PIN should be provided in the format `yyyymmdd-xxxx`, but the function will handle the removal of the hyphen internally.
 *
 * The validation process includes:
 * - Removing the hyphen and ensuring the resulting string is 12 digits long.
 * - Discarding the first two digits (which specify the century) for the checksum calculation.
 * - Extracting the last digit as the control digit.
 * - Calculating the checksum using the Luhn algorithm on the next 9 digits (after removing the first two).
 * - Comparing the checksum result to the control digit.
 *
 * @param {string} pin - The Swedish personal identity number in the format `yyyymmdd-xxxx`.
 * @returns {boolean} - Returns `true` if the PIN is valid, otherwise `false`.
 */

export function isValidSwedishPIN(pin: string): boolean {
  const cleanPIN = pin.replace(/-/g, '');
  if (cleanPIN.length !== 12) return false;

  const numbers = cleanPIN.substring(2).split('').map(Number);
  const controlDigit = numbers.pop();

  const sum = numbers.reduce(
    (acc, num, idx) =>
      acc + (idx % 2 === 0 ? (num * 2 > 9 ? num * 2 - 9 : num * 2) : num),
    0,
  );

  return (10 - (sum % 10)) % 10 === controlDigit;
}

export const swedishPIN = z
  .string()
  .optional()
  .refine((data) => !data || /^\d{8}-\d{4}$/.test(data), {
    message:
      'Personal identification number must be in the format YYYYMMDD-XXXX',
  })
  .refine((data) => !data || isValidSwedishPIN(data), {
    message: 'Invalid personal identification number',
  });
