// generate_hashes.js
const bcrypt = require('bcryptjs');

async function generate() {
  const passwords = ['admin123', 'user123', 'readonly123'];

  for (const pw of passwords) {
    const hash = await bcrypt.hash(pw, 10);
    console.log(`Password: ${pw} --> Hash: ${hash}`);
  }
}

generate();
