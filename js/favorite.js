if (!requireLogin()) {
  throw new Error("Người dùng chưa đăng nhập!");
}
function displayFavorites() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    alert("Vui lòng đăng nhập để xem danh sách yêu thích!");
    window.location.href = "login.html";
    return;
  }

  const favorites = getFavorites();
  const container = document.getElementById("favorite-container");

  if (favorites.length === 0) {
    container.innerHTML = "<p>Bạn chưa lưu bài viết nào!</p>";
    return;
  }

  let html = "";

  favorites.forEach(article => {
    const temp = document.createElement("div");
    temp.innerHTML = article.description;

    const imageUrl = article.enclosure?.link || temp.querySelector("img")?.src;
    const description = article.description.replace(/<img[^>]*>/g, "");
    const link = encodeURIComponent(article.link);
    
    html += `
      <div class="col-md-4">
        <div class="news-card">
          <h5>${article.title}</h5>
          <img src="${imageUrl}" alt="${article.title}" class="img-fluid">
          <p>${description}</p>

          <button
            class="favorite-btn"
            onclick="removeFavorite('${link}')"
          >
            ❤️ Bỏ yêu thích
          </button>

          <a href="${article.link}" target="_blank" class="stretched-link"></a>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function removeFavorite(encodedLink) {
  const link = decodeURIComponent(encodedLink);

  let favorites = getFavorites();

  favorites = favorites.filter(article => article.link !== link);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const key = `favorites_${currentUser.email}`;

  localStorage.setItem(key, JSON.stringify(favorites));

  displayFavorites();
}
displayFavorites();
