import fs from "fs";
import path from "path";
import sharp from "sharp";

const inputRoot = "public/collage";
const outputRoot = "public/collage-optimized";

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) return walk(fullPath);

    const ext = path.extname(entry.name).toLowerCase();
    if (!IMAGE_EXTS.has(ext)) return [];

    return [fullPath];
  });
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function normalized(p) {
  return p.replaceAll("\\", "/").toLowerCase();
}

function getCategoryConfig(filePath) {
  const p = normalized(filePath);

  if (p.includes("/old photos/") || p.includes("/landscape/")) {
    return { maxEdge: 1800, targetKB: 850, qualities: [78, 72, 66, 60, 54] };
  }

  if (p.includes("/paper/") || p.includes("/textures/")) {
    return { maxEdge: 1400, targetKB: 500, qualities: [76, 70, 64, 58, 52] };
  }

  if (p.includes("/overlay/")) {
    return { maxEdge: 1400, targetKB: 450, qualities: [76, 70, 64, 58, 52] };
  }

  if (p.includes("/tape/")) {
    return { maxEdge: 1200, targetKB: 400, qualities: [82, 76, 70, 64, 58] };
  }

  if (p.includes("/ransom notes/")) {
    return { maxEdge: 1200, targetKB: 350, qualities: [78, 72, 66, 60, 54] };
  }

  return { maxEdge: 1400, targetKB: 500, qualities: [76, 70, 64, 58, 52] };
}

async function encodeWithTarget(inputPath, config) {
  const metadata = await sharp(inputPath, { failOn: "none" }).metadata();

  const width = metadata.width || 0;
  const height = metadata.height || 0;
  const longEdge = Math.max(width, height);

  const resizeOptions =
    longEdge > config.maxEdge
      ? {
          width: width >= height ? config.maxEdge : undefined,
          height: height > width ? config.maxEdge : undefined,
          withoutEnlargement: true,
        }
      : null;

  let bestBuffer = null;
  let bestQuality = config.qualities[0];

  for (const quality of config.qualities) {
    let pipeline = sharp(inputPath, { failOn: "none" }).rotate();

    if (resizeOptions) {
      pipeline = pipeline.resize(resizeOptions);
    }

    const buffer = await pipeline
      .webp({
        quality,
        effort: 6,
        smartSubsample: true,
      })
      .toBuffer();

    bestBuffer = buffer;
    bestQuality = quality;

    if (buffer.length / 1024 <= config.targetKB) {
      break;
    }
  }

  return { buffer: bestBuffer, quality: bestQuality };
}

async function optimizeImage(inputPath) {
  const p = normalized(inputPath);

  // masks 单独走黑色转 alpha，不在这里普通压缩
  if (p.includes("/masks/")) return;

  const relativePath = path.relative(inputRoot, inputPath);
  const outputRelative = relativePath.replace(/\.(jpg|jpeg|png|webp)$/i, ".webp");
  const outputPath = path.join(outputRoot, outputRelative);

  ensureDir(outputPath);

  const config = getCategoryConfig(inputPath);
  const { buffer, quality } = await encodeWithTarget(inputPath, config);

  fs.writeFileSync(outputPath, buffer);

  const beforeKB = fs.statSync(inputPath).size / 1024;
  const afterKB = fs.statSync(outputPath).size / 1024;

  console.log(
    `${relativePath} -> ${path.relative(".", outputPath)} | ${beforeKB.toFixed(
      0
    )}KB -> ${afterKB.toFixed(0)}KB | q=${quality}`
  );
}

async function main() {
  if (!fs.existsSync(inputRoot)) {
    console.error(`Input folder not found: ${inputRoot}`);
    process.exit(1);
  }

  fs.rmSync(outputRoot, { recursive: true, force: true });
  fs.mkdirSync(outputRoot, { recursive: true });

  const files = walk(inputRoot);

  for (const file of files) {
    try {
      await optimizeImage(file);
    } catch (err) {
      console.error(`Failed: ${file}`);
      console.error(err);
    }
  }

  console.log(`Done. Optimized normal assets saved to ${outputRoot}`);
}

main();
