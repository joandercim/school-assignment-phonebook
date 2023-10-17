const alertEl = document.getElementById('alert');

class Alerts {
  constructor() {}

  static mainAlert(field) {
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
        'Endast siffror och bindestreck tillåtet i telefonnummer.';
    }
  }

  static miniAlert(e) {
    if (e.target.parentElement.classList.contains('edit-mode')) {
      if (e.target.value.length < 1) {
        e.target.classList.add('warning');
        e.target.setAttribute('placeholder', `Fältet får inte vara tomt`);
      } else {
        e.target.removeAttribute('placeholder');
        e.target.classList.remove('warning');
      }
    }
  }

  static hideAlert() {
    alertEl.style.display = 'none';
  }
}

export default Alerts;
