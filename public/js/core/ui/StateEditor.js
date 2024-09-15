//claude最高
export class StateEditor {
  constructor(gameManager) {
    this.gameManager = gameManager;

    this.stateListContainer = document.getElementById(
      "editRuleButtonsContainer"
    );
    this.colorOptionsContainer = document.getElementById("colorOptions");
    this.stateNameInput = document.getElementById("stateNameInput");
    this.saveNameColorButton = document.getElementById("saveNameColor");
    this.addStateButton = document.getElementById("state-addon");

    this.initializeUI();
  }

  initializeUI() {
    this.createColorOptions();
    this.attachEventListeners();
    this.updateStateList();
  }

  createColorOptions() {
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
      this.colorOptionsContainer.appendChild(colorOption);
    });
  }

  attachEventListeners() {
    this.stateListContainer.addEventListener("click", (event) =>
      this.handleStateListClick(event)
    );
    if (this.gameManager.config.editstate) {
      this.addStateButton.addEventListener("click", () => this.addState());
    }
    this.saveNameColorButton.addEventListener("click", () =>
      this.saveNameAndColor()
    );
  }

  handleStateListClick(event) {
    if (event.target.classList.contains("editRules")) {
      const stateId = event.target.dataset.state;
      this.gameManager.selectedStateId = stateId;
      this.updateStateList();
      this.openRuleEditor(stateId);
    }
  }

  addState() {
    this.gameManager.stateManager.addState();
    this.updateStateList();
  }

  saveNameAndColor() {
    if (this.gameManager.config.editstate) {
      const stateId = this.saveNameColorButton.dataset.stateId;
      const state = this.gameManager.stateManager.getState(stateId);

      const newName = this.stateNameInput.value;
      const selectedColorRadio = document.querySelector(
        'input[name="stateColor"]:checked'
      );
      const newColor = selectedColorRadio
        ? selectedColorRadio.value
        : state.color;

      if (newName && newColor) {
        state.name = newName;
        state.color = newColor;
        this.updateStateList();

        this.closeNameColorEditor();
      }
    } else {
      alert("編集は現在無効です。");
    }
  }

  updateStateList() {
    this.stateListContainer.innerHTML = "";
    const states = this.gameManager.stateManager.getAllState();

    states.forEach((state) => {
      const stateRow = this.createStateRow(state);
      this.stateListContainer.appendChild(stateRow);
    });
  }

  createStateRow(state) {
    const stateRow = document.createElement("div");
    stateRow.className = `d-flex justify-content-between align-items-center mb-3 p-3 border rounded shadow-sm`;
    stateRow.dataset.stateId = state.id;

    const stateInfo = this.createStateInfo(state);
    const buttonContainer = this.createButtonContainer(state);

    stateRow.appendChild(stateInfo);
    stateRow.appendChild(buttonContainer);

    return stateRow;
  }

  createStateInfo(state) {
    const stateInfo = document.createElement("div");
    stateInfo.className = `d-flex align-items-center p-2 ${state.canSelect?"border":""} ${
      this.gameManager.selectedStateId === state.id
        ? "border-primary border-4"
        : "border-secondary"
    } rounded`;
    stateInfo.innerHTML = `
					<span class="state-color me-2" style="display:inline-block;width:25px;height:25px;background-color:${state.color};border-radius:50%;"></span>
					<strong>${state.name}</strong>
			`;

    if(state.canSelect){

      stateInfo.addEventListener("click", () => {
        this.gameManager.selectedStateId = state.id;
        this.updateStateList();
      });
    }

    return stateInfo;
  }

  createButtonContainer(state) {
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "d-flex";

    const editNameColorButton = this.createButton(
      "名前＆色編集",
      "btn-outline-secondary",
      () => this.openNameColorEditor(state.id)
    );
    const editRulesButton = this.createButton(
      "ルール編集",
      "btn-outline-primary",
      () => this.openRuleEditor(state.id)
    );
    const deleteRuleButton = this.createButton("削除", "btn-danger", () =>
      this.deleteState(state.id)
    );

    buttonContainer.appendChild(editNameColorButton);
    buttonContainer.appendChild(editRulesButton);
    buttonContainer.appendChild(deleteRuleButton);

    return buttonContainer;
  }

  createButton(text, className, clickHandler) {
    const button = document.createElement("button");
    button.className = `btn ${className} me-2`;
    button.textContent = text;
    button.addEventListener("click", clickHandler);
    return button;
  }

  openNameColorEditor(stateId) {
    const state = this.gameManager.stateManager.getState(stateId);

    this.stateNameInput.value = state.name;
    const colorRadio = document.getElementById(`color-${state.color}`);
    if (colorRadio) {
      colorRadio.checked = true;
    }

    this.saveNameColorButton.dataset.stateId = stateId;

    const isEditEnabled = this.gameManager.config.editstate;
    this.stateNameInput.disabled = !isEditEnabled;
    document
      .querySelectorAll('input[name="stateColor"]')
      .forEach((input) => (input.disabled = !isEditEnabled));
    this.saveNameColorButton.disabled = !isEditEnabled;

    const modal = new bootstrap.Modal(
      document.getElementById("nameColorEditorModal")
    );
    modal.show();
  }

  closeNameColorEditor() {
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("nameColorEditorModal")
    );
    this.gameManager.draw();
    modal.hide();
  }

  openRuleEditor(stateId) {
    const ruleEditor = new RuleEditor(this.gameManager, stateId);
    ruleEditor.open();
  }

  deleteState(stateId) {
    this.gameManager.stateManager.removeState(stateId);
    this.updateStateList();
  }
}

