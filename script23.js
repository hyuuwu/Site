const prototypeModal = document.getElementById('prototypeModal');
const productDetail = document.getElementById('productDetail');
const header = document.getElementById('header');
const mainContent = document.getElementById('mainContent');
const newsletter = document.getElementById('newsletter');
const footer = document.getElementById('footer');
const cartBtn = document.getElementById('cartBtn');
const closeBtn = document.getElementById('closeModal');
const modalOkBtn = document.getElementById('modalOk');
const subscribeBtn = document.getElementById('subscribeBtn');
const backBtn = document.getElementById('backBtn');
const addBtn = document.getElementById('addBtn');
const productCards = document.querySelectorAll('.product-card');
const detailImage = document.getElementById('detailImage');
const detailPrice = document.getElementById('detailPrice');

function showPrototypeModal() {
    prototypeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hidePrototypeModal() {
    prototypeModal.classList.remove('active');
    document.body.style.overflow = '';
}

function showProductDetail(imageSrc, price) {
    detailImage.src = imageSrc;
    detailPrice.textContent = price;
    header.classList.add('hidden');
    mainContent.classList.add('hidden');
    newsletter.classList.add('hidden');
    footer.classList.add('hidden');
    productDetail.classList.add('active');
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);
}

function hideProductDetail() {
    productDetail.classList.remove('active');
    header.classList.remove('hidden');
    mainContent.classList.remove('hidden');
    newsletter.classList.remove('hidden');
    footer.classList.remove('hidden');
    document.body.style.overflow = '';
}

cartBtn.addEventListener('click', showPrototypeModal);

productCards.forEach(card => {
    card.addEventListener('click', () => {
        const img = card.querySelector('img');
        const price = card.dataset.price;
        showProductDetail(img.src, price);
    });
});

backBtn.addEventListener('click', hideProductDetail);
addBtn.addEventListener('click', showPrototypeModal);

subscribeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showPrototypeModal();
});

closeBtn.addEventListener('click', hidePrototypeModal);
modalOkBtn.addEventListener('click', hidePrototypeModal);

prototypeModal.addEventListener('click', (e) => {
    if (e.target === prototypeModal) {
        hidePrototypeModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (prototypeModal.classList.contains('active')) {
            hidePrototypeModal();
        } else if (productDetail.classList.contains('active')) {
            hideProductDetail();
        }
    }
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

const logo = document.querySelector('.logo');
logo.addEventListener('click', () => {
    if (productDetail.classList.contains('active')) {
        hideProductDetail();
    }
    logo.classList.add('spin');
    setTimeout(() => {
        logo.classList.remove('spin');
    }, 600);
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
