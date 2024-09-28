import { LSTemplate } from "../../common/LocalStorage.js";
import { templates } from "../../data/templates.js";

export const TemplateRuleModal = (gameManager) => {
  let selectedTemplate = null;
  let currentTab = "default";
  let userTemplates = [];
  let nextTemplateId = 0;

  const initializeUserTemplates = () => {
    userTemplates = LSTemplate.get();
    if (userTemplates) {
      nextTemplateId =
        userTemplates.length > 0
          ? Math.max(...userTemplates.map((t) => t.id)) + 1
          : 0;
    } else {
      userTemplates = [];
    }
  };

  const saveUserTemplate = (template) => {
    userTemplates.push(template);
    LSTemplate.set(userTemplates);
  };

  const updateUserTemplate = (template) => {
    const index = userTemplates.findIndex((t) => t.id === template.id);
    if (index !== -1) {
      userTemplates[index] = template;
      LSTemplate.set(userTemplates);
    }
  };

  const updateTemplateList = () => {
    if (currentTab == "default") {
      const templateList = document.getElementById("default-template-list");
      const templateItems = templates;
      templateList.innerHTML = "";
      templateItems.forEach((template) => {
        const listItem = document.createElement("li");
        listItem.classList.add("list-group-item", "template-item");

        const contentWrapper = document.createElement("div");
        contentWrapper.classList.add("d-flex", "justify-content-between");

        const title = document.createElement("div");
        title.textContent = template.title;

        const bsrule = document.createElement("div");
        bsrule.classList.add("bsrule", "text-info");
        bsrule.textContent = template.bsRule;

        contentWrapper.appendChild(title);
        contentWrapper.appendChild(bsrule);

        listItem.appendChild(contentWrapper);
        listItem.setAttribute("data-template", template.id);

        listItem.addEventListener("click", () => {
          selectTemplate(listItem, template);
        });

        templateList.appendChild(listItem);
      });
    } else {
      const templateList = document.getElementById("user-template-list");
      templateList.innerHTML = "";
      userTemplates.forEach((template) => {
        const listItem = document.createElement("li");
        listItem.classList.add(
          "list-group-item",
          "template-item",
          "d-flex",
          "justify-content-between",
          "align-items-center"
        );

        listItem.setAttribute("data-template", template.id);
        listItem.addEventListener("click", () => {
          selectTemplate(listItem, template);
        });

        const titleElement = document.createElement("span");
        titleElement.textContent = template.title;

        const buttonGroup = document.createElement("div");

        const editButton = document.createElement("button");
        editButton.classList.add(
          "btn",
          "btn-success",
          "btn-sm",
          "edit-template"
        );
        editButton.dataset.template = template.id;
        editButton.textContent = "編集";

        const deleteButton = document.createElement("button");
        deleteButton.classList.add(
          "btn",
          "btn-danger",
          "btn-sm",
          "delete-template"
        );
        deleteButton.dataset.template = template.id;
        deleteButton.textContent = "削除";

        buttonGroup.appendChild(editButton);
        buttonGroup.appendChild(deleteButton);

        listItem.appendChild(titleElement);
        listItem.appendChild(buttonGroup);

        templateList.appendChild(listItem);
      });
    }
  };

  const selectTemplate = (listItem, template) => {
    selectedTemplate = template;
    document.querySelectorAll(".template-item").forEach((item) => {
      item.classList.remove("active");
    });
    listItem.classList.add("active");
    document.getElementById("template-detail").innerText = template.description;
  };

  const onOkButtonClick = () => {
    if (selectedTemplate) {
      console.log(selectedTemplate);
      document.getElementById("template-display").innerText =
        selectedTemplate.title;
      gameManager.stateManager.setTemplate(
        JSON.parse(JSON.stringify(selectedTemplate.rule))
      );

      gameManager.stateEditor.updateStateList();
    }
  };

  const initializeOkButton = () => {
    const okButton = document.getElementById("ok-button");
    okButton.addEventListener("click", onOkButtonClick);
  };

  const initializeTabButtons = () => {
    const defaultTab = document.getElementById("default-tab");
    const userTab = document.getElementById("user-tab");

    defaultTab.addEventListener("click", () => {
      currentTab = "default";
      defaultTab.classList.add("active");
      userTab.classList.remove("active");
      updateTemplateList();
    });

    userTab.addEventListener("click", () => {
      currentTab = "user";
      userTab.classList.add("active");
      defaultTab.classList.remove("active");
      updateTemplateList();
    });
  };

  const initializeAddTemplateButton = () => {
    const addButton = document.getElementById("add-template-button");
    const modal = new bootstrap.Modal(
      document.getElementById("addTemplateModal")
    );

    addButton.addEventListener("click", () => {
      modal.show();
    });

    const saveButton = document.getElementById("saveAddTemplateButton");

    const titleInput = document.getElementById("addTemplateTitle");
    const descriptionInput = document.getElementById("addTemplateDescription");
    saveButton.addEventListener("click", () => {
      if (titleInput.value && descriptionInput.value) {
        const newTemplate = {
          id: nextTemplateId++,
          title: titleInput.value,
          description: descriptionInput.value,
          rule: gameManager.stateManager.getAllState(),
        };

        saveUserTemplate(newTemplate);
        updateTemplateList();
        modal.hide();
      }
    });
  };

  const initializeEditButtons = () => {
    const templateList = document.getElementById("user-template-list");

    templateList.addEventListener("click", (event) => {
      if (event.target.classList.contains("edit-template")) {
        const template = userTemplates.find(
          (t) => t.id === Number(event.target.dataset.template)
        );
        showEditModal(template);
      } else if (event.target.classList.contains("delete-template")) {
        const template = userTemplates.find(
          (t) => t.id === Number(event.target.dataset.template)
        );
        deleteUserTemplate(template);
        updateTemplateList();
      }
    });
  };

  const showEditModal = (template) => {
    const modal = new bootstrap.Modal(
      document.getElementById("editTemplateModal")
    );
    modal.show();

    const titleInput = document.getElementById("editTemplateTitle");
    const descriptionInput = document.getElementById("editTemplateDescription");

    titleInput.value = template.title;
    descriptionInput.value = template.description;

    const saveButton = document.getElementById("saveEditTemplateButton");
    saveButton.addEventListener(
      "click",
      () => {
        console.log(titleInput.value, descriptionInput.value);
        if (titleInput.value && descriptionInput.value) {
          template.title = titleInput.value;
          template.description = descriptionInput.value;
          updateUserTemplate(template);
          updateTemplateList();
          modal.hide();
        }
      },
      { once: true }
    );
  };

  const deleteUserTemplate = (template) => {
    userTemplates = userTemplates.filter((t) => t.id !== template.id);
    LSTemplate.set(userTemplates);
  };

  const init = () => {
    initializeUserTemplates();
    initializeTabButtons();
    updateTemplateList();
    initializeOkButton();
    initializeAddTemplateButton();
    initializeEditButtons();
  };

  init();
};
