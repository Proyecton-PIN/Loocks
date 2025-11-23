const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

// 1. Recogemos los argumentos de la consola
// node script.js [IP:PUERTO] [TOKEN]
const host = process.argv[2];
const token = process.argv[3];

if (!host || !token) {
  console.error('❌ Error: Debes proporcionar la IP y el Token.');
  console.error(
    '👉 Uso: node scripts/upload-images.js localhost:8080 MI_TOKEN_SECRETO',
  );
  process.exit(1);
}

// 2. Configuramos las rutas
// __dirname es la carpeta actual (/scripts), así que subimos un nivel (..) y entramos a assets
const imagesDir = path.join(__dirname, '../assets/images/articulos');
const endpoint = `http://${host}/api/articulos/generateDetailsAndCreate`;

console.log(`📂 Leyendo imágenes de: ${imagesDir}`);
console.log(`🚀 Destino: ${endpoint}`);

const uploadImages = async () => {
  try {
    // Verificar que la carpeta existe
    if (!fs.existsSync(imagesDir)) {
      throw new Error(`La carpeta no existe: ${imagesDir}`);
    }

    const files = fs.readdirSync(imagesDir);
    const formData = new FormData();
    let fileCount = 0;

    // 3. Añadir archivos al FormData
    files.forEach((file) => {
      // Filtramos para evitar archivos ocultos como .DS_Store o .gitkeep
      if (file.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        const filePath = path.join(imagesDir, file);

        // EN NODE.JS: Usamos fs.createReadStream, no el archivo directo
        formData.append('files', fs.createReadStream(filePath));
        console.log(`   - Añadido: ${file}`);
        fileCount++;
      }
    });

    if (fileCount === 0) {
      console.log('⚠️ No se encontraron imágenes válidas en la carpeta.');
      return;
    }

    // 4. Enviar la petición
    // NOTA IMPORTANTE: En Node con 'form-data', form.getHeaders() es OBLIGATORIO
    const response = await axios.post(endpoint, formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${token}`, // Añadimos el token
      },
      maxContentLength: Infinity, // Evitar error si las fotos pesan mucho
      maxBodyLength: Infinity,
    });

    console.log('\n✅ ÉXITO!');
    console.log('Respuesta del servidor:', response.data);
  } catch (error) {
    console.error('\n❌ ERROR AL SUBIR:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data:`, error.response.data);
    } else {
      console.error(error.message);
    }
  }
};

uploadImages();
