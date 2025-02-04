document.addEventListener("DOMContentLoaded", () => {
  let currentIndex = 0; // Индекс текущей загруженной картинки
  const imagesPerBatch = 15; // Количество изображений, которое загружается за раз
  let images = []; // Массив всех картинок
  let isLoadImage = false;
  fetch("data.json")
    .then((response) => response.json())
    .then((allImages) => {
      images = allImages; // Сохраняем все изображения
      const ImageCount = isLoadImage ? imagesPerBatch - 5 : imagesPerBatch;
      loadImages(currentIndex, ImageCount); // Загружаем первые 10 изображений
      isLoadImage = true; // Переключаем флаг на загрузку изображений в следующий раз
    })
    .catch((error) => console.error("Ошибка загрузки изображений:", error));

  // Функция для загрузки изображений
  function loadImages(startIndex, count) {
    const gallery = document.getElementById("gallery");

    // Загрузка изображений в указанном диапазоне
    for (let i = startIndex; i < startIndex + count && i < images.length; i++) {
      const fileName = images[i];
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

      // Слушаем событие загрузки изображения
      img.addEventListener("load", () => {
        // После того как изображение загружено, рассчитываем его размер
        const aspectRatio = img.naturalWidth / img.naturalHeight; // Получаем соотношение сторон
        const width = img.clientWidth; // Получаем текущую ширину изображения
        const height = width / aspectRatio; // Вычисляем высоту
        img.style.height = `${height}px`; // Устанавливаем вычисленную высоту
      });
    }

    // Обновляем индекс для следующей порции изображений
    currentIndex += count;

    // Ждем, пока загрузятся все изображения, затем включаем Masonry
    imagesLoaded(gallery, function () {
      // Инициализация Masonry после загрузки изображений
      const masonry = new Masonry("#gallery", {
        itemSelector: ".gallery-item",
        percentPosition: true,
        columnWidth: ".gallery-item",
        gutter: 10, // Отступы между элементами
      });

      // Обновляем layout после загрузки изображений
      masonry.layout();

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
  }

  // Проверка прокрутки и подгрузка новых изображений
  window.addEventListener("scroll", () => {
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 200
    ) {
      // Если прокручено до конца (с небольшой подставкой 200px)
      loadImages(currentIndex, imagesPerBatch);
    }
  });
});
