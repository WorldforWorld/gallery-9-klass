document.addEventListener("DOMContentLoaded", () => {
  fetch("data.json")
    .then((response) => response.json())
    .then((images) => {
      const gallery = document.getElementById("gallery");

      images.forEach((fileName) => {
        const imagePath = `assets/images/${fileName}`;

        const link = document.createElement("a");
        link.href = imagePath;
        link.setAttribute("data-fancybox", "gallery");

        const img = document.createElement("img");
        img.dataset.src = imagePath; // Ленивая загрузка
        img.alt = fileName;
        img.classList.add("lazy");

        const item = document.createElement("div");
        item.classList.add("gallery-item");

        link.appendChild(img);
        item.appendChild(link);
        gallery.appendChild(item);
      });

      // Ждем, пока загрузятся все изображения, затем включаем Masonry
      imagesLoaded(gallery, function () {
        const masonry = new Masonry("#gallery", {
          itemSelector: ".gallery-item",
          percentPosition: true,
          columnWidth: ".gallery-item",
          gutter: 10, // Отступы между элементами
        });

        // Ленивый загрузчик
        const lazyLoad = new IntersectionObserver((entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src;
              img.loading = "lazy";
              img.classList.remove("lazy");
              img.closest(".gallery-item").style.opacity = "1"; // Делаем блок видимым
              observer.unobserve(img);
              masonry.layout(); // Обновляем Masonry после загрузки
            }
          });
        });

        document
          .querySelectorAll(".lazy")
          .forEach((img) => lazyLoad.observe(img));

        Fancybox.bind("[data-fancybox]", {
          Thumbs: false,
        });
      });
    })
    .catch((error) => console.error("Ошибка загрузки изображений:", error));
});
