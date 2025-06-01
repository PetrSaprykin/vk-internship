import React from 'react';
import { observer } from 'mobx-react-lite';
import { uiStore } from './stores/UiStore';
import UserTable from './components/UserTable';
import UserForm from './components/UserForm';
import './App.css';

const App: React.FC = observer(() => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>VK Internship Test Task</h1>
        <div>
          <button onClick={() => uiStore.toggleForm()}>Добавить запись или поле</button>
        </div>
      </header>
      <main className="app-content">
        <UserTable />
      </main>
      <UserForm className={uiStore.isModalOpened ? 'opened' : ''} />
    </div>
  );
});

export default App;