class RuleEditor {
  constructor(gameManager, stateId) {
    this.gameManager = gameManager;
    this.maxCount = this.gameManager.board.getNeighbors(0,0).length;
    this.stateId = stateId;
    this.state = this.gameManager.stateManager.getState(stateId);
  }

  open() {
    const modalTemplate = document.getElementById("ruleEditorModal");
    this.modalClone = modalTemplate.cloneNode(true);
    this.modalClone.id = `ruleEditorModal_${this.stateId}`;
    this.modalClone.querySelector(
      ".modal-title"
    ).textContent = `${this.state.name} のルール編集`;
    document.body.appendChild(this.modalClone);

    this.modal = new bootstrap.Modal(this.modalClone);
    this.initializeUI();
    this.attachEventListeners();
    this.modal.show();
  }

  initializeUI() {
    this.rulesContainer = this.modalClone.querySelector(
      ".transitionRulesContainer"
    );
    this.addRuleBtn = this.modalClone.querySelector(".addTransitionRule");
    this.saveBtn = this.modalClone.querySelector(".saveRules");
    this.defaultTransitionContainer = this.modalClone.querySelector(
      "#defaultTransitionContainer"
    );

    this.initializeDefaultTransition();
    this.initializeTransitionRules();
  }

  initializeDefaultTransition() {
    this.defaultTransitionContainer.innerHTML = `
					<h4>すべてのルールを満たさないときの遷移先</h4>
					<select class="form-select defaultTransition" ${
            this.gameManager.config.editstate ? "" : "disabled"
          }>
							${this.gameManager.stateManager
                .getAllState()
                .map(
                  (st) =>
                    `<option value="${st.id}" ${
                      this.state.defaultState == st.id ? "selected" : ""
                    }>${st.name}</option>`
                )
                .join("")}
					</select>
			`;
  }

  initializeTransitionRules() {
    this.state.transitionRules.forEach((rule) => {
      const ruleEl = this.createTransitionRuleElement(rule);
      this.rulesContainer.appendChild(ruleEl);
    });
  }

  attachEventListeners() {
    this.addRuleBtn.addEventListener("click", () => this.addNewRule());
    this.saveBtn.addEventListener("click", () => this.saveRules());
  }

  addNewRule() {
    if (this.gameManager.config.editstate) {
      this.rulesContainer.appendChild(
        this.createTransitionRuleElement({ condition: [], nextState: 0 })
      );
    }
  }

  saveRules() {
    if (this.gameManager.config.editstate) {
      const rules = Array.from(this.rulesContainer.children).map(
        this.extractRuleFromElement.bind(this)
      );
      const defaultTransition =
        this.defaultTransitionContainer.querySelector(
          ".defaultTransition"
        ).value;

      this.state.defaultState = defaultTransition;
      this.state.transitionRules = rules;

      this.closeModal();
    } else {
      alert("編集は現在無効です。");
    }
  }

  extractRuleFromElement(transitionRuleElement) {
    const conditions = Array.from(
      transitionRuleElement.querySelectorAll(".condition")
    ).map(this.extractConditionFromElement.bind(this));
    const transitionTarget = parseInt(
      transitionRuleElement.querySelector(".transition-target").value
    );
    return { condition: conditions, nextState: transitionTarget };
  }

