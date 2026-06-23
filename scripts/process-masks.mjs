import fs from "fs";
import path from "path";
import sharp from "sharp";

const inputRoot = "public/collage/masks";
const outputRoot = "public/collage-optimized/masks";

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const MAX_EDGE = 1600;

// black-to-alpha: 黑色/深灰消失，白色/浅色保留
// 这版比之前更激进，减少黑边 halo
const BLACK_THRESHOLD = 70;
const BLACK_FEATHER = 165;

// white-to-alpha: 白色/浅灰消失，黑色/深色保留
const WHITE_THRESHOLD = 238;
const WHITE_FEATHER = 190;

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) return walk(fullPath);

    const ext = path.extname(entry.name).toLowerCase();
    if (!IMAGE_EXTS.has(ext)) return [];

    return [fullPath];
  });
}

async function resized(inputPath) {
  const meta = await sharp(inputPath, { failOn: "none" }).metadata();
  const width = meta.width || 0;
  const height = meta.height || 0;
  const longEdge = Math.max(width, height);

  let pipeline = sharp(inputPath, { failOn: "none" }).rotate();

  if (longEdge > MAX_EDGE) {
    pipeline = pipeline.resize({
      width: width >= height ? MAX_EDGE : undefined,
      height: height > width ? MAX_EDGE : undefined,
      withoutEnlargement: true,
    });
  }

  return pipeline;
}

function sizeKB(filePath) {
  if (!fs.existsSync(filePath)) return 0;
  return fs.statSync(filePath).size / 1024;
}

async function blackToAlpha(inputPath, outputPath) {
  const image = (await resized(inputPath)).ensureAlpha();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    let alpha = 255;

    if (luminance <= BLACK_THRESHOLD) {
      alpha = 0;
    } else if (luminance < BLACK_FEATHER) {
      alpha = Math.round(
        ((luminance - BLACK_THRESHOLD) / (BLACK_FEATHER - BLACK_THRESHOLD)) * 255
      );
    }

    // 关键：去黑边 halo
    // 半透明边缘如果还保留黑色 RGB，放在白底/纸底上会出现灰黑边。
    // 所以 alpha 不是 255 的地方，把 RGB 漂白。
    if (alpha < 255) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
    }

    data[i + 3] = alpha;
  }

  ensureDir(outputPath);

  await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels,
    },
  })
    .png({
      compressionLevel: 9,
      adaptiveFiltering: true,
    })
    .toFile(outputPath);
}

async function whiteToAlpha(inputPath, outputPath) {
  const image = (await resized(inputPath)).ensureAlpha();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    let alpha = 255;

    if (luminance >= WHITE_THRESHOLD) {
      alpha = 0;
    } else if (luminance > WHITE_FEATHER) {
      alpha = Math.round(
        ((WHITE_THRESHOLD - luminance) / (WHITE_THRESHOLD - WHITE_FEATHER)) * 255
      );
    }

    // white-to-alpha 里半透明边缘保留深色 RGB，不漂白
    data[i + 3] = alpha;
  }

  ensureDir(outputPath);

  await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels,
    },
  })
    .png({
      compressionLevel: 9,
      adaptiveFiltering: true,
    })
    .toFile(outputPath);
}

async function optimizePng(inputPath, outputPath) {
  ensureDir(outputPath);

  await (await resized(inputPath))
    .png({
      compressionLevel: 9,
      adaptiveFiltering: true,
    })
    .toFile(outputPath);
}

async function optimizeOverlay(inputPath, outputPath) {
  ensureDir(outputPath);

  await (await resized(inputPath))
    .webp({
      quality: 68,
      effort: 6,
      smartSubsample: true,
    })
    .toFile(outputPath);
}

async function processBucket(bucket, mode) {
  const bucketDir = path.join(inputRoot, bucket);
  const files = walk(bucketDir);

  for (const inputPath of files) {
    const rel = path.relative(bucketDir, inputPath);
    const noExt = rel.replace(/\.(jpg|jpeg|png|webp)$/i, "");

    let outputPath;

    if (mode === "overlay") {
      outputPath = path.join(outputRoot, bucket, `${noExt}.webp`);
    } else {
      outputPath = path.join(outputRoot, bucket, `${noExt}.png`);
    }

    try {
      if (mode === "black-to-alpha") {
        await blackToAlpha(inputPath, outputPath);
      } else if (mode === "white-to-alpha") {
        await whiteToAlpha(inputPath, outputPath);
      } else if (mode === "overlay") {
        await optimizeOverlay(inputPath, outputPath);
      } else {
        await optimizePng(inputPath, outputPath);
      }

      console.log(
        `[${bucket}] ${rel} | ${sizeKB(inputPath).toFixed(0)}KB -> ${sizeKB(outputPath).toFixed(0)}KB`
      );
    } catch (err) {
      console.error(`[failed] ${bucket}/${rel}`);
      console.error(err);
    }
  }
}

async function main() {
  if (!fs.existsSync(inputRoot)) {
    console.error(`Missing folder: ${inputRoot}`);
    process.exit(1);
  }

  fs.rmSync(outputRoot, { recursive: true, force: true });
  fs.mkdirSync(outputRoot, { recursive: true });

  await processBucket("black-to-alpha", "black-to-alpha");
  await processBucket("white-to-alpha", "white-to-alpha");
  await processBucket("alpha-ready", "alpha-ready");
  await processBucket("frames", "frames");
  await processBucket("overlay", "overlay");

  console.log("");
  console.log("Done.");
  console.log(`Output: ${outputRoot}`);
  console.log("Skipped: unsure/");
}

main();
