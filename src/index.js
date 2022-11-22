import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
let lightbox = new SimpleLightbox('.gallery a', { captionsData: "alt", captionDelay: 250 });

const formRef = document.querySelector('.search-form');
const galleryRef = document.querySelector('.gallery');
const moreBtn = document.querySelector('.load-more')

const URL = 'https://pixabay.com/api/?key=31504710-bca348681cce76d75d9bac8c5';
let keyGet = ``;
let page = 1;
const perPage = 40;

formRef.addEventListener('input', onInput);
formRef.addEventListener('submit', onSubmit);
moreBtn.addEventListener('click', onLoadMore);

function onInput(evt) {
  keyGet = `q=${evt.target.value.trim()}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}`;
}

function onLoadMore() {
  page += 1;
  moreBtn.classList.add('visually-hidden');
  fetchCard().then(data => {
    renderGallery(data);
    lightbox.refresh;

    if (data.hits.length === 40) {
      moreBtn.classList.remove('visually-hidden');
    } else {Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");}
  });
}

function onSubmit(e) {
  e.preventDefault();
  page = 1;
  galleryRef.innerHTML = '';
  moreBtn.classList.add('visually-hidden');

  const getNull = "q=&image_type=photo&orientation=horizontal&safesearch=true&per_page=40";
  if (getNull === keyGet || '' === keyGet) {
    emptyValue();
    return ;
  }

  fetchCard().then(data => {
    if (data.length === 0) {
      moreBtn.classList.add('visually-hidden');
      nullArray();
      return 
    }
    
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    renderGallery(data);
    lightbox.refresh;
    if (data.hits.length === 40) {
      moreBtn.classList.remove('visually-hidden');
    } else {Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");}
  });
}

async function fetchCard() {
  try {
    const dataResponse = await axios.get(`${URL}&${keyGet}&page=${page}`);
    return dataResponse.data;
  } catch (error) {
    console.log('ERROR: ', console.log(error));
  }
}

function renderGallery(data) {
  let markup = data.hits
    .map(itm => {
      return `<div class="photo-card">
        <a class="gallery-item" href="${itm.largeImageURL}">
          <img
            class="gallery-image"
            src="${itm.webformatURL}"
            alt="${itm.tags}"
            loading="lazy"
        /></a>
        <div class="info">
          <div class="info-box">
            <p class="info-item">
              <b>Likes</b>
            </p>
            <p class="info-counter">${itm.likes.toLocaleString()}</p>
          </div>
          <div class="info-box">
            <p class="info-item">
              <b>Views</b>
            </p>
            <p class="info-counter">${itm.views.toLocaleString()}</p>
          </div>
          <div class="info-box">
            <p class="info-item">
              <b>Comments</b>
            </p>
            <p class="info-counter">${itm.comments.toLocaleString()}</p>
          </div>
          <div class="info-box">
            <p class="info-item">
              <b>Downloads</b>
            </p>
            <p class="info-counter">${itm.downloads.toLocaleString()}</p>
          </div>
        </div>
      </div>`;
    })
    .join('');
  galleryRef.insertAdjacentHTML('beforeend', markup);
}

const nullArray = () => {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
  cardRef.innerHTML = '';
};

const emptyValue = () => {
  Notiflix.Notify.warning('Go on! Enter your word!');
  cardRef.innerHTML = '';
};
