const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeImage(inputPath, outputPath, options = {}) {
  const {
    width = 1920,
    height = 1080,
    quality = 85,
    format = 'webp',
  } = options;

  try {
    await sharp(inputPath)
      .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toFile(outputPath);
    
    // Optimisation réussie
  } catch (error) {
    // Ignorer les erreurs d'optimisation
  }
}

async function optimizeAllImages() {
  // Démarrage de l'optimisation des images

  const inputDir = path.join(process.cwd(), 'public', 'images');
  const outputDir = path.join(process.cwd(), 'public', 'images', 'optimized');

  // Créer le dossier de sortie s'il n'existe pas
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Lire tous les fichiers du dossier d'entrée
  const files = fs.readdirSync(inputDir);
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png|webp)$/i.test(file)
  );

  // Optimiser chaque image
  for (const file of imageFiles) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file);
    
    await optimizeImage(inputPath, outputPath);
  }

  // Optimisation terminée
}

// Exécuter l'optimisation
optimizeAllImages().catch(error => {
  // Ignorer les erreurs d'optimisation
});
