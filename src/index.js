import './sass/main.scss';
import { getImages } from './js/fetchapi';
import { LoadMoreBtn }  from './js/loadmore';
import { makeImageMarkup } from './js/makeImageMarkup'
import  Notiflix  from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let getEl = selector => document.querySelector(selector);

const refs = {
    formSearch: getEl('#search-form'),
    containerDiv: getEl('.gallery'),
}

const loadMoreBtn = new LoadMoreBtn({ selector: '.load-more', hidden: true });
let lightbox = new SimpleLightbox ('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  captionPosition: 'bottom',
});

function clearImageContainer() {
    refs.containerDiv.innerHTML = ''
};

function loadImages() {
    let page = 1;
    let name = '';

    return async function (event) {
        event.preventDefault();
        if (event.currentTarget.elements && name !== event?.currentTarget?.elements?.searchQuery?.value.trim()) {
            page = 1
            name = event.currentTarget.elements.searchQuery.value.trim();
            clearImageContainer();
        }
        if (name === '') {
         return Notiflix.Notify.info('Enter a word to search for images.')
        }
    
         try {
             const data = await getImages(page, name);
             if (data.total === 0) {
                Notiflix.Notify.info(`Sorry, there are no images matching your search query: ${name}. Please try again.`);
                loadMoreBtn.hide();
                return;
             }
             appendImagesMarkup(data);
             lightbox.refresh();
             onPageScroll()
             loadMoreBtn.show();
            const { totalHits } = data;

        if (refs.containerDiv.children.length === totalHits ) {
            Notiflix.Notify.info(`We're sorry, but you've reached the end of search results.`);
            loadMoreBtn.hide();
        } else {
            loadMoreBtn.enable();
            Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
        } 
             page++;   
        } catch (e) {
            console.log(e.messege);
        }
    }
}

function appendImagesMarkup(data) {
    refs.containerDiv.insertAdjacentHTML('beforeend', makeImageMarkup(data));
}

function onPageScroll(){ 
    const { height: cardHeight } = refs.containerDiv
        .firstElementChild.getBoundingClientRect();
        window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
        });
}

const fetchImages = loadImages();
refs.formSearch.addEventListener('submit', fetchImages);
loadMoreBtn.refs.button.addEventListener('click', fetchImages);