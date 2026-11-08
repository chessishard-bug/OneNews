const backToTop = document.getElementById("backToTop");
if (backToTop) {
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
}

function initLightDarkMode() {
  const btn = document.getElementById("button-lightDark");
  if (!btn) return;

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    btn.textContent = "☀️";
  } else {
    document.body.classList.remove("dark-mode");
    btn.textContent = "🌙";
  }

  btn.onclick = () => {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
      btn.textContent = "☀️";
      localStorage.setItem("theme", "dark");
    } else {
      btn.textContent = "🌙";
      localStorage.setItem("theme", "light");
    }
  };
}

function chucNangPhatTrien() {
  alert("🔍 Chức năng tìm kiếm sẽ được cập nhật trong phiên bản tiếp theo!");
  return false;
}

function cleanDescription(htmlString) {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlString;
  return tempDiv.textContent || tempDiv.innerText || "";
}

document.addEventListener("DOMContentLoaded", async function () {
  initLightDarkMode();

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navList = document.querySelector(".ul-3items");

  if (currentUser && navList) {
    navList.innerHTML = `
            <li class="nav-item">
                <button id="button-lightDark" class="btn btn-outline-dark">🌙</button>
            </li>
            <li class="nav-item">
                <span class="nav-link fw-bold text-primary">
                    <i class="fa-solid fa-user me-1"></i>Chào, ${currentUser.username}
                </span>
            </li>
            <li class="nav-item">
                <button id="logoutBtn" class="btn btn-outline-danger btn-sm">Đăng xuất</button>
            </li>
        `;
    initLightDarkMode();
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("currentUser");
        alert("Đã đăng xuất thành công!");
        window.location.href = "index.html";
      });
    }
  }

  // --- KÉO RSS VÀ ĐỔ DỮ LIỆU CHO TOÀN BỘ TRANG CHỦ ---
  try {
    const res = await fetch(
      "https://api.rss2json.com/v1/api.json?rss_url=https://vnexpress.net/rss/tin-moi-nhat.rss"
    );
    const data = await res.json();

    if (data.status === "ok" && data.items) {
      
      // 1. ĐỔ TIN NỔI BẬT (Lấy 3 bài đầu: index từ 0 đến 2)
      const featuredContainer = document.getElementById("featured-container");
      if (featuredContainer) {
        let html = "";
        data.items.slice(0, 3).forEach((item) => {
          const imgMatch = item.description.match(/src="([^"]+)"/);
          const imageUrl = imgMatch ? imgMatch[1] : "https://via.placeholder.com/300x180";
          const descText = cleanDescription(item.description);

          html += `
            <div class="col-md-4">
              <a href="${item.link}" target="_blank" class="news-link">
                <div class="news-card">
                  <h5>${item.title}</h5>
                  <img src="${imageUrl}" alt="Hình ảnh tin tức" />
                  <p>${descText}</p>
                </div>
              </a>
            </div>
          `;
        });
        featuredContainer.innerHTML = html;
      }

      // 2. ĐỔ TIN TỨC HÔM NAY BÊN TRÁI (Lấy 3 bài tiếp theo: index từ 3 đến 5)
      const todayContainer = document.getElementById("today-news-container");
      if (todayContainer) {
        let htmlToday = "";
        data.items.slice(3, 6).forEach((item) => {
          const imgMatch = item.description.match(/src="([^"]+)"/);
          const imageUrl = imgMatch ? imgMatch[1] : "https://via.placeholder.com/300x180";
          const descText = cleanDescription(item.description);

          htmlToday += `
            <a href="${item.link}" target="_blank" class="news-link">
              <div class="today-news-card-left mb-3">
                <img src="${imageUrl}" alt="Hình ảnh tin tức" />
                <div class="today-news-card-left-content">
                  <h4>${item.title}</h4>
                  <p>${descText.substring(0, 100)}...</p>
                </div>
              </div>
            </a>
          `;
        });
        todayContainer.innerHTML = htmlToday;
      }

      // 3. ĐỔ SIDEBAR BÊN PHẢI (Lấy 3 bài tiếp theo: index từ 6 đến 8)
      const trendingContainer = document.getElementById("trending-container");
      if (trendingContainer) {
        let htmlTrending = "";
        data.items.slice(6, 9).forEach((item) => {
          const pubTime = new Date(item.pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          htmlTrending += `
            <a href="${item.link}" target="_blank" class="news-link">
              <div class="today-news-card-right mb-2">
                <div class="today-news-card-right-content">
                  <h4>${item.title}</h4>
                  <h6>🕒 ${pubTime} - Mới cập nhật</h6>
                </div>
              </div>
            </a>
          `;
        });
        trendingContainer.innerHTML = htmlTrending;
      }

    }
  } catch (err) {
    console.error("Không tải được RSS:", err);
  }
});
