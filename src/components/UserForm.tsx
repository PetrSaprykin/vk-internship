import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { userStore } from '../stores/UserStore';
import { uiStore } from '../stores/UiStore';
import './UserForm.css';

const DEFAULT_FIELDS = [
  { name: 'name', label: 'Имя', type: 'text' },
  { name: 'surname', label: 'Фамилия', type: 'text' },
  { name: 'car', label: 'Машина', type: 'text' },
  { name: 'age', label: 'Возраст', type: 'number' },
  { name: 'experience', label: 'Стаж вождения', type: 'number' },
];

interface UserFormProps {
  className?: string;
}

const UserForm: React.FC<UserFormProps> = observer((props) => {
  const { formData, formErrors, submitting, updateFormField, submitForm } = userStore;
  const [fields, setFields] = useState(DEFAULT_FIELDS);

  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('text');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm();
  };

  const handleInputChange = (field: string, value: string | number) => {
    updateFormField(field, value);
  };

  const showForm = () => {
    uiStore.toggleForm();
  };

  const addNewField = () => {
    if (!newFieldName.trim()) return;

    if (fields.some((field) => field.name === newFieldName)) {
      alert('Поле с таким именем уже существует');
      return;
    }

    userStore.addExtraField(newFieldName, newFieldType);

    setFields([
      ...fields,
      {
        name: newFieldName,
        label: newFieldName.charAt(0).toUpperCase() + newFieldName.slice(1),
        type: newFieldType,
      },
    ]);

    setNewFieldName('');
    setNewFieldType('text');
  };

  const getFieldError = (fieldName: string) => {
    const error = formErrors.find((err) => err.field === fieldName);
    return error ? error.message : '';
  };

  return (
    <div className={`wrapper ${props.className || ''}`}>
      <div className="form-container">
        <button onClick={showForm} className="close-button">
          X
        </button>
        <div className="form-columns">
          <form onSubmit={handleSubmit}>
            <h3>Добавить нового пользователя</h3>
            {fields.map((field) => (
              <div key={field.name} className="form-group">
                <label htmlFor={field.name}>{field.label}</label>
                <input
                  id={field.name}
                  type={field.type}
                  value={formData[field.name] || ''}
                  onChange={(e) =>
                    handleInputChange(
                      field.name,
                      field.type === 'number' ? parseFloat(e.target.value) : e.target.value
                    )
                  }
                  className={getFieldError(field.name) ? 'error' : ''}
                />
                {getFieldError(field.name) && (
                  <div className="error-message">{getFieldError(field.name)}</div>
                )}
              </div>
            ))}

            <button
              type="submit"
              className="submit-button"
              disabled={submitting || formErrors.length > 0}
            >
              {submitting ? 'Отправка...' : 'Добавить пользователя'}
            </button>
          </form>

          <div className="add-field-container">
            <h3>Добавить новое поле</h3>
            <div className="add-field-form">
              <div className="form-group">
                <label htmlFor="newFieldName">Название поля</label>
                <input
                  id="newFieldName"
                  type="text"
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="newFieldType">Тип поля</label>
                <select
                  id="newFieldType"
                  value={newFieldType}
                  onChange={(e) => setNewFieldType(e.target.value)}
                >
                  <option value="text">Текст</option>
                  <option value="number">Число</option>
                  <option value="email">Email</option>
                </select>
              </div>

              <button type="button" className="add-field-button" onClick={addNewField}>
                Добавить поле
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default UserForm;
