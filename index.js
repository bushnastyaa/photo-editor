const fileInput = document.querySelector(".file-input"),
ranges = document.querySelectorAll('.range'),
rotateOptions = document.querySelectorAll(".rotate-btn"),
resetFilterBtn = document.querySelector(".reset-filter"),
previewImg = document.querySelector(".preview-img img"),
presets = document.querySelectorAll('.preset'),
chooseImgBtn = document.querySelector(".choose-img"),
saveImgBtn = document.querySelector(".save-img");

const setupPresets = {
	1: {
		'brightness': 9,
	    'invert': 0,
	    'contrast': 12,
	    'saturate': 22,
	    'grayscale': 20
	},
	2: {
		'brightness': 11,
	    'invert': 17,
	    'contrast': 17,
	    'saturate': 2,
	    'grayscale': 25
	},
	3: {
		'brightness': 12,
	    'invert': 5,
	    'contrast': 12,
	    'saturate': 19,
	    'grayscale': 0
	},
	4: {
		'brightness': 12,
	    'invert': 9,
	    'contrast': 16,
	    'saturate': 0,
	    'grayscale': 25
	},
};

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

function rotateImage() {
    rotateOptions.forEach(option => {
        option.addEventListener("click", () => {
            if (option.id === "left") {
                rotate.rotate -= 90;
            } else if (option.id === "right") {
                rotate.rotate += 90;
            } else if (option.id === "horizontal") {
                rotate.flipHorizontal = rotate.flipHorizontal === 1 ? -1 : 1;
            } else {
                rotate.flipVertical = rotate.flipVertical === 1 ? -1 : 1;
            }
    
            applyFilters();
        });
    });
};

function updateValueOfInput(value, wrap) {
    const filterSlider = wrap.querySelector(".filter-slider");
    filterSlider.value = value;
};

function resetFilter() {
    const active = 'preset--active';

    ranges.forEach(range => {
        const input = range.querySelector(".filter-slider");
        const value = input.getAttribute("value");

        updateFilterValue(value / 100, range);
        updateValueOfInput(value, range);
        removeClass(presets, active);
	    updateFill(value, range);
	    document.documentElement.removeAttribute ('style');
    })

    rotate.rotate = 0, rotate.flipHorizontal = 1, rotate.flipVertical = 1;
    applyFilters();
};

function initPresets() {
    const active = "preset--active";

    presets.forEach(preset => {
        preset.addEventListener("click", () => {
            if (!preset.classList.contains(active)) {
                removeClass(presets, active);
                setPreset(preset);
                preset.classList.toggle(active);
            } else {
                removeClass(presets, active);
                resetFilter();
            }
        })
    });
};

function setPreset(preset) {
    const index = preset.dataset.preset;
    const setup = setupPresets[index];

    if (setup) {
        for (let style in setup) {
            const value = +setup[`${style}`] / 100;
            setFilter(style, value);
            applyFilters(style);

            ranges.forEach(item => {
                if (item.dataset.range === style) {
                    updateFilterValue(value, item);
                    updateFill(value * 100, item);
                    updateValueOfInput(value * 100,item);
                }
            })
        }
    };
};

function removeClass(items, active) {
	items.forEach(item => item.classList.remove(active));
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

function downloadImage() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;

    setFiltersToCanvas(ctx, canvas)
    downloadCanvas(canvas)
};

function setFiltersToCanvas(ctx, canvas) {
    let canvasFilters = "";
	for (let i in filters) {
		canvasFilters += `${i}(${filters[i]})`;
	}

	ctx.filter = canvasFilters; 

    ctx.translate(canvas.width / 2, canvas.height / 2);
    if (rotate.rotate !== 0) {
        ctx.rotate(rotate.rotate * Math.PI / 180);
    }
    ctx.scale(rotate.flipHorizontal, rotate.flipVertical);

    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
};

function downloadCanvas(canvas) {
    const link = document.createElement("a");
    link.download = "image.jpg";
    link.href = canvas.toDataURL();
    link.click();
    link.delete;
};

rangeInit();

fileInput.addEventListener("change", uploadButton);
chooseImgBtn.addEventListener("click", () => fileInput.click());

rotateImage();

initPresets();

resetFilterBtn.addEventListener("click", resetFilter);
saveImgBtn.addEventListener("click", downloadImage);
