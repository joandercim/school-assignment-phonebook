isEditMode = false;
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
      .addEventListener('click', this.hideAlert.bind(this));
  }

  alert(field) {
    alertEl.style.display = 'flex';
    if (field === 'both') {
      document.getElementById('error-msg').textContent =
        'Du måste fylla i någonting.';
    } else if (field === 'name') {
      document.getElementById('error-msg').textContent =
        'Du måste fylla i ett namn.';
    } else if (field === 'phone') {
      document.getElementById('error-msg').textContent =
        'Du måste fylla i ett telefonnummer.';
    } else if (field === 'number') {
      document.getElementById('error-msg').textContent =
        'Telefonnummer får bara bestå av siffor.';
      setTimeout(() => {
        document.getElementById(
          'error-msg'
        ).innerHTML = `Telefonnummer har inga faktiskt bokstäver. <br>FAKTISKT.`;
      }, 2000);
    }
  }

  hideAlert() {
    alertEl.style.display = 'none';
  }

  chkInput(name, phone) {
    let missingInfo;
    if (name.value === '' && phone.value === '') {
      missingInfo = 'both';
      this.alert(missingInfo);
      return;
    } else if (name.value === '') {
      missingInfo = 'name';
      this.alert(missingInfo);
      return;
    } else if (phone.value === '') {
      missingInfo = 'phone';
      this.alert(missingInfo);
      return;
    } else if (isNaN(phone.value)) {
      missingInfo = 'number';
      this.alert(missingInfo);
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
    this._saveContactToStorage(contact);
  }

  _saveContactToStorage(contact) {
    let contactsInStorage = this._getContactsFromStorage();
    contactsInStorage.push(contact);
    localStorage.setItem('contacts', JSON.stringify(contactsInStorage));
  }

  _getContactsFromStorage() {
    let contactsInStorage;
    if (localStorage.getItem('contacts') !== null) {
      contactsInStorage = JSON.parse(localStorage.getItem('contacts'));
    } else {
      contactsInStorage = [];
    }

    let sortedArray = contactsInStorage.sort((a, b) => {
      var nameA = a.name.toUpperCase();
      var nameB = b.name.toUpperCase();
      
      if (nameA < nameB) {
        return -1;
      } else if (nameA > nameB) {
        return 1;
      } else {
        return 0;
      }
    });

    return sortedArray;

  }

  _deleteContactFromStorage(id) {
    let contactsInStorage = this._getContactsFromStorage();
    const index = contactsInStorage.findIndex(contact => contact.id === id);
    contactsInStorage.splice(index, 1);
    localStorage.setItem('contacts', JSON.stringify(contactsInStorage));
  }

  _displayContactsFromStorage() {
    const contactsInStorage = this._getContactsFromStorage();
    contactsInStorage.forEach(contact => this.createNewContact(contact))
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
    if (!isEditMode) {
      target.children[0].removeAttribute('disabled');
      target.children[1].removeAttribute('disabled');
      target.children[2].classList.replace('fa-edit', 'fa-save');
      isEditMode = true;
    } else {
      target.children[0].setAttribute('value', target.children[0].value);
      target.children[1].setAttribute('value', target.children[1].value);
      target.children[0].setAttribute('disabled', true);
      target.children[1].setAttribute('disabled', true);
      target.children[2].classList.replace('fa-save', 'fa-edit');
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
      this._deleteContactFromStorage(e.target.previousElementSibling.id);
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
    this._displayContactsFromStorage();
  }
}

class Contact {
  constructor(name, phone) {
    this.name = name;
    this.phone = phone;
    this.id = Math.random().toString(16).slice(2);
  }
}

const phoneBook = new PhoneBook();
