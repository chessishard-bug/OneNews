if (!requireLogin()) {
  throw new Error("Người dùng chưa đăng nhập!");
}

const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const favorites = getFavorites();

document.getElementById("profile-name").textContent =
  currentUser.username;

document.getElementById("profile-username").textContent =
  currentUser.username;

document.getElementById("profile-email").textContent =
  currentUser.email;

document.getElementById("profile-email-detail").textContent =
  currentUser.email;

document.getElementById("profile-favorite-count").textContent =
  favorites.length;