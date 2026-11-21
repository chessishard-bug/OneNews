
const CATEGORY_FEEDS = {
  thoisu: {
    name: "Thời sự",
    url: "https://vnexpress.net/rss/thoi-su.rss"
  },
  thegioi: {
    name: "Thế giới",
    url: "https://vnexpress.net/rss/the-gioi.rss"
  },
  kinhdoanh: {
    name: "Kinh doanh",
    url: "https://vnexpress.net/rss/kinh-doanh.rss"
  },
  phapluat: {
    name: "Pháp luật",
    url: "https://vnexpress.net/rss/phap-luat.rss"
  },
  congnghe: {
    name: "Khoa học công nghệ",
    url: "https://vnexpress.net/rss/khoa-hoc-cong-nghe.rss"
  },
  thethao: {
    name: "Thể thao",
    url: "https://vnexpress.net/rss/the-thao.rss"
  },
  giaitri: {
    name: "Giải trí",
    url: "https://vnexpress.net/rss/giai-tri.rss"
  },
  suckhoe: {
    name: "Sức khỏe",
    url: "https://vnexpress.net/rss/suc-khoe.rss"
  },
  doisong: {
    name: "Đời sống",
    url: "https://vnexpress.net/rss/gia-dinh.rss"
  },
  giaoduc: {
    name: "Giáo dục",
    url: "https://vnexpress.net/rss/giao-duc.rss"
  },
  xe: {
    name: "Xe",
    url: "https://vnexpress.net/rss/oto-xe-may.rss"
  },
  batdongsan: {
    name: "Bất động sản",
    url: "https://vnexpress.net/rss/bat-dong-san.rss"
  },
  gocnhin: {
    name: "Góc nhìn",
    url: "https://vnexpress.net/rss/goc-nhin.rss"
  },
  dulich: {
    name: "Du lịch",
    url: "https://vnexpress.net/rss/du-lich.rss"
  },
  ykien: {
    name: "Ý kiến",
    url: "https://vnexpress.net/rss/y-kien.rss"
  },
  tamsu: {
    name: "Tâm sự",
    url: "https://vnexpress.net/rss/tam-su.rss"
  }
};

const params = new URLSearchParams(window.location.search);
const categoryType = params.get("type");

const category = CATEGORY_FEEDS[categoryType];

const title = document.getElementById("category-title");

if (!category) {
  title.textContent = "Danh mục không tồn tại";
} else {
  title.textContent = category.name;
}   

let categoryArticles = [];

function getCategoryNews() {
  const API_KEY = "aqfcgryvu3el7e7f";

  const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(category.url)}&api_key=${API_KEY}&count=50`;

  fetch(API_URL)
    .then(response => response.json())
    .then(data => {
      if (data.status === "ok" && Array.isArray(data.items)) {
        categoryArticles = data.items;
        categoryArticles.sort(
          (a, b) => new Date(b.pubDate) - new Date(a.pubDate)
        );

        console.log(categoryArticles);
        displayedCategoryCount = 6;
        createCategoryNews();
      } else {
        console.error("Không thể tải tin tức:", data);
      }
    })
    .catch(error => {
      console.error("Lỗi tải RSS:", error);
    });
}

let displayedCategoryCount = 6;
const CATEGORY_ARTICLES_PER_LOAD = 6;

function createCategoryNews() {
  const container = document.getElementById("category-news-container");

  const displayedArticles = categoryArticles.slice(
    0,
    displayedCategoryCount
  );

  container.innerHTML = displayedArticles.map(article => {
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

          ${imageUrl ? `
            <img src="${imageUrl}" alt="${article.title}" class="img-fluid">
          ` : ""} 

          <p>${description}</p>

          ${createFavoriteButton(article)}

          <a href="${article.link}" target="_blank" class="stretched-link"></a>
        </div>
      </div>
    `;
  }).join("");
  loadMoreCategoryBtn.style.display =
  displayedCategoryCount < categoryArticles.length
    ? "inline-block"
    : "none";
}
const loadMoreCategoryBtn = document.getElementById("load-more-category");

if (category) {
  getCategoryNews();
}

if (loadMoreCategoryBtn) {
  loadMoreCategoryBtn.addEventListener("click", function () {
    displayedCategoryCount += CATEGORY_ARTICLES_PER_LOAD;
    createCategoryNews();
  });
}
