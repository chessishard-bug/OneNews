const contactForm = document.getElementById("contact-form");

contactForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const contact = {
    name: document.getElementById("contact-name").value.trim(),
    email: document.getElementById("contact-email").value.trim(),
    subject: document.getElementById("contact-subject").value.trim(),
    message: document.getElementById("contact-message").value.trim(),
    date: new Date().toLocaleString("vi-VN"),
  };

  const contacts = JSON.parse(localStorage.getItem("contacts")) || [];

  contacts.push(contact);

  localStorage.setItem("contacts", JSON.stringify(contacts));

  alert("Gửi liên hệ thành công!");

  contactForm.reset();
});