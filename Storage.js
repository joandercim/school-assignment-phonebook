class Storage {
  constructor() {}

  static _getContactsFromStorage() {
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

  static _saveContactToStorage(contact) {
    let contactsInStorage = this._getContactsFromStorage();
    contactsInStorage.push(contact);
    localStorage.setItem('contacts', JSON.stringify(contactsInStorage));
  }

  static _updateContactInStorage(id, action, newContact) {
    let contactsInStorage = this._getContactsFromStorage();
    const index = contactsInStorage.findIndex((contact) => contact.id === id);
    if (action === 'update') {
      console.log(`Updated contact with index ${index}`);
      contactsInStorage.splice(index, 1, newContact);
    } else {
      contactsInStorage.splice(index, 1);
    }
    localStorage.setItem('contacts', JSON.stringify(contactsInStorage));
  }
}

export default Storage;
