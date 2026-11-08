const loginForm = document.getElementById("login-form");


function checkLogin() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user_email = document.getElementById("email");
    const user_password = document.getElementById("password");
    if (user_email.value === "" || user_password.value === "") {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
    }
    const foundUser = users.find(user => user.email === user_email.value && user.password === user_password.value);
    if (foundUser) {
        alert("Đăng nhập thành công!");
        localStorage.setItem("currentUser", JSON.stringify(foundUser));
        window.location.href = "index.html";
    } else {
        alert("Email hoặc mật khẩu không đúng!");
    }
}
loginForm.addEventListener("submit",function (event) {
    event.preventDefault();
    checkLogin();
}) 
