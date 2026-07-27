const backToTop = document.getElementById("backToTop");

window.onscroll = function () {
  if (window.scrollY > 300) {
    backToTop.style.display = "block";
  } else {
    backToTop.style.display = "none";
  }
};

backToTop.onclick = function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
const btn = document.getElementById("button-lightDark");

btn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    btn.textContent = "☀️";
    localStorage.setItem("theme", "dark");
  } else {
    btn.textContent = "🌙";
    localStorage.setItem("theme", "light");
  }
});
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  btn.textContent = "☀️";
}

function chucNangPhatTrien() {
  alert("🔍 Chức năng tìm kiếm sẽ được cập nhật trong phiên bản tiếp theo!");
  return false;
}
