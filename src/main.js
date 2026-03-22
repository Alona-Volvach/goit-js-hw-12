import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
  loadMoreBtn,
  galleryContainer
} from './js/render-functions.js';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const searchForm = document.querySelector('.form');
const searchInput = searchForm.querySelector('input[name="search-text"]'); 

let searchQuery = '';
let page = 1;
let totalHits = 0;

searchForm.addEventListener('submit', async e => {
  e.preventDefault();
  searchQuery = searchInput.value.trim(); 
  if (!searchQuery) return iziToast.error({ title: 'Error', message: 'Please enter a search term' });

  page = 1;
  clearGallery();
  hideLoadMoreButton();
  await fetchImages();
});

loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  await fetchImages();
});

async function fetchImages() {
  showLoader();
  try {
    const data = await getImagesByQuery(searchQuery, page);
    hideLoader();

    if (data.hits.length === 0) {
      hideLoadMoreButton();
      return iziToast.info({ title: 'Info', message: 'No results found' });
    }

    createGallery(data.hits);
    totalHits = data.totalHits;

    if (page * 15 < totalHits) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      iziToast.info({ title: 'Info', message: "We're sorry, but you've reached the end of search results." });
    }

    if (page > 1) {
      const cardHeight = galleryContainer.firstElementChild.getBoundingClientRect().height;
      window.scrollBy({ top: cardHeight * 2, behavior: 'smooth' });
    }
  } catch (error) {
    hideLoader();
    iziToast.error({ title: 'Error', message: 'Failed to load images' });
  }
}