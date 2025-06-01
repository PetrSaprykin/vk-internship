import { makeAutoObservable } from 'mobx';

class UIStore {
  isModalOpened = false;

  constructor() {
    makeAutoObservable(this);
  }

  toggleForm() {
    this.isModalOpened = !this.isModalOpened;
  }
}

export const uiStore = new UIStore();
