// 状態の編集

export const createStateEditor = (gameManager) => {
  
  const stateListContainer = document.getElementById(
    "editRuleButtonsContainer"
  );
  const colorOptionsContainer = document.getElementById("colorOptions");
  const stateNameInput = document.getElementById("stateNameInput");
  const saveNameColorButton = document.getElementById("saveNameColor");
  const addStateButton = document.getElementById("state-addon");

  
  const createColorOptions = () => {
    const predefinedColors = [
      "white",
      "black",
      "red",
      "lime",
      "blue",
      "yellow",
      "purple",
      "orange",
      "cyan",
      "magenta",
      "brown",
      "deepskyblue",
      "gold",
      "darkgreen",
      "darkorange",
      "darkviolet",
      "gray",
      "darkred",
      "darkblue",
      "darkslategray",
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
      const selectedColorRadio = document.querySelector(
        'input[name="stateColor"]:checked'
      );
      const newColor = selectedColorRadio
        ? selectedColorRadio.value
        : state.color;

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
    stateInfo.className = `d-flex align-items-center p-2 ${
      state.canSelect ? "border" : ""
    } ${
      gameManager.selectedStateId === state.id
        ? "border-primary border-4"
        : "border-secondary"
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

    const editNameColorButton = createButton(
      "名前＆色編集",
      "btn-outline-secondary",
      () => openNameColorEditor(state.id)
    );
    const editRulesButton = createButton(
      "ルール編集",
      "btn-outline-primary",
      () => openRuleEditor(state.id)
    );
    const deleteRuleButton = createButton("削除", "btn-danger", () =>
      deleteState(state.id)
    );

    buttonContainer.appendChild(editNameColorButton);
    buttonContainer.appendChild(editRulesButton);
    if (gameManager.config.editstate)
      buttonContainer.appendChild(deleteRuleButton);

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
    document
      .querySelectorAll('input[name="stateColor"]')
      .forEach((input) => (input.disabled = !isEditEnabled));
    saveNameColorButton.disabled = !isEditEnabled;

    const modal = new bootstrap.Modal(
      document.getElementById("nameColorEditorModal")
    );
    modal.show();
  };

  const closeNameColorEditor = () => {
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("nameColorEditorModal")
    );
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
    updateStateList,
  };
};

const createRuleEditor = (gameManager, stateId) => {
  const state = gameManager.stateManager.getState(stateId);
  let modalClone,
    modal,
    rulesContainer,
    addRuleBtn,
    saveBtn,
    defaultTransitionContainer,
    customParameterContainer;

  const open = () => {
    const modalTemplate = document.getElementById("ruleEditorModal");
    modalClone = modalTemplate.cloneNode(true);
    modalClone.id = `ruleEditorModal_${stateId}`;
    modalClone.querySelector(
      ".modal-title"
    ).textContent = `${state.name} のルール編集`;
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
    defaultTransitionContainer = modalClone.querySelector(
      "#defaultTransitionContainer"
    );

    customParameterContainer = modalClone.querySelector(
      "#customParameterContainer"
    );

    initializeDefaultTransition();
    initializeTransitionRules();
    initializeCustomParameter();
  };

  const initializeDefaultTransition = () => {
    defaultTransitionContainer.innerHTML = `
      <h4>すべてのルールを満たさないときの遷移先</h4>
      <select class="form-select defaultTransition" ${
        gameManager.config.editstate ? "" : "disabled"
      }>
        ${gameManager.stateManager
          .getAllState()
          .map(
            (st) =>
              `<option value="${st.id}" ${
                state.defaultState == st.id ? "selected" : ""
              }>${st.name}</option>`
          )
          .join("")}
      </select>
    `;
  };

  const initializeTransitionRules = () => {
    state.transitionRules.forEach((rule) => {
      const ruleEl = createTransitionRuleElement(rule);
      rulesContainer.appendChild(ruleEl);
    });
  };

  const initializeCustomParameter = () => {
    const paramSlot = gameManager.stateManager.getParamSlot();

    paramSlot.forEach((param) => {
      customParameterContainer.appendChild(createParamElement(param));
    });
  };

  const attachEventListeners = () => {
    addRuleBtn.addEventListener("click", addNewRule);
    saveBtn.addEventListener("click", saveRules);
  };

  const addNewRule = () => {
    if (gameManager.config.editstate) {
      rulesContainer.appendChild(
        createTransitionRuleElement({ condition: [], nextState: 0, operator: 'and'})
      );
    }
  };

  const saveRules = () => {
    if (gameManager.config.editstate) {
      const rules = Array.from(rulesContainer.children).map(
        extractRuleFromElement
      );
      const defaultTransition =
        defaultTransitionContainer.querySelector(".defaultTransition").value;

      state.defaultState = Number(defaultTransition);
      state.transitionRules = rules;

      Array.from(customParameterContainer.children).map(
        extractParamFromElement
      );

      closeModal();
    } else {
      alert("編集は現在無効です。");
    }
  };

  const extractParamFromElement = (paramElement) => {
    const id = paramElement.querySelector(".param-label").innerHTML;
    const value = paramElement.querySelector(".param-value").value;
    state.params[id - 1] = Number(value);
  };

  const extractRuleFromElement = (transitionRuleElement) => {
    const conditions = Array.from(
      transitionRuleElement.querySelectorAll(".condition")
    ).map(extractConditionFromElement);
    const transitionTarget = parseInt(
      transitionRuleElement.querySelector(".transition-target").value
    );

    const operator = transitionRuleElement.querySelector('.operator-select').value;

    return { condition: conditions, nextState: transitionTarget, operator: operator };
  };

  const extractConditionFromElement = (conditionElement) => {
    const typeSelects = conditionElement.querySelectorAll(
      ".condition-type-select"
    );
    const stateSelects = conditionElement.querySelectorAll(
      ".condition-state-select"
    );
    const valueInputs = conditionElement.querySelectorAll(
      ".condition-value-input"
    );
    const paramInputs = conditionElement.querySelectorAll(
      ".condition-param-select"
    );

    const getValue = (index) => {
      const type = typeSelects[index].value;
      if (type === "number") {
        return { type: type, value: parseInt(valueInputs[index].value) };
      }
      if (type === "state") {
        return { type: type, value: parseInt(stateSelects[index].value) };
      }
      if (type === "param") {
        return { type: type, value: parseInt(paramInputs[index].value) };
      }
    };

    return {
      min: getValue(0),
      target: getValue(1),
      max: getValue(2),
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


    const operatorSelect = el.querySelector(".operator-select");
    operatorSelect.value = rule.operator || "and"; // 初期値を設定

    operatorSelect.addEventListener("change", () => {
      rule.operator = operatorSelect.value;
    });

    addConditionButton.addEventListener("click", () => {
      if (gameManager.config.editstate) {
        conditionsContainer.appendChild(
          createConditionElement({
            target: { type: "number", value: 0 },
            min: { type: "number", value: 0 },
            max: { type: "number", value: 0 },
          })
        );
      }
    });

    el.querySelector(".delete-transition-rule").addEventListener(
      "click",
      () => {
        if (gameManager.config.editstate) {
          el.remove();
        }
      }
    );

    rule.condition.forEach((condition) => {
      conditionsContainer.appendChild(createConditionElement(condition));
    });

    return el;
  };


  const createParamElement = (p) => {
    const value = state.params[p - 1] ? state.params[p - 1] : 0;

    const el = document.createElement("div");
    el.className = "";

    el.innerHTML = `
      <label class="form-label param-label mb-0" for="param-${p}" style="font-size: 0.9em;">${p}</label>
      <input type="number" class="form-control form-control-sm param-value" value="${value}" ${
      gameManager.config.editstate ? "" : "disabled"
    } style="width: 60px; padding: 2px 4px;">
    `;
    return el;
  };

  const getTransitionRuleHTML = (rule) => {
    return `
     <div class="d-flex justify-content-between align-items-center mb-3">
     <div class="d-flex">
      <h3 style="margin:0px 10px;">ルール</h3>
      <select class="operator-select form-control me-2" id="operator-select" style="width: auto; max-width: 100px;">
      <option value="and">and</option>
      <option value="or">or</option>
      </select>
     </div>
      <button class="btn btn-danger btn-sm delete-transition-rule" ${gameManager.config.editstate ? "" : "disabled"}>
        このルールを削除
      </button>
    </div>

      <div class="conditions"></div>
      <button class="btn btn-secondary btn-sm mt-2 add-condition" ${
        gameManager.config.editstate ? "" : "disabled"
      }>条件を追加</button>
      <div class="mt-3 d-flex align-items-center">
        <label>すべての条件を満たすとき</label>
        <div>
          <select class="form-select transition-target" ${
            gameManager.config.editstate ? "" : "disabled"
          }>
            ${gameManager.stateManager
              .getAllState()
              .map(
                (st) =>
                  `<option value="${st.id}" ${
                    rule.nextState == st.id ? "selected" : ""
                  }>${st.name}</option>`
              )
              .join("")}
          </select>
        </div>
        <div>に遷移</div>
      </div>
    `;
  };

  const attachConditionEventListeners = (conditionElement) => {
    const typeSelects = conditionElement.querySelectorAll(
      ".condition-type-select"
    );
    const stateSelects = conditionElement.querySelectorAll(
      ".condition-state-select"
    );
    const valueInputs = conditionElement.querySelectorAll(
      ".condition-value-input"
    );
    const paramInputs = conditionElement.querySelectorAll(
      ".condition-param-select"
    );

    typeSelects.forEach((select, index) => {
      select.addEventListener("change", (e) => {
        if (e.target.value === "number") {
          stateSelects[index].style.display = "none";
          valueInputs[index].style.display = "inline-block";
          paramInputs[index].style.display = "none";
        }
        if (e.target.value === "state") {
          stateSelects[index].style.display = "inline-block";
          valueInputs[index].style.display = "none";
          paramInputs[index].style.display = "none";
        }
        if (e.target.value === "param") {
          stateSelects[index].style.display = "none";
          valueInputs[index].style.display = "none";
          paramInputs[index].style.display = "inline-block";
        }
      });
    });
  };

  const createConditionElement = (condition) => {
    const el = document.createElement("div");
    el.className = "condition border p-2 mb-2";
    el.innerHTML = getConditionHTML(condition);

    el.querySelector(".delete-condition").addEventListener("click", () => {
      if (gameManager.config.editstate) {
        el.remove();
      }
    });

    attachConditionEventListeners(el);

    return el;
  };

  const getConditionHTML = (condition) => {
    const allStates = gameManager.stateManager.getAllState();

    const createSelectWithInput = (item) => `
      <div class="d-flex align-items-center condition-input" style="flex: 1; min-width: 150px;">
        <select class="form-select form-select-sm condition-type-select" ${
          gameManager.config.editstate ? "" : "disabled"
        }>
          <option value="number" ${
            item.type == "number" ? "selected" : ""
          }>数値</option>
          <option value="state" ${
            item.type == "state" ? "selected" : ""
          }>状態</option>
          <option value="param" ${
            item.type == "param" ? "selected" : ""
          }>パラメータ</option>
        </select>
        <select class="form-select form-select-sm condition-state-select ml-1" style="${
          item.type == "state" ? "" : "display:none;"
        }" ${gameManager.config.editstate ? "" : "disabled"}>
          ${allStates
            .map(
              (st) =>
                `<option value="${st.id}" ${
                  st.id === item.value ? "selected" : ""
                }>${st.name}</option>`
            )
            .join("")}
        </select>
        
        <input type="number" class="form-control form-control-sm condition-value-input ml-1" style="${
          item.type == "number" ? "" : "display:none;"
        }" value="${item.value}" ${
      gameManager.config.editstate ? "" : "disabled"
    }>

        <select class="form-select form-select-sm condition-param-select ml-1" style="${
          item.type == "param" ? "" : "display:none;"
        }" ${gameManager.config.editstate ? "" : "disabled"}>
          ${[1, 2, 3, 4, 5]
            .map(
              (p) =>
                `<option value="${p - 1}" ${
                  p - 1 === item.value ? "selected" : ""
                }>${p}</option>`
            )
            .join("")}
        </select>
      </div>
    `;

    return `
      <div class="d-flex flex-wrap justify-content-between align-items-center" style="max-width: 600px; width: 100%;">
        <div class="d-flex align-items-center" style="flex: 1;">
          ${createSelectWithInput(condition.min)}
          <span class="px-1"><=</span>
          ${createSelectWithInput(condition.target)}
          <span class="px-1"><=</span>
          ${createSelectWithInput(condition.max)}
        </div>
        <div style="margin: 0px 10px;">
          <button class="btn btn-danger btn-sm delete-condition ml-2" ${
            gameManager.config.editstate ? "" : "disabled"
          }>削除</button>
        </div>
      </div>
    `;
  };

  return {
    open,
  };
};
