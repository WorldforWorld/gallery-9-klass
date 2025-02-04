const fs = require("fs");
const path = require("path");

const imagesDir = path.join(__dirname, "assets/images");
const outputFile = path.join(__dirname, "data.json");

fs.readdir(imagesDir, (err, files) => {
  if (err) {
    console.error("Ошибка при чтении папки:", err);
    return;
  }

  // Фильтруем только файлы изображений (по расширениям)
  // const settingsExtention = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"]
  const settingsExtention = [".jpg"];
  const imageFiles = files.filter((file) =>
    settingsExtention.includes(path.extname(file).toLowerCase())
  );

  // Записываем в JSON
  fs.writeFile(outputFile, JSON.stringify(imageFiles, null, 2), (err) => {
    if (err) {
      console.error("Ошибка при записи файла:", err);
    } else {
      console.log(
        `Файл data.json успешно создан. Найдено ${imageFiles.length} изображений.`
      );
    }
  });
});
