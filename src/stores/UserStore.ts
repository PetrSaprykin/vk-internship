import { makeAutoObservable, runInAction } from 'mobx';
import axios from 'axios';
import { User, ValidationError } from '../types';
import { uiStore } from './UiStore';

class UserStore {
  users: User[] = [];
  loading = false;
  hasMore = true;
  start = 0;
  limit = 10;
  formData: Partial<User> = {};
  formErrors: ValidationError[] = [];
  submitting = false;
  extraFields: { name: string; type: string }[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  addExtraField = (fieldName: string, fieldType: string) => {
    if (!this.extraFields.find((f) => f.name === fieldName)) {
      this.extraFields.push({ name: fieldName, type: fieldType });
    }
  };

  loadUsers = async () => {
    if (this.loading || !this.hasMore) return;

    this.loading = true;

    try {
      const response = await axios.get(
        `http://localhost:3001/users?_start=${this.start}&_limit=${this.limit}`
        // для сервера `http://ip-сервера:3001/users?_start=${this.start}&_limit=${this.limit}`
      );

      runInAction(() => {
        this.users = [...this.users, ...response.data];
        this.start += this.limit;
        this.hasMore = response.data.length === this.limit;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
        console.error('Ошибка загрузки:', error);
      });
    }
  };

  resetUsers = () => {
    this.users = [];
    this.start = 1;
    this.hasMore = true;
  };

  updateFormField = (field: string, value: string | number) => {
    this.formData = { ...this.formData, [field]: value };
    this.validateField(field, value);
  };

  validateField = (field: string, value: string | number) => {
    const errors = this.formErrors.filter((error) => error.field !== field);

    const fieldType = this.extraFields.find((f) => f.name === field)?.type || field;

    if (!value || String(value).trim() === '') {
      errors.push({ field, message: 'Поле не может быть пустым' });
    }

    if (fieldType === 'email' && value) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) {
        errors.push({ field, message: 'Некорректный формат email' });
      }
    }

    if (field === 'age' && value !== '') {
      if (isNaN(Number(value)) || Number(value) <= 0) {
        errors.push({
          field,
          message: 'Возраст должен быть положительным числом',
        });
      }
    }

    this.formErrors = errors;
  };

  validateForm = () => {
    const requiredFields = [
      'name',
      'surname',
      'car',
      'age',
      'experience',
      ...this.extraFields.map((f) => f.name),
    ];

    requiredFields.forEach((field) => {
      this.validateField(field, this.formData[field] || '');
    });

    return this.formErrors.length === 0;
  };

  submitForm = async () => {
    if (!this.validateForm()) {
      return;
    }

    this.submitting = true;

    try {
      const response = await axios.post('http://localhost:3001/users', this.formData);
      // для сервера `http://ip-сервера:3001/users`

      runInAction(() => {
        this.users = [response.data, ...this.users];
        this.formData = {};
        this.formErrors = [];
        this.submitting = false;
      });
    } catch (error) {
      runInAction(() => {
        this.submitting = false;
        console.error('Ошибка отправки формы:', error);
      });
    }

    uiStore.toggleForm();
  };
}

export const userStore = new UserStore();
