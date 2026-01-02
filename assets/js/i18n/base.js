const languages = {
  en_us,
  zh_cn,
};

let currentLanguage = 'en_us';

const tr = (key) => {
  return languages[currentLanguage][key] ?? languages['en_us'][key] ?? key;
}

const trElements = [];

class Tr extends HTMLElement {
  static observedAttributes = ["k"];

  constructor() {
    super();
    this.connected = false;
    trElements.push(this);
  }

  connectedCallback() {
    const key = this.getAttribute('k');
    this.textContent = tr(key);
    this.connected = true;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'k') {
      this.textContent = tr(newValue);
    }
  }
}

customElements.define('tr-i18n', Tr);

const changeLanguage = (language) => {
  currentLanguage = language;
  document.documentElement.lang = languages[language]['meta.language'];
  trElements.forEach((element) => {
    if (element.connected) {
      const key = element.getAttribute('k');
      element.textContent = tr(key);
    }
  });
  if (typeof onLanguageChanged === 'function') {
    onLanguageChanged(currentLanguage);
  }
}

for (const language in languages) {
  if (navigator.language.startsWith('en')) {
    changeLanguage('en_us');
    break;
  } else if (navigator.language.startsWith('zh')) {
    changeLanguage('zh_cn');
    break;
  }
}
