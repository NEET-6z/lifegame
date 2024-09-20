// claude最高
export const createStateEditor = (gameManager) => {
  const stateListContainer = document.getElementById("editRuleButtonsContainer");
  const colorOptionsContainer = document.getElementById("colorOptions");
  const stateNameInput = document.getElementById("stateNameInput");
  const saveNameColorButton = document.getElementById("saveNameColor");
  const addStateButton = document.getElementById("state-addon");

  const createColorOptions = () => {
    const predefinedColors = [
      "white", "black", "red", "lime", "blue", "yellow", "purple", "orange",
      "cyan", "magenta", "brown", "deepskyblue", "gold", "darkgreen",
      "darkorange", "darkviolet", "gray", "darkred", "darkblue", "darkslategray"
    ];

    predefinedColors.forEach((color) => {
      const colorOption = document.createElement("div");
      colorOption.className = "form-check form-check-inline";
      colorOption.innerHTML = `
        <input class="form-check-input" type="radio" name="stateColor" id="color-${color}" value="${color}">
        <label class="form-check-label" for="color-${color}" style="background-color: ${color}; width: 30px; height: 30px; display: inline-block; border: 1px solid #ccc; cursor: pointer;"></label>
      `;
      colorOptionsContainer.appendChild(colorOption);
    });
  };

  const attachEventListeners = () => {
    stateListContainer.addEventListener("click", handleStateListClick);
    if (gameManager.config.editstate) {
      addStateButton.addEventListener("click", addState);
    }
    saveNameColorButton.addEventListener("click", saveNameAndColor);
  };

  const handleStateListClick = (event) => {
    if (event.target.classList.contains("editRules")) {
      const stateId = event.target.dataset.state;
      gameManager.selectedStateId = stateId;
      updateStateList();
      openRuleEditor(stateId);
    }
  };

  const addState = () => {
    gameManager.stateManager.addState();
    updateStateList();
  };

  const saveNameAndColor = () => {
    if (gameManager.config.editstate) {
      const stateId = saveNameColorButton.dataset.stateId;
      const state = gameManager.stateManager.getState(stateId);

      const newName = stateNameInput.value;
      const selectedColorRadio = document.querySelector('input[name="stateColor"]:checked');
      const newColor = selectedColorRadio ? selectedColorRadio.value : state.color;

      if (newName && newColor) {
        state.name = newName;
        state.color = newColor;
        updateStateList();
        closeNameColorEditor();
      }
    } else {
      alert("編集は現在無効です。");
    }
  };

  const updateStateList = () => {
    stateListContainer.innerHTML = "";
    const states = gameManager.stateManager.getAllState();

    states.forEach((state) => {
      const stateRow = createStateRow(state);
      stateListContainer.appendChild(stateRow);
    });
  };

  const createStateRow = (state) => {
    const stateRow = document.createElement("div");
    stateRow.className = `d-flex justify-content-between align-items-center mb-3 p-3 border rounded shadow-sm`;
    stateRow.dataset.stateId = state.id;

    const stateInfo = createStateInfo(state);
    const buttonContainer = createButtonContainer(state);

    stateRow.appendChild(stateInfo);
    stateRow.appendChild(buttonContainer);

    return stateRow;
  };

  const createStateInfo = (state) => {
    const stateInfo = document.createElement("div");
    stateInfo.className = `d-flex align-items-center p-2 ${state.canSelect ? "border" : ""} ${
      gameManager.selectedStateId === state.id ? "border-primary border-4" : "border-secondary"
    } rounded`;
    stateInfo.innerHTML = `
      <span class="state-color me-2" style="display:inline-block;width:25px;height:25px;background-color:${state.color};border-radius:50%;"></span>
      <strong>${state.name}</strong>
    `;

    if (state.canSelect) {
      stateInfo.addEventListener("click", () => {
        gameManager.selectedStateId = state.id;
        updateStateList();
      });
    }

    return stateInfo;
  };

  const createButtonContainer = (state) => {
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "d-flex";

    const editNameColorButton = createButton("名前＆色編集", "btn-outline-secondary", () => openNameColorEditor(state.id));
    const editRulesButton = createButton("ルール編集", "btn-outline-primary", () => openRuleEditor(state.id));
    const deleteRuleButton = createButton("削除", "btn-danger", () => deleteState(state.id));

    buttonContainer.appendChild(editNameColorButton);
    buttonContainer.appendChild(editRulesButton);
    if (gameManager.config.editstate) buttonContainer.appendChild(deleteRuleButton);

    return buttonContainer;
  };

  const createButton = (text, className, clickHandler) => {
    const button = document.createElement("button");
    button.className = `btn ${className} me-2`;
    button.textContent = text;
    button.addEventListener("click", clickHandler);
    return button;
  };

  const openNameColorEditor = (stateId) => {
    const state = gameManager.stateManager.getState(stateId);

    stateNameInput.value = state.name;
    const colorRadio = document.getElementById(`color-${state.color}`);
    if (colorRadio) {
      colorRadio.checked = true;
    }

    saveNameColorButton.dataset.stateId = stateId;

    const isEditEnabled = gameManager.config.editstate;
    stateNameInput.disabled = !isEditEnabled;
    document.querySelectorAll('input[name="stateColor"]').forEach((input) => (input.disabled = !isEditEnabled));
    saveNameColorButton.disabled = !isEditEnabled;

    const modal = new bootstrap.Modal(document.getElementById("nameColorEditorModal"));
    modal.show();
  };

  const closeNameColorEditor = () => {
    const modal = bootstrap.Modal.getInstance(document.getElementById("nameColorEditorModal"));
    gameManager.draw();
    modal.hide();
  };

  const openRuleEditor = (stateId) => {
    const ruleEditor = createRuleEditor(gameManager, stateId);
    ruleEditor.open();
  };

  const deleteState = (stateId) => {
    gameManager.stateManager.removeState(stateId);
    updateStateList();
  };

  const initializeUI = () => {
    createColorOptions();
    attachEventListeners();
    updateStateList();
  };

  initializeUI();

  return {
    updateStateList
  };
};

