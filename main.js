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
        console.log(res);
        return res.json();
      })
      .then((bodyRes) => {
        console.log(bodyRes);


        mainGallery.innerHTML = '';

        if (bodyRes.results && bodyRes.results.length > 0) {

          if (noImagesMessage) {
            noImagesMessage.remove();
          }


          populateGallery(mainGallery, bodyRes.results);
        } else {

          noImagesMessage.innerHTML =
            'No se encontraron imágenes que coincidan con tu búsqueda';
          noImagesMessage.style.display = 'flex';
          noImagesMessage.style.alignItems = 'center';
          noImagesMessage.style.justifyContent = 'center';

          mainGallery.appendChild(noImagesMessage);
        }
      })
      .catch((err) => {
        const errorMessage = document.createElement('h2');
        errorMessage.textContent = 'Error: ' + err;


        mainGallery.innerHTML = '';

        errorMessage.style.display = 'flex';
        errorMessage.style.alignItems = 'center';
        errorMessage.style.justifyContent = 'center';

        mainGallery.appendChild(errorMessage);
      });
  }
};

searchInput.addEventListener('change', (e) =>
  searchPics(UNSPLASH_API, USER_KEY, e.target.value)
);


firstLoad(UNSPLASH_API, USER_KEY);
