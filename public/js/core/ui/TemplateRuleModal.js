// TemplateRuleModal.js
import { templates } from '../../data/rule.js'; // ルールを定義したファイルをインポート
// ルールテンプレートの選択
export const TemplateRuleModal = (gameManager) => {
  let selectedTemplate = "";

  const initializeTemplateList = () => {
    const templateList = document.getElementById('template-list');
    templateList.innerHTML = ""; 

    templates.forEach(template => {
      const listItem = document.createElement('li');
      listItem.classList.add('list-group-item', 'template-item');
      listItem.setAttribute('data-template', template.rule);
      listItem.textContent = template.title; 
      listItem.addEventListener('click', () => {
        selectTemplate(listItem, template);
      });
      templateList.appendChild(listItem);
    });
  };

  const selectTemplate = (listItem, template) => {
    selectedTemplate = template;

    document.querySelectorAll('.template-item').forEach(item => {
      item.classList.remove('active');
    });
    listItem.classList.add('active');

    document.getElementById('template-detail').innerText = template.description; 
  };

  const onOkButtonClick = () => {
    if (selectedTemplate) {
      document.getElementById('template-display').innerText = selectedTemplate.title;
      gameManager.stateManager.setTemplate(selectedTemplate.rule);

      gameManager.stateEditor.updateStateList();
    }
  };

  const initializeOkButton = () => {
    const okButton = document.getElementById('ok-button');
    okButton.addEventListener('click', onOkButtonClick);
  };

  const init = () => {
    initializeTemplateList();
    initializeOkButton();
  };

  init();
};