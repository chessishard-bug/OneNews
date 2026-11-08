
// DOM
const register_form = document.getElementById("register_form")
function checkRegister() {
    // Lay ds ng dung da dki
    const users = JSON.parse(localStorage.getItem("users")) || [];
    // Lay thog tin dki cua ng dung
    const user_name = document.getElementById("register_fullname").value.trim();
    const user_email = document.getElementById("register_email").value.trim();
    const user_password = document.getElementById("register_password").value;
    const user_confirm_password = document.getElementById("register_confirm-password").value;
    if (user_name === "" || user_email === "" || user_password === "" || user_confirm_password === "") {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
    }
    if (user_password !== user_confirm_password) {
        alert("Mật khẩu không khớp!");
        return;
    }

    if (user_password.length < 8) {
        alert("Mật khẩu phải có ít nhất 8 ký tự!");
        return;
    }

    // Ktra mk manh
    if (!/[A-Z]/.test(user_password)) {
        alert("Mật khẩu phải chứa ít nhất một chữ cái viết hoa!");
        return;
    }
    if (!/[a-z]/.test(user_password)) {
        alert("Mật khẩu phải chứa ít nhất một chữ cái viết thường!");
        return;
    }
    if (!/[0-9]/.test(user_password)) {
        alert("Mật khẩu phải chứa ít nhất một chữ số!");
        return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(user_password)) {
        alert("Mật khẩu phải chứa ít nhất một ký tự đặc biệt!");
        return;
    }
    if (users.some(user => user.email === user_email)) {
        alert("Email đã tồn tại!");
        return;
    }
    var newUser = {
        username: user_name,
        email: user_email,
        password: user_password
    };
    alert("Dang ki thanh cong!!!");
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    window.location.href = "login.html";
    
}
register_form.addEventListener("submit", function (event) {
  event.preventDefault();
  checkRegister();
});
