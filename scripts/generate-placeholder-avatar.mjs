/**
 * 더미 프로필 사진(public/profile.png)을 생성한다.
 * 실제 사진으로 교체하기 전까지만 쓰는 자리표시자다.
 *
 *   node scripts/generate-placeholder-avatar.mjs
 */
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const SIZE = 512;
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "profile.png");

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="55%" stop-color="#8b5cf6"/>
      <stop offset="100%" stop-color="#ec4899"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.3" cy="0.25" r="0.75">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#bg)"/>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#glow)"/>
  <g fill="#ffffff" fill-opacity="0.9">
    <circle cx="256" cy="205" r="78"/>
    <path d="M256 305c-83 0-151 55-160 128h320c-9-73-77-128-160-128z"/>
  </g>
</svg>
`;

await sharp(Buffer.from(svg)).png().toFile(OUT);
console.log(`생성됨: ${OUT}`);
