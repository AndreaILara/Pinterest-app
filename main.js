import { footer } from './src/components/footer/footer';
import { populateGallery } from './src/components/gallery/gallery';
import { header } from './src/components/header/header';
import { links } from './src/data/linksNavbar';
import './style.css';

const UNSPLASH_API = 'https://api.unsplash.com/';
const USER_KEY = 'kD6EjuGBAHxXwr7TD9D-KFfE8vFSjdiMa_4NaC4RaOo';
const mainGallery = document.createElement('main');
const body = document.querySelector('body');
const noImagesMessage = document.createElement('h2');
body.append(header('/pinterest.png', 'Pinterest', links));
body.append(mainGallery);
body.append(footer());
const searchInput = document.querySelector('input');
const firstLoad = () => {
  fetch(UNSPLASH_API + 'photos?per_page=20&client_id=' + USER_KEY)
    .then((res) => {
      return res.json();
    })
    .then((res) => populateGallery(mainGallery, res));
};

const searchPics = (apiUrl, key, query) => {
  if (query) {
    fetch(`${apiUrl}search/photos?query=${query}&client_id=${key}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Error en la solicitud: ' + res.status);
        }
        return res.json();
      })
      .then((bodyRes) => {
        if (!bodyRes || bodyRes.errors || (bodyRes.results && bodyRes.results.length === 0)) {
          const errorMessage = document.createElement('h2');
          errorMessage.textContent = 'No se encontraron imágenes que coincidan con tu búsqueda';
          errorMessage.classList.add('centered-message', 'no-images-message');
          mainGallery.innerHTML = ''; // Limpiar contenido anterior
          mainGallery.appendChild(errorMessage);
          return;
        }
        mainGallery.innerHTML = ''; // Limpiar contenido anterior
        populateGallery(mainGallery, bodyRes.results);
      })
      .catch((err) => {
        const errorMessage = document.createElement('h2');
        errorMessage.textContent = 'Error: ' + err.message;
        errorMessage.classList.add('centered-message', 'error-message');
        mainGallery.innerHTML = ''; // Limpiar contenido anterior
        mainGallery.appendChild(errorMessage);
      });
  }
};

searchInput.addEventListener('change', (e) =>
  searchPics(UNSPLASH_API, USER_KEY, e.target.value)
);

searchInput.addEventListener('input', (e) => {
  const query = e.target.value.trim();
  if (query === '') {

    firstLoad();
  } else {

    searchPics(UNSPLASH_API, USER_KEY, query);
  }
});

firstLoad(UNSPLASH_API, USER_KEY);