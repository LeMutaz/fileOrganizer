const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const sharp = require("sharp");

async function getImageHash(filePath) {
  try {
    const imageBuffer = await sharp(filePath).toBuffer();
    return crypto.createHash("sha256").update(imageBuffer).digest("hex");
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return null;
  }
}

async function removeDuplicatesAndRenameImages(directory) {
  if (!fs.existsSync(directory)) {
    console.error("Directory does not exist:", directory);
    return;
  }

  const files = fs
    .readdirSync(directory)
    .filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file));

  if (files.length === 0) {
    console.log("No images found.");
    return;
  }

  const hashMap = new Map();
  const duplicates = [];

  for (const file of files) {
    const filePath = path.join(directory, file);
    const hash = await getImageHash(filePath);

    if (!hash) continue;

    if (hashMap.has(hash)) {
      duplicates.push(filePath);
    } else {
      hashMap.set(hash, filePath);
    }
  }

  // Remove duplicates
  duplicates.forEach((file) => {
    fs.unlinkSync(file);
    console.log("Deleted duplicate:", file);
  });

  // Get remaining images and rename them
  const remainingFiles = fs
    .readdirSync(directory)
    .filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file))
    .sort(); // Sort alphabetically

  remainingFiles.forEach((file, index) => {
    const ext = path.extname(file).toLowerCase();
    let newFileName;

    if (index < 26) {
      // Use letters 'a' to 'z'
      newFileName = String.fromCharCode(97 + index) + ext;
    } else {
      // Use numbers starting from 1
      newFileName = index - 25 + ext;
    }

    const oldPath = path.join(directory, file);
    const newPath = path.join(directory, newFileName);

    if (oldPath !== newPath) {
      fs.renameSync(oldPath, newPath);
      console.log(`Renamed: ${file} → ${newFileName}`);
    }
  });

  console.log("Process completed.");
}

// Usage: Provide the absolute path as an argument
const directoryPath = process.argv[2];

if (!directoryPath) {
  console.error("Please provide a directory path.");
  process.exit(1);
}

removeDuplicatesAndRenameImages(directoryPath);
