const ul = document.querySelector('.my-contacts');
const editBtn = document.getElementById('edit');
const deleteBtn = document.getElementById('delete');
isEditMode = false;

function createNewContact(e) {
  e.preventDefault();
  const name = document.getElementById('name');
  const phone = document.getElementById('phone');

  if (name.value === '' || phone.value === '') {
    alert('Fill in all field');
    return;
  }

  const contact = new Contact(name.value, phone.value);

  saveToStorage(contact);

  name.value = '';
  phone.value = '';

  updateUI();
}

function getContactsFromStorage() {
  let contactsInStorage;

  if (localStorage.getItem('contacts') !== null) {
    contactsInStorage = JSON.parse(localStorage.getItem('contacts'));
  } else {
    contactsInStorage = [];
  }

  return contactsInStorage;
}

function saveToStorage(contact) {
  let contactsInStorage = getContactsFromStorage();
  contactsInStorage.push(contact);
  localStorage.setItem('contacts', JSON.stringify(contactsInStorage));
}

function displayContacts() {
  const ul = document.querySelector('.my-contacts');
  ul.innerHTML = '';
  const contactsInStorage = getContactsFromStorage();

  contactsInStorage.forEach((contact) => {
    const li = document.createElement('li');
    const { name, phone, id } = contact;
    li.innerHTML = `
            <input type="text" value="${name}" name="name-${id}" id="name-${id}" disabled>
            <input type="text" value="${phone}" name="phone-${id}" id="phone-${id}" disabled>
            <button class="edit" id="${id}">Ändra</button>            
            <button class="delete" id="delete">Radera</button>   
        `;

    ul.append(li);
  });
}

function editContact(listItem) {
    isEditMode = true;
    const btn = listItem.children[2];
        
  ul.querySelectorAll('input').forEach((input) => {
    input.setAttribute('disabled', false);
    input.parentElement.classList.remove('edit-mode');
  });
    
  const nameField = document.getElementById(`name-${btn.id}`);
  const phoneField = document.querySelector(`#phone-${btn.id}`);
  nameField.removeAttribute('disabled');
  phoneField.removeAttribute('disabled');
  btn.textContent = 'Spara';
  listItem.className = 'edit-mode';


    document.getElementById(btn.id).addEventListener('click', () => {
        const updatedContact = new Contact(nameField.value, phoneField.value);
        btn.parentElement.remove();
          removefromLocalStorage(btn.id);
        saveToStorage(updatedContact);
        updateUI();
    });
}

function deleteContact(contact) {
  const nameField = document.getElementById(`name-${contact.id}`);
  const phoneField = document.querySelector(`#phone-${contact.id}`);

  contact.parentElement.remove();
  removefromLocalStorage(contact.id);
}

function removefromLocalStorage(id) {
  contactsInStorage = getContactsFromStorage();

  const index = contactsInStorage.findIndex((contact) => contact.id === id);

  console.log(index);
  if (index !== -1) {
    contactsInStorage.splice(index, 1);
    console.log('Element at index ' + index + ' removed');
    localStorage.setItem('contacts', JSON.stringify(contactsInStorage));
  }
}

function onClickItem(e) {
  if (e.target.className === 'edit') {
    editContact(e.target.parentElement);
  } else if (e.target.className === 'delete') {
    deleteContact(e.target.previousElementSibling);
  }
}

class Contact {
  constructor(name, phone) {
    this.name = name;
    this.phone = phone;
    this.id = Math.random().toString(16).slice(2);
  }
}

function updateUI() {
  ul.addEventListener('click', onClickItem);
  displayContacts();
  document.querySelector('form').addEventListener('submit', createNewContact);
  isEditMode = false;
}

updateUI();
