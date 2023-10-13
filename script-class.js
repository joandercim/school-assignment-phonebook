isEditMode = false;
const ul = document.querySelector('.my-contacts');
const editBtn = document.getElementById('edit');
const deleteBtn = document.getElementById('delete');
const clearAllBtn = document.getElementById('clear');
const submitBtn = document.querySelector('form button');

class PhoneBook {
  constructor() {
    this.loadEventListeners();
  }

  loadEventListeners() {
    document
      .querySelector('form')
      .addEventListener('submit', this.getInput.bind(this));
    ul.addEventListener('click', this.onClickEvent.bind(this));
    clearAllBtn.addEventListener('click', this.clearAll.bind(this));
  }

  getInput(e) {
    e.preventDefault();
    const name = document.getElementById('name');
    const phone = document.getElementById('phone');

    // if (name.value === '' || phone.value === '') {
    //   alert('Fill in all field');
    //   return;
    // }

    const contact = new Contact(name.value, phone.value);

    name.value = '';
    phone.value = '';

    this.createNewContact(contact);
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
    }
  }

  clearAll(e) {
    e.preventDefault();
    while (ul.children.length > 0) {
      ul.firstChild.remove();
    }
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

const contact1 = new Contact('John Doe', '0735-264254');
const contact2 = new Contact('Jane Doe', '0735-264254');
const contact3 = new Contact('Johnny Doe', '0735-264254');
const contact4 = new Contact('Missy Doe', '0735-264254');

const phoneBookArrayTEMP = [contact1, contact2, contact3, contact4];
