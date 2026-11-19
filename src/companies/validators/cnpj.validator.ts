
import {
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

export function normalizeCnpj(value: string): string {
  return value
    .replace(/[.\-/\s]/g, '')
    .toUpperCase();
}

export function isValidCnpj(value: string): boolean {
  const cnpj = normalizeCnpj(value);

  // 12 caracteres alfanuméricos + 2 dígitos numéricos.
  if (!/^[A-Z0-9]{12}\d{2}$/.test(cnpj)) {
    return false;
  }

  // Rejeita sequências repetidas.
  if (/^([A-Z0-9])\1{13}$/.test(cnpj)) {
    return false;
  }

  const calculateDigit = (
    value: string,
    weights: number[],
  ): number => {
    const sum = value
      .split('')
      .reduce((total, character, index) => {
        const numericValue = character.charCodeAt(0) - 48;

        return total + numericValue * weights[index];
      }, 0);

    const remainder = sum % 11;

    return remainder < 2 ? 0 : 11 - remainder;
  };

  const firstWeights = [
    5, 4, 3, 2, 9, 8,
    7, 6, 5, 4, 3, 2,
  ];

  const secondWeights = [
    6, 5, 4, 3, 2, 9,
    8, 7, 6, 5, 4, 3, 2,
  ];

  const base = cnpj.substring(0, 12);

  const firstDigit = calculateDigit(
    base,
    firstWeights,
  );

  const secondDigit = calculateDigit(
    base + firstDigit,
    secondWeights,
  );

  return (
    firstDigit === Number(cnpj[12]) &&
    secondDigit === Number(cnpj[13])
  );
}

export function IsCnpj(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (object, propertyName) => {
    registerDecorator({
      name: 'isCnpj',
      target: object.constructor,
      propertyName: propertyName.toString(),
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          return (
            typeof value === 'string' &&
            isValidCnpj(value)
          );
        },
        defaultMessage(): string {
          return 'O CNPJ informado é inválido.';
        },
      },
    });
  };
}
