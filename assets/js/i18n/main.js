const styles = document.createElement('style');
document.head.appendChild(styles);

function onLanguageChanged(language) {
  if (typeof game === 'object') {
    game.renderUpgrades();
  }
  styles.textContent = `
  #log-expand:after {
    content: '${tr('button.expand-log')}' !important;
  }

  #log.visible > #log-expand:after {
    content: '${tr('button.collapse-log')}' !important;
  }
  `;
}
