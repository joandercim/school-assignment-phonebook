class Contact {
    constructor(name, phone) {
      this.name = name;
      this.phone = phone;
      this.id = Math.random().toString(16).slice(2);
    }
}
  
export default Contact;