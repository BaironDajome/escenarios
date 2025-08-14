// src/api/config.js

// Claves públicas
export const PUBLIC_EPAYCO_KEY = "f102927facb1d03e880f81126e8b69e4";

// Dominios para producción
export const DOMINIO_BACKEND = "https://tudominio-backend.com"; // ← cambia esto por tu dominio real
export const DOMINIO_FRONTEND = "https://tudominio-frontend.com"; // ← cambia esto si es necesario

// Modo de entorno (true = producción, false = desarrollo)
const isProduccion = false;

// Base API URL
export const API = isProduccion ? DOMINIO_BACKEND : "http://localhost:3000/";

// Imágenes (si las usas)
export const URL_BASE_IMAGENES = isProduccion
  ? `${DOMINIO_BACKEND}/uploads/`
  : "http://localhost:3001/uploads/";

export const URL_BASE_DEFAULT =
  "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";