  extractConditionFromElement(conditionElement) {
    const selects = conditionElement.querySelectorAll("select");
    return {
      state: parseInt(selects[1].value),
      min: parseInt(selects[0].value),
      max: parseInt(selects[2].value),
    };
  }

  closeModal() {
    this.modal.hide();
    this.modalClone.remove();
  }

  createTransitionRuleElement(rule) {
    const el = document.createElement("div");
    el.className = "transition-rule border border-dark p-4 mt-2";
    el.innerHTML = this.getTransitionRuleHTML(rule);

    const conditionsContainer = el.querySelector(".conditions");
    const addConditionButton = el.querySelector(".add-condition");

    addConditionButton.addEventListener("click", () => {
      if (this.gameManager.config.editstate) {
        conditionsContainer.appendChild(
          this.createConditionElement({ state: "", min: 0, max: 0 })
        );
      }
    });

    el.querySelector(".delete-transition-rule").addEventListener(
      "click",
      () => {
        if (this.gameManager.config.editstate) {
          el.remove();
        }
      }
    );

    rule.condition.forEach((condition) => {
      conditionsContainer.appendChild(this.createConditionElement(condition));
    });

    return el;
  }

  getTransitionRuleHTML(rule) {
    return `
					<div class="d-flex justify-content-between align-items-center my-2">
							<h3>ルール</h3>
							<button class="btn btn-danger btn-sm delete-transition-rule" ${
                this.gameManager.config.editstate ? "" : "disabled"
              }>このルールを削除</button>
					</div>
					<div class="conditions"></div>
					<button class="btn btn-secondary btn-sm mt-2 add-condition" ${
            this.gameManager.config.editstate ? "" : "disabled"
          }>条件を追加</button>
					<div class="mt-3 d-flex align-items-center">
							<label>すべての条件を満たすとき</label>
							<div>
									<select class="form-select transition-target" ${
                    this.gameManager.config.editstate ? "" : "disabled"
                  }>
											${this.gameManager.stateManager
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
  }

  createConditionElement(condition) {
    const el = document.createElement("div");
    el.className = "condition border p-2 mb-3";
    el.innerHTML = this.getConditionHTML(condition);

    el.querySelector(".delete-condition").addEventListener("click", () => {
      if (this.gameManager.config.editstate) {
        el.remove();
      }
    });

    return el;
  }

  getConditionHTML(condition) {
    const allStates = this.gameManager.stateManager.getAllState();
    const stateOptions = allStates
      .map(
        (st) =>
          `<option value="${st.id}" ${
            condition.state === st.id ? "selected" : ""
          }>${st.name}</option>`
      )
      .join("");

    return `
					<div class="d-flex justify-content-between align-items-center">
							<div class="w-75">
									<div class="d-flex align-items-center">
											<div>
													<select class="form-select" ${
                            this.gameManager.config.editstate ? "" : "disabled"
                          }>
															${[...Array(this.maxCount+1).keys()]
                                .map(
                                  (num) =>
                                    `<option value="${num}" ${
                                      condition.min === num ? "selected" : ""
                                    }>${num}</option>`
                                )
                                .join("")}
															${allStates
                                .map(
                                  (st) =>
                                    `<option value="${-st.id}" ${
                                      condition.min == -st.id ? "selected" : ""
                                    }>${st.name}の個数</option>`
                                )
                                .join("")}
													</select>
											</div>
											<span class="p-2"><=</span>
											<div>
											<select class="form-select" ${
                        this.gameManager.config.editstate ? "" : "disabled"
                      }>
                                ${stateOptions}
                            </select>
                        </div>
                        <span class="p-2"><=</span>
                        <div>
                            <select class="form-select" ${
                              this.gameManager.config.editstate
                                ? ""
                                : "disabled"
                            }>
                                ${[...Array(this.maxCount+1).keys()]
                                  .map(
                                    (num) =>
                                      `<option value="${num}" ${
                                        condition.max === num ? "selected" : ""
                                      }>${num}</option>`
                                  )
                                  .join("")}
                                ${allStates
                                  .map(
                                    (st) =>
                                      `<option value="${-st.id}" ${
                                        condition.max == -st.id
                                          ? "selected"
                                          : ""
                                      }>${st.name}の個数</option>`
                                  )
                                  .join("")}
                            </select>
                        </div>
                    </div>
                </div>
                <button class="btn btn-danger btn-sm delete-condition" ${
                  this.gameManager.config.editstate ? "" : "disabled"
                }>削除</button>
            </div>
        `;
  }
}
