import { EventFormData } from '@/hooks/calendar/types';
import { Validator, ValidationResult, ValidationUtils } from '@/utils/validators/ValidationUtils';

export class EventValidator extends Validator<EventFormData> {
  validate(data: EventFormData): ValidationResult {
    const titleValidation = ValidationUtils.notEmpty(data.title, 'título');
    if (!titleValidation.valid) return titleValidation;

    const dateValidation = ValidationUtils.isValidDate(data.date, 'data');
    if (!dateValidation.valid) return dateValidation;

    const startTimeValidation = ValidationUtils.notEmpty(data.startTime, 'hora de início');
    if (!startTimeValidation.valid) return startTimeValidation;

    const endTimeValidation = ValidationUtils.notEmpty(data.endTime, 'hora de término');
    if (!endTimeValidation.valid) return endTimeValidation;

    const typeValidation = ValidationUtils.notEmpty(data.type, 'tipo de evento');
    if (!typeValidation.valid) return typeValidation;

    const startDateTime = new Date(`${data.date}T${data.startTime}`);
    const endDateTime = new Date(`${data.date}T${data.endTime}`);

    if (startDateTime >= endDateTime) {
      return {
        valid: false,
        message: 'A hora de início deve ser anterior à hora de término.',
      };
    }

    return { valid: true, message: '' };
  }
}
