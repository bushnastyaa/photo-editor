const fileInput = document.querySelector(".file-input"),
ranges = document.querySelectorAll('.range'),
previewImg = document.querySelector(".preview-img img"),
chooseImgBtn = document.querySelector(".choose-img");

const filters = {
	'brightness': 1,
	'invert': 0,
	'contrast': 0,
	'saturate': 1,
	'grayscale': 0
};

const rotate = {
    "rotate": 0, 
    "flipHorizontal": 1, 
    "flipVertical": 1
};

function rangeInit() {
	if (ranges.length === 0) {
		return false;
	}

	ranges.forEach(wrap => {
		rangeHandler(wrap);
	})
}

function rangeHandler(wrap) {
    const filterSlider = wrap.querySelector(".filter-slider");
    const active = "preset--active";

    if (!filterSlider) {
        return false;
    }

    filterSlider.addEventListener("input", () => {
        const value = filterSlider.value;
		const name = filterSlider.name;

        setFilter(name, value / 100);
        updateFilterValue(value / 100, wrap);
        updateFill(value, wrap);
        applyFilters(name);
        removeClass (presets, active);
    })
};

function updateFill(value, wrap) {
	const sliderFill = wrap.querySelector('.range__fill');
    sliderFill.style.width = `${value}%`; 
};

function updateFilterValue(value, wrap) {
    const filterValue = wrap.querySelector(".filter-info .value");
    filterValue.innerHTML = `${value}`;
};

function applyFilters(style) {
    previewImg.style.transform = `rotate(${rotate.rotate}deg) scale(${rotate.flipHorizontal}, ${rotate.flipVertical})`;
    document.documentElement.style.setProperty(`--${style}`, `${filters[style]}`);
};

function setFilter(style, value) {
    if (style === "invert" || style === "grayscale") {
        value = value;
    } else {
       value = value * 10;
    }

    filters[style] = `${value}`;
    applyFilters(style)
};

function uploadButton() {
    let file = fileInput.files[0];
    if(!file) return; 
    previewImg.src = URL.createObjectURL(file);

	updateImages(previewImg.src);		
};

function updateImages (src) {
    const images = document.querySelectorAll('.preset__image');

	if (!src) {
		return false;
    }

	images.forEach(image => image.src = src);
};

rangeInit();

fileInput.addEventListener("change", uploadButton);
chooseImgBtn.addEventListener("click", () => fileInput.click());

