// Genera la carpeta dist/ con los archivos a desplegar y un version.json.
const fs = require('fs');
const archivos = ['index.html', 'validaciones.js', 'script.js', 'style.css'];

fs.rmSync('dist', { recursive: true, force: true });
fs.mkdirSync('dist');
for (const f of archivos) fs.copyFileSync(f, `dist/${f}`);

fs.writeFileSync('dist/version.json', JSON.stringify({
  version: (process.env.GITHUB_SHA || 'local').slice(0, 7),
  construido: new Date().toISOString()
}, null, 2));
console.log('Build listo en dist/');
