import Storage from './Storage.js';
import Contact from './Contact.js';
import Alerts from './Alerts.js';

let isEditMode = false;
const ul = document.querySelector('.my-contacts');
const editBtn = document.getElementById('edit');
const deleteBtn = document.getElementById('delete');
const clearAllBtn = document.getElementById('clear');
const submitBtn = document.querySelector('form button');
const alertEl = document.getElementById('alert');

class PhoneBook {
  constructor() {
    this.loadEventListeners();
    this.updateUI();
  }

  loadEventListeners() {
    document
      .querySelector('form')
      .addEventListener('submit', this.getInput.bind(this));
    ul.addEventListener('click', this.onClickEvent.bind(this));
    clearAllBtn.addEventListener('click', this.clearAll.bind(this));
    document
      .getElementById('alert-btn')
      .addEventListener('click', Alerts.hideAlert);
    ul.addEventListener('keyup', Alerts.miniAlert);
    document.querySelector('.sort').addEventListener('click', this.updateUI.bind(this));
  }

  chkInput(name, phone) {
    let missingInfo;

    if (name.value === '' && phone.value === '') {
      missingInfo = 'both';
      Alerts.mainAlert(missingInfo);
      return;
    } else if (name.value === '') {
      missingInfo = 'name';
      Alerts.mainAlert(missingInfo);
      return;
    } else if (phone.value === '') {
      missingInfo = 'phone';
      Alerts.mainAlert(missingInfo);
      return;
    } else if (!/^[0-9-]+$/.test(phone.value)) {
      missingInfo = 'number';
      Alerts.mainAlert(missingInfo);
      return;
    }
    return true;
  }

  getInput(e) {
    e.preventDefault();
    const name = document.getElementById('name');
    const phone = document.getElementById('phone');

    if (!this.chkInput(name, phone)) {
      return;
    }

    const contact = new Contact(name.value, phone.value);

    name.value = '';
    phone.value = '';

    this.createNewContact(contact);
    Storage._saveContactToStorage(contact);
  }

  _displayContactsFromStorage() {
    const contactsInStorage = Storage._getContactsFromStorage();
    contactsInStorage.forEach((contact) => this.createNewContact(contact));
  }

  createNewContact(contact) {
    const { name, phone, id } = contact;
    const li = document.createElement('li');
    li.innerHTML = `
                  <input type="text" value="${name}" name="name-${id}" id="name-${id}" disabled>
                  <input type="text" value="${phone}" name="phone-${id}" id="phone-${id}" disabled>
                  <i class="fa-solid fa-edit edit show" id="${id}"></i>            
                  <i class="fa-solid fa-trash delete show" id="delete"></i>   
              `;

    ul.append(li);

    setTimeout(() => {
      li.classList.add('show');
    }, 10);
  }

  updateContact(target) {
    const name = target.children[0];
    const phone = target.children[1];
    const btn = target.children[2];
    
    if (!isEditMode) {
      target.classList.add('edit-mode');
      document
        .querySelector('.edit-mode')
        .addEventListener('keyup', (e) =>
          e.key === 'Enter' ? btn.click() : null
        );
      name.removeAttribute('disabled');
      phone.removeAttribute('disabled');
      btn.classList.replace('fa-edit', 'fa-save');
      isEditMode = true;
    } else {

      if (!this.chkInput(name, phone)) {
        const response = this.chkInput(name, phone);
        return;
      }

      const updatedContact = {
        name: name.value,
        phone: phone.value,
        id: btn.id
      }

      Storage._updateContactInStorage(btn.id, 'update', updatedContact);

      target.classList.remove('edit-mode');
      name.setAttribute('value', name.value);
      phone.setAttribute('value', phone.value);
      name.setAttribute('disabled', true);
      phone.setAttribute('disabled', true);
      btn.classList.replace('fa-save', 'fa-edit');
      isEditMode = false;
    }
  }

  onClickEvent(e) {
    if (e.target.classList.contains('edit')) {
      this.updateContact(e.target.parentElement);
    } else if (e.target.classList.contains('delete')) {
      e.target.parentElement.classList.remove('show');
      e.target.classList.remove('show');
      setTimeout(() => {
        e.target.parentElement.remove();
      }, 505);
      Storage._updateContactInStorage(
        e.target.previousElementSibling.id,
        'delete'
      );
    }
  }

  clearAll(e) {
    e.preventDefault();
    while (ul.children.length > 0) {
      ul.lastChild.remove();
    }
    localStorage.clear();
  }

  updateUI() {
    ul.innerHTML = '';
    this._displayContactsFromStorage();
  }
}

const phoneBook = new PhoneBook();
