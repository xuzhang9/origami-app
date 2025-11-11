import { nanoid } from 'nanoid';

export function generateDeviceToken(): string {
  return nanoid(32);
}

export function verifyFamilyCode(code: string): boolean {
  const familyCode = process.env.FAMILY_CODE || 'origami2024';
  return code === familyCode;
}
