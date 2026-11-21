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

// Phan hien thi tai khoan len navbar
document.addEventListener("DOMContentLoaded", function () {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userInfo = document.getElementById("user-info");

  if (!userInfo) return;

  if (currentUser) {
    userInfo.innerHTML = `
      <div class="d-flex align-items-center gap-2">
        <a class="nav-link" href="./profile.html">
          <i class="fa-solid fa-user me-1"></i>
          ${currentUser.username}
        </a>

        <button class="btn btn-outline-danger btn-sm" id="logout-button">
          Đăng xuất
        </button>
      </div>
    `;

    document.getElementById("logout-button").addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      window.location.href = "index.html";
    });
  } else {
    userInfo.innerHTML = `
        <div class="d-flex align-items-center gap-2">
          <a class="nav-link" href="login.html">
            <i class="fa-solid fa-right-to-bracket me-1"></i> Đăng nhập
          </a>
          <a class="nav-link" href="register.html">
            <i class="fa-solid fa-user-plus me-1"></i> Đăng ký
          </a>  
        </div>
      `;
  }
});

const RSS_URLS = [
  "https://vnexpress.net/rss/tin-moi-nhat.rss",
  "https://tuoitre.vn/rss/tin-moi-nhat.rss",
  "https://thanhnien.vn/rss/home.rss",
  "https://dantri.com.vn/rss/trangchinh.rss",
  "https://vietnamnet.vn/home.rss",
];

let allArticles = [];
// Chuc nang "xem them"
let displayedLatestCount = 6;
const ARTICLES_PER_LOAD = 6;
const loadMoreBtn = document.getElementById("load-more");

