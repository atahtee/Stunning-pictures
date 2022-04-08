const imageContainer = document.getElementById('image-container')
const loader = document.getElementById('loader')

// Fetch to Unsplash service to get Photos Array
async function fetchPhotosArray(count) {
  // Api key not hidden because it's free!
  const ACCESS_KEY = 'xRF2L0bh5b3lJxL8LNav1jEpXWBaSxmB5fGhs9IMe2I'
  const collectionLandscape = '827743'
  const apiUrl = `https://api.unsplash.com/photos/random/?client_id=${ACCESS_KEY}&count=${count}&collections=${collectionLandscape}`
  const response = await fetch(apiUrl)
  return await response.json()
}

// Helper function to set Attributes on DOM Elements
function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key])
  }
}

let imagesLoaded = 0
let totalImages = 0

function onImageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    onFinishedImagesLoad()
  }
}

// Create Elements for Links & Photos, Add to DOM
function displayPhotos(photosArray) {
  imagesLoaded = 0
  totalImages = photosArray.length
  // Run function for each photo in photosArray
  for (const photo of photosArray) {
    // Create <a> to link to Unsplash
    const link = document.createElement('a')
    setAttributes(link, {
      href: photo.links.html,
      target: '_blank'
    })
    // Create <img> for photo
    const img = document.createElement('img')
    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description
    })
    // Event listener, check when each image is finished loading
    img.addEventListener('load', onImageLoaded)
    // Put <img> inside <a>, then put both inside imageContainer Element
    link.appendChild(img)
    imageContainer.appendChild(link)
  }
}

let allImagesAreLoaded = false

// initial count is for faster initial page loading
const initialCount = 15
const normalCount = 30
let photosToFetchCount = initialCount
let isInitialLoad = true

function onFinishedImagesLoad() {
  allImagesAreLoaded = true
  loader.classList.add('hidden')

  if (isInitialLoad) {
    photosToFetchCount = normalCount
    isInitialLoad = false
  }
}

async function getPhotos() {
  try {
    loader.classList.remove('hidden')
    const photosArray = await fetchPhotosArray(photosToFetchCount)
    displayPhotos(photosArray)
  } catch (error) {
    console.error(error)
  }
}

// Check to see if scrolling near to the bottom of page, then load more photos
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000
    && allImagesAreLoaded) {
    allImagesAreLoaded = false
    getPhotos()
  }
})

getPhotos()