// Rule Editor functions
const createRuleEditor = (gameManager, stateId) => {
  const state = gameManager.stateManager.getState(stateId);
  const maxCount = gameManager.board.getNeighbors(0, 0).length;
  let modalClone, modal, rulesContainer, addRuleBtn, saveBtn, defaultTransitionContainer;

  const open = () => {
    const modalTemplate = document.getElementById("ruleEditorModal");
    modalClone = modalTemplate.cloneNode(true);
    modalClone.id = `ruleEditorModal_${stateId}`;
    modalClone.querySelector(".modal-title").textContent = `${state.name} のルール編集`;
    document.body.appendChild(modalClone);

    modal = new bootstrap.Modal(modalClone);
    initializeUI();
    attachEventListeners();
    modal.show();
  };

  const initializeUI = () => {
    rulesContainer = modalClone.querySelector(".transitionRulesContainer");
    addRuleBtn = modalClone.querySelector(".addTransitionRule");
    saveBtn = modalClone.querySelector(".saveRules");
    defaultTransitionContainer = modalClone.querySelector("#defaultTransitionContainer");

    initializeDefaultTransition();
    initializeTransitionRules();
  };

  const initializeDefaultTransition = () => {
    defaultTransitionContainer.innerHTML = `
      <h4>すべてのルールを満たさないときの遷移先</h4>
      <select class="form-select defaultTransition" ${gameManager.config.editstate ? "" : "disabled"}>
        ${gameManager.stateManager.getAllState().map((st) =>
          `<option value="${st.id}" ${state.defaultState == st.id ? "selected" : ""}>${st.name}</option>`
        ).join("")}
      </select>
    `;
  };

  const initializeTransitionRules = () => {
    state.transitionRules.forEach((rule) => {
      const ruleEl = createTransitionRuleElement(rule);
      rulesContainer.appendChild(ruleEl);
    });
  };

  const attachEventListeners = () => {
    addRuleBtn.addEventListener("click", addNewRule);
    saveBtn.addEventListener("click", saveRules);
  };

  const addNewRule = () => {
    if (gameManager.config.editstate) {
      rulesContainer.appendChild(createTransitionRuleElement({ condition: [], nextState: 0 }));
    }
  };

  const saveRules = () => {
    if (gameManager.config.editstate) {
      const rules = Array.from(rulesContainer.children).map(extractRuleFromElement);
      const defaultTransition = defaultTransitionContainer.querySelector(".defaultTransition").value;

      state.defaultState = defaultTransition;
      state.transitionRules = rules;

      closeModal();
    } else {
      alert("編集は現在無効です。");
    }
  };

  const extractRuleFromElement = (transitionRuleElement) => {
    const conditions = Array.from(transitionRuleElement.querySelectorAll(".condition")).map(extractConditionFromElement);
    const transitionTarget = parseInt(transitionRuleElement.querySelector(".transition-target").value);
    return { condition: conditions, nextState: transitionTarget };
  };

  const extractConditionFromElement = (conditionElement) => {
    const selects = conditionElement.querySelectorAll("select");
    return {
      state: parseInt(selects[1].value),
      min: parseInt(selects[0].value),
      max: parseInt(selects[2].value),
    };
  };

  const closeModal = () => {
    modal.hide();
    modalClone.remove();
  };

  const createTransitionRuleElement = (rule) => {
    const el = document.createElement("div");
    el.className = "transition-rule border border-dark p-4 mt-2";
    el.innerHTML = getTransitionRuleHTML(rule);

    const conditionsContainer = el.querySelector(".conditions");
    const addConditionButton = el.querySelector(".add-condition");

    addConditionButton.addEventListener("click", () => {
      if (gameManager.config.editstate) {
        conditionsContainer.appendChild(createConditionElement({ state: "", min: 0, max: 0 }));
      }
    });

    el.querySelector(".delete-transition-rule").addEventListener("click", () => {
      if (gameManager.config.editstate) {
        el.remove();
      }
    });

    rule.condition.forEach((condition) => {
      conditionsContainer.appendChild(createConditionElement(condition));
    });

    return el;
  };

  const getTransitionRuleHTML = (rule) => {
    return `
      <div class="d-flex justify-content-between align-items-center my-2">
        <h3>ルール</h3>
        <button class="btn btn-danger btn-sm delete-transition-rule" ${gameManager.config.editstate ? "" : "disabled"}>このルールを削除</button>
      </div>
      <div class="conditions"></div>
      <button class="btn btn-secondary btn-sm mt-2 add-condition" ${gameManager.config.editstate ? "" : "disabled"}>条件を追加</button>
      <div class="mt-3 d-flex align-items-center">
        <label>すべての条件を満たすとき</label>
        <div>
          <select class="form-select transition-target" ${gameManager.config.editstate ? "" : "disabled"}>
            ${gameManager.stateManager.getAllState().map((st) =>
              `<option value="${st.id}" ${rule.nextState == st.id ? "selected" : ""}>${st.name}</option>`
            ).join("")}
          </select>
        </div>
        <div>に遷移</div>
      </div>
    `;
  };

  const createConditionElement = (condition) => {
    const el = document.createElement("div");
    el.className = "condition border p-2 mb-3";
    el.innerHTML = getConditionHTML(condition);

    el.querySelector(".delete-condition").addEventListener("click", () => {
      if (gameManager.config.editstate) {
        el.remove();
      }
    });

    return el;
  };

  const getConditionHTML = (condition) => {
    const allStates = gameManager.stateManager.getAllState();
    const stateOptions = allStates.map((st) =>
      `<option value="${st.id}" ${condition.state === st.id ? "selected" : ""}>${st.name}</option>`
    ).join("");

    return `
      <div class="d-flex justify-content-between align-items-center">
        <div class="w-75">
          <div class="d-flex align-items-center">
            <div>
              <select class="form-select" ${gameManager.config.editstate ? "" : "disabled"}>
                ${[...Array(maxCount + 1).keys()].map((num) =>
                  `<option value="${num}" ${condition.min === num ? "selected" : ""}>${num}</option>`
                ).join("")}
                ${allStates.map((st) =>
                  `<option value="${-st.id}" ${condition.min == -st.id ? "selected" : ""}>${st.name}の個数</option>`
                ).join("")}
              </select>
            </div>
            <span class="p-2"><=</span>
            <div>
              <select class="form-select" ${gameManager.config.editstate ? "" : "disabled"}>
                ${stateOptions}
              </select>
            </div>
            <span class="p-2"><=</span>
            <div>
              <select class="form-select" ${gameManager.config.editstate ? "" : "disabled"}>
                ${[...Array(maxCount + 1).keys()].map((num) =>
                  `<option value="${num}" ${condition.max === num ? "selected" : ""}>${num}</option>`
                ).join("")}
                ${allStates.map((st) =>
                  `<option value="${-st.id}" ${condition.max == -st.id ? "selected" : ""}>${st.name}の個数</option>`
                ).join("")}
              </select>
            </div>
          </div>
        </div>
        <button class="btn btn-danger btn-sm delete-condition" ${gameManager.config.editstate ? "" : "disabled"}>削除</button>
      </div>
    `;
  };

  return {
    open
  };
};