if (loadMoreBtn) {
  loadMoreBtn.addEventListener("click", function () {
    displayedLatestCount += ARTICLES_PER_LOAD;
    createNews(allArticles);
  });
}
function getNews() {
  const requests = RSS_URLS.map((url) => {
    const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`;

    return fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok" && Array.isArray(data.items)) {
          return data.items;
        }

        console.warn("RSS không tải được:", url, data);
        return [];
      })
      .catch((error) => {
        console.error("Lỗi tải RSS:", url, error);
        return [];
      });
  });

  Promise.all(requests).then((results) => {
    const articles = results.flat();

    articles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    allArticles = articles;
    displayedLatestCount = ARTICLES_PER_LOAD;
    createNews(articles);
  });
}
function createNews(articles) {
  // Tin noi bat
  const featuresNews = document.getElementById("featured-container");
  var features_innerHTML = "";
  for (let i = 0; i < 3 && i < articles.length; i++) {
    const article = articles[i];
    const temp = document.createElement("div");
    temp.innerHTML = article.description;

    const imageUrl = article.enclosure?.link || temp.querySelector("img")?.src;
    const description = article.description.replace(/<img[^>]*>/g, "");

    features_innerHTML += `
      <div class="col-md-4">
      <div class="news-card">
      <h5>${article.title}</h5>
    <img src="${imageUrl}" alt="${article.title}" class="img-fluid">  
    <p>${description}</p>
    ${createFavoriteButton(article)}
      <a href="${article.link}" target="_blank" class="stretched-link"></a>

      </div>
      </div>`;
  }
  featuresNews.innerHTML = features_innerHTML;

  // Tin hom nay
  var today_innerHTML = "";
  const todayNews = document.getElementById("today-news-container");
  for (let i = 3; i < 8 && i < articles.length; i++) {
    const article = articles[i];
    const temp = document.createElement("div");
    temp.innerHTML = article.description;
    const imageUrl = article.enclosure?.link || temp.querySelector("img")?.src;
    const description = article.description.replace(/<img[^>]*>/g, "");
    today_innerHTML += `
      <div class="today-news-card-left">
        <img src="${imageUrl}" alt="${article.title}" class="img-fluid">
        <div class="today-news-card-left-content">
          <h4>${article.title}</h4>
          <p>${description}</p>
        </div>
        ${createFavoriteButton(article)}
        <a href="${article.link}" target="_blank" class="stretched-link"></a>
      </div>`;
  }

  todayNews.innerHTML = today_innerHTML;

  // Tin duoc xem nhieu nhat
  var popular_innerHTML = "";
  const popularNews = document.getElementById("trending-container");
  for (let i = 8; i < 12 && i < articles.length; i++) {
    const article = articles[i];
    const temp = document.createElement("div");
    temp.innerHTML = article.description;
    const description = article.description.replace(/<img[^>]*>/g, "");
    popular_innerHTML += `
      <div class="today-news-card-right">
        <div class="today-news-card-right-content">
          <h4>${article.title}</h4>
          <p>${description}</p>
        </div>
        ${createFavoriteButton(article)}
        <a href="${article.link}" target="_blank" class="stretched-link"></a>
    </div>`;
  }

  popularNews.innerHTML = popular_innerHTML;
  // Tin tuc moi nhat
  const latestNews = document.getElementById("latest-news-container");

  const latestArticles = articles.slice(12, 12 + displayedLatestCount);

  latestNews.innerHTML = latestArticles
    .map((article) => {
      const temp = document.createElement("div");
      temp.innerHTML = article.description || "";
      const imageUrl =
        article.enclosure?.link ||
        article.thumbnail ||
        temp.querySelector("img")?.src ||
        "";

      const description = temp.textContent.trim().slice(0, 220);

      return `
      <div class="col-md-4">
        <div class="news-card">
          <h5>${article.title}</h5>

          ${
            imageUrl
              ? `
            <img src="${imageUrl}" alt="${article.title}" class="img-fluid">
          `
              : ""
          }

          <p>${description}</p>

          ${createFavoriteButton(article)}

          <a href="${article.link}" target="_blank" class="stretched-link"></a>
        </div>
      </div>
    `;
    })
    .join("");

  // Kiem tra con bai bao khong
  const loadMoreBtn = document.getElementById("load-more");

  if (loadMoreBtn) {
    loadMoreBtn.style.display =
      12 + displayedLatestCount < articles.length ? "inline-block" : "none";
  }
}

if (document.getElementById("featured-container")) {
  getNews();
}

function getFavorites() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    return [];
  }

  const key = `favorites_${currentUser.email}`;

  return JSON.parse(localStorage.getItem(key)) || [];
}

function createFavoriteButton(article) {
  const favorites = getFavorites();
  const saved = favorites.some((item) => item.link === article.link);
  const link = encodeURIComponent(article.link);

  return `
    <button
      class="favorite-btn"
      type="button"
      data-link="${link}"
      onclick="toggleFavorite('${link}')"
    >
      ${saved ? "❤️ Đã lưu" : "Yêu thích"}
    </button>
  `;
}
function requireLogin() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    alert("Vui lòng đăng nhập để truy cập trang này!");
    window.location.href = "login.html";
    return false;
  }

  return true;
}
// Phan yeu thich bai bao

function toggleFavorite(encodedLink) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    alert("Vui lòng đăng nhập để sử dụng chức năng yêu thích!");
    window.location.href = "login.html";
    return;
  }

  const link = decodeURIComponent(encodedLink);
  let favorites = getFavorites();

  const index = favorites.findIndex(
    (item) => item.link === link
  );

  if (index !== -1) {
    favorites.splice(index, 1);
  } else {
    const article =
      allArticles.find((item) => item.link === link) ||
      (typeof categoryArticles !== "undefined"
        ? categoryArticles.find((item) => item.link === link)
        : undefined);

    if (article) {
      favorites.push(article);
    }
  }

  const key = `favorites_${currentUser.email}`;

  localStorage.setItem(key, JSON.stringify(favorites));

  const buttons = document.querySelectorAll(
    `.favorite-btn[data-link="${encodedLink}"]`
  );

  buttons.forEach((button) => {
    button.textContent = index !== -1 ? "Yêu thích" : "❤️ Đã lưu";
  });
}


// Phan tim kiem bai bao
const searchForm = document.getElementById("search-form");
if (searchForm) {
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const keyword = document
      .getElementById("search-input")
      .value.trim()
      .toLowerCase();

    const section = document.getElementById("search-section");
    const container = document.getElementById("search-results");

    if (!keyword) {
      section.style.display = "none";
      return;
    }

    // Tim kiem theo tieu de va noi dung
    const results = allArticles.filter((article) => {
      const temp = document.createElement("div");
      temp.innerHTML = article.description || "";

      const content = temp.textContent.toLowerCase();
      const title = article.title.toLowerCase();

      return title.includes(keyword) || content.includes(keyword);
    });

    section.style.display = "block";

    if (results.length === 0) {
      container.innerHTML = "<p>Không tìm thấy bài viết phù hợp!</p>";
      section.scrollIntoView({ behavior: "smooth" });
      return;
    }

    container.innerHTML = results
      .map((article) => {
        const temp = document.createElement("div");
        temp.innerHTML = article.description || "";

        const imageUrl =
          article.enclosure?.link ||
          article.thumbnail ||
          temp.querySelector("img")?.src ||
          "";

        const description = temp.textContent.trim().slice(0, 220);

        return `
      <div class="col-md-4">
        <div class="news-card">
          <h5>${article.title}</h5>

          ${
            imageUrl
              ? `
            <img src="${imageUrl}" alt="${article.title}" class="img-fluid">
          `
              : ""
          }

          <p>${description}</p>

          ${createFavoriteButton(article)}

          <a href="${article.link}" target="_blank" class="stretched-link"></a>
        </div>
      </div>
    `;
      })
      .join("");

    section.scrollIntoView({ behavior: "smooth" });
  });
}
