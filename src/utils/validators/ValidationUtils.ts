export interface ValidationResult {
  valid: boolean;
  message: string;
}

export abstract class Validator<T> {
  abstract validate(data: T): ValidationResult;
}

export class CompositeValidator<T> extends Validator<T> {
  private validators: Validator<T>[];

  constructor(validators: Validator<T>[] = []) {
    super();
    this.validators = validators;
  }

  addValidator(validator: Validator<T>): void {
    this.validators.push(validator);
  }

  validate(data: T): ValidationResult {
    for (const validator of this.validators) {
      const result = validator.validate(data);
      if (!result.valid) {
        return result;
      }
    }

    return { valid: true, message: '' };
  }
}

export class ValidationUtils {
  static notEmpty(value: string, fieldName: string): ValidationResult {
    if (!value || value.trim() === '') {
      return {
        valid: false,
        message: `O campo ${fieldName} não pode estar vazio.`,
      };
    }
    return { valid: true, message: '' };
  }

  static isEmail(value: string): ValidationResult {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return {
        valid: false,
        message: 'Email inválido.',
      };
    }
    return { valid: true, message: '' };
  }

  static isNumber(value: string | number, fieldName: string): ValidationResult {
    if (isNaN(Number(value))) {
      return {
        valid: false,
        message: `O campo ${fieldName} deve ser um número.`,
      };
    }
    return { valid: true, message: '' };
  }

  static isPositive(value: number, fieldName: string): ValidationResult {
    if (value <= 0) {
      return {
        valid: false,
        message: `O campo ${fieldName} deve ser maior que zero.`,
      };
    }
    return { valid: true, message: '' };
  }

  static isValidDate(value: string | Date, fieldName: string): ValidationResult {
    const date = value instanceof Date ? value : new Date(value);

    if (isNaN(date.getTime())) {
      return {
        valid: false,
        message: `O campo ${fieldName} contém uma data inválida.`,
      };
    }
    return { valid: true, message: '' };
  }
}
