
import { isValidCnpj } from './cnpj.validator';

describe('CNPJ Validator', () => {
  it('should accept a valid numeric CNPJ', () => {
    expect(
      isValidCnpj('11.222.333/0001-81'),
    ).toBe(true);
  });

  it('should accept a valid alphanumeric CNPJ', () => {
    expect(
      isValidCnpj('12.ABC.345/01DE-35'),
    ).toBe(true);
  });

  it('should reject an invalid check digit', () => {
    expect(
      isValidCnpj('12.ABC.345/01DE-36'),
    ).toBe(false);
  });

  it('should reject repeated characters', () => {
    expect(
      isValidCnpj('00000000000000'),
    ).toBe(false);
  });

  it('should reject letters in the check digits', () => {
    expect(
      isValidCnpj('12ABC34501DE3A'),
    ).toBe(false);
  });

  it('should reject an incorrect length', () => {
    expect(
      isValidCnpj('123456789'),
    ).toBe(false);
  });
});
