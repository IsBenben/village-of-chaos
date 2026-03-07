const languages = {
	en_us,
	zh_cn,
	zh_hant,
	fr_fr,
	es_es,
};

let currentLanguage = "en_us";

const tr = (key) => `<t-i18n k="${key}"></t-i18n>`;

const tI18nElements = [];

class TI18nElement extends HTMLElement {
	static observedAttributes = ["k"];

	constructor() {
		super();
		this.connected = false;
		tI18nElements.push(this);
	}

	getTranslate = (key) => {
		let result = languages[currentLanguage][key];
		if (result != undefined) {
			return result;
		}
		result = languages["en_us"][key];
		if (result != undefined) {
			console.warn(
				`Key "${key}" not found in language "${currentLanguage}", fallback to "en_us".`,
			);
			return result;
		}
		console.error(`Key "${key}" not found in any language.`);
		return key;
	};

	connectedCallback() {
		const key = this.getAttribute("k");
		this.textContent = this.getTranslate(key);
		this.connected = true;
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === "k") {
			this.textContent = this.getTranslate(newValue);
		}
	}
}

customElements.define("t-i18n", TI18nElement);

const changeLanguage = (language) => {
	currentLanguage = language;
	localStorage.setItem("language", language);
	document.documentElement.lang = languages[language]["meta.language"];
	tI18nElements.forEach((element) => {
		if (element.connected) {
			const key = element.getAttribute("k");
			element.textContent = element.getTranslate(key);
		}
	});
	if (typeof onLanguageChanged === "function") {
		onLanguageChanged(currentLanguage);
	}
};

if (Object.keys(languages).includes(localStorage.getItem("language"))) {
	changeLanguage(localStorage.getItem("language"));
} else {
	for (const language of navigator.languages) {
		const languageLowercase = language.toLowerCase();
		if (languageLowercase.startsWith("en")) {
			changeLanguage("en_us");
			break;
		} else if (languageLowercase.startsWith("zh")) {
			if (
				languageLowercase.includes("tw") ||
				languageLowercase.includes("hk") ||
				languageLowercase.includes("mo") ||
				languageLowercase.includes("hant")
			) {
				changeLanguage("zh_hant");
			} else {
				changeLanguage("zh_cn");
			}
			break;
		} else if (languageLowercase.startsWith("fr")) {
			changeLanguage("fr_fr");
			break;
		} else if (languageLowercase.startsWith("es")) {
			changeLanguage("es_es");
			break;
		}
	}
}

const languageShroud = document.getElementById("language-shroud");
const languagePopup = document.getElementById("language-popup");
const languageOptions = document.getElementById("language-options");
const languageDismiss = document.getElementById("language-dismiss");
let languageOptionsPopulated = false;

const populateLanguageOptions = () => {
	if (languageOptionsPopulated) {
		return;
	}
	languageOptionsPopulated = true;
	languageOptions.innerHTML = "";
	for (const [langCode, langData] of Object.entries(languages)) {
		const button = document.createElement("button");
		button.lang = langData["meta.language"];
		button.className = "language-option";
		button.textContent = langData["meta.name"];
		button.dataset.lang = langCode;
		if (langCode === currentLanguage) {
			button.classList.add("active");
		}
		button.addEventListener("click", () => {
			changeLanguage(langCode);
		});
		languageOptions.appendChild(button);
	}
};

const languageButton = document.getElementById("language");
languageButton.addEventListener("click", () => {
	populateLanguageOptions();
	languageShroud.style.display = "block";
});

languageDismiss.addEventListener("click", () => {
	languageShroud.style.display = "none";
});

languageShroud.addEventListener("click", (e) => {
	if (e.target === languageShroud) {
		languageShroud.style.display = "none";
	}
});
