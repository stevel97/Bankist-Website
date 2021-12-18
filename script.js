'use strict';

///////////////////////////////////////
// Element Selections

// Modal
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
// Navigation Items
const navHeader = document.querySelector('.nav');
const navLink = document.querySelector('.nav__links');
const learnMoreBtn = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('section');
// Tabbed Component
const tabSelector = document.querySelector('.operations__tab-container');
const allTabs = document.querySelectorAll('.operations__tab');
const allTabsContent = document.querySelectorAll('.operations__content');
// Slide Component
const slider = document.querySelector('.slider');
const dotsSelector = document.querySelector('.dots');
const allSlides = document.querySelectorAll('.slide');
const btnRight = document.querySelector('.slider__btn--right');
const btnLeft = document.querySelector('.slider__btn--left');

///////////////////////////////////////
// Modal Window

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// Learn More Button

learnMoreBtn.addEventListener('click', () =>
  section1.scrollIntoView({ behavior: 'smooth' })
);

///////////////////////////////////////
// Smooth Scroll

navLink.addEventListener('click', e => {
  e.preventDefault();
  const id = e.target.getAttribute('href');
  if (id && id !== '#')
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
// Tabs

tabSelector.addEventListener('click', e => {
  e.preventDefault();
  const clickedTab = e.target.closest('.operations__tab');

  if (!clickedTab) return;

  const selectedTab = clickedTab.dataset.tab;
  const contentTab = document.querySelector(
    `.operations__content--${selectedTab}`
  );

  allTabs.forEach(el => el.classList.remove('operations__tab--active'));

  allTabsContent.forEach(el =>
    el.classList.remove('operations__content--active')
  );

  clickedTab.classList.add('operations__tab--active');
  contentTab.classList.add('operations__content--active');
});

///////////////////////////////////////
// Navigation Animation

const handleHover = function (e) {
  const link = e.target;
  const siblings = e.target.closest('.nav').querySelectorAll('.nav__link');
  const img = e.target.closest('.nav').querySelector('img');

  if (e.target.classList.contains('nav__link')) {
    img.style.opacity = this;

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
  }
};

navHeader.addEventListener('mouseover', handleHover.bind(0.5));

navHeader.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////
// Sticky Navigation

const navHeight = navHeader.getBoundingClientRect().height;

const obsCallback = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) navHeader.classList.add('sticky');
  else navHeader.classList.remove('sticky');
};

const observer = new IntersectionObserver(obsCallback, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

observer.observe(header);

///////////////////////////////////////
// Reveal Sections

const revealHandler = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealHandler, {
  root: null,
  threshold: 0.2,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

///////////////////////////////////////
// Lazy Loading Images

const lazyLoadHandler = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', () =>
    entry.target.classList.remove('lazy-img')
  );
  observer.unobserve(entry.target);
};

const lazyLoadImages = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver(lazyLoadHandler, {
  root: null,
  threshold: 0,
  rootMargin: '100px',
});

lazyLoadImages.forEach(image => imageObserver.observe(image));

///////////////////////////////////////
// Slider

let currentSlide = 0;
let sliderVisible = false;

const buildDots = function () {
  dotsSelector.innerHTML = '';
  allSlides.forEach((_, i) =>
    dotsSelector.insertAdjacentHTML(
      'beforeend',
      `<button class = "dots__dot" data-slide="${i}"></button>`
    )
  );
};

const showSlide = function (slideNumber) {
  allSlides.forEach(
    (slide, i) =>
      (slide.style = `transform: translateX(${(i - slideNumber) * 100}%)`)
  );
  allDots.forEach(dot => dot.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-slide="${slideNumber}"`)
    .classList.add('dots__dot--active');
};

const nextSlide = function () {
  currentSlide++;
  if (currentSlide > allSlides.length - 1) currentSlide = 0;
  showSlide(currentSlide);
};

const prevSlide = function () {
  currentSlide--;
  if (currentSlide < 0) currentSlide = allSlides.length - 1;
  showSlide(currentSlide);
};

const sliderHandler = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) sliderVisible = false;
  else sliderVisible = true;
};

const sliderObserver = new IntersectionObserver(sliderHandler, {
  root: null,
  threshold: 0,
});

btnRight.addEventListener('click', nextSlide);

btnLeft.addEventListener('click', prevSlide);

dotsSelector.addEventListener('click', e => {
  const clickedDot = e.target.closest('.dots__dot');
  if (!clickedDot) return;
  currentSlide = Number(clickedDot.dataset.slide);
  showSlide(currentSlide);
});

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' && sliderVisible) nextSlide();
  if (e.key === 'ArrowLeft' && sliderVisible) prevSlide();
});

buildDots();
const allDots = document.querySelectorAll('.dots__dot');

showSlide(0);

sliderObserver.observe(slider);
