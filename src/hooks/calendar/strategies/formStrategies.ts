import { EventFormData } from '../types';

interface FormStrategy<T> {
  handleChange: (e: React.ChangeEvent<T>) => void;
}

export class InputChangeStrategy implements FormStrategy<HTMLInputElement | HTMLTextAreaElement> {
  private setFormData: React.Dispatch<React.SetStateAction<EventFormData>>;

  constructor(setFormData: React.Dispatch<React.SetStateAction<EventFormData>>) {
    this.setFormData = setFormData;
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
    const { name, value } = e.target;
    this.setFormData((prev) => ({ ...prev, [name]: value }));
  }
}

export class SelectChangeStrategy {
  private setFormData: React.Dispatch<React.SetStateAction<EventFormData>>;

  constructor(setFormData: React.Dispatch<React.SetStateAction<EventFormData>>) {
    this.setFormData = setFormData;
  }

  handleChange(value: string): void {
    this.setFormData((prev) => ({ ...prev, type: value }));
  }
}

export const createInputChangeHandler = (
  setFormData: React.Dispatch<React.SetStateAction<EventFormData>>
) => {
  const strategy = new InputChangeStrategy(setFormData);
  return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => strategy.handleChange(e);
};

export const createSelectChangeHandler = (
  setFormData: React.Dispatch<React.SetStateAction<EventFormData>>
) => {
  const strategy = new SelectChangeStrategy(setFormData);
  return (value: string) => strategy.handleChange(value);
};
