export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  age: number;
  position: string;
  [key: string]: string | number; // Для поддержки динамических полей
}

export interface ValidationError {
  field: string;
  message: string;
}
