export function InputHandler(gameManager) {
  const canvas = gameManager.canvas;
  const config = gameManager.config;

  function initCanvasEvent() {
    let isDraggingLeft = false;
    let isDraggingRight = false;
    let lastCell = { x: -1, y: -1 };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("contextmenu", (e) => e.preventDefault());

    function handleMouseDown(e) {
      const rect = canvas.getBoundingClientRect();
      const { x, y } = gameManager.board.getCellPosition(rect, e.clientX, e.clientY);
      switch (e.button) {
        case 0:
          gameManager.setCell(x, y, gameManager.selectedStateId);
          isDraggingLeft = true;
          break;
        case 2:
          gameManager.setCell(x, y, 1);
          isDraggingRight = true;
          break;
      }
      lastCell = { x, y };
    }

    function handleMouseUp(e) {
      if (e.button === 0) isDraggingLeft = false;
      if (e.button === 2) isDraggingRight = false;
    }

    function handleMouseMove(e) {
      if (gameManager.isPlaying) return;
      const rect = canvas.getBoundingClientRect();
      const { x, y } = gameManager.board.getCellPosition(rect, e.clientX, e.clientY);
      if (!gameManager.board.isValidCoordinate(x, y)) return;

      if (lastCell.x !== x || lastCell.y !== y) {
        if (isDraggingLeft) gameManager.setCell(x, y, gameManager.selectedStateId);
        if (isDraggingRight) gameManager.setCell(x, y, 1);
        lastCell = { x, y };
      }
    }

    function handleMouseLeave() {
      isDraggingLeft = false;
      isDraggingRight = false;
    }
  }

  function initControlEvent() {
    document.getElementById("speed").value = parseInt(gameManager.speed);
    document.getElementById("size").value = parseInt(gameManager.board.size);

    document.getElementById("start").addEventListener("click", () => gameManager.start());
    document.getElementById("undo").addEventListener("click", () => gameManager.undo());
    document.getElementById("stop").addEventListener("click", () => gameManager.stop());
    document.getElementById("clear").addEventListener("click", () => gameManager.clear());
    document.getElementById("random").addEventListener("click", () => gameManager.random());

    document.getElementById("speed").addEventListener("input", handleSpeedInput);
    document.getElementById("speed").addEventListener("blur", handleSpeedBlur);

    if (config.resize) {
      document.getElementById("size").addEventListener("input", handleSizeInput);
      document.getElementById("size").addEventListener("blur", handleSizeBlur);
    } else {
      const sizeEl = document.getElementById("size");
      if (sizeEl) sizeEl.disabled = true;
    }

    if (config.reshape) {
      document.getElementById("shape").addEventListener("change", handleShapeChange);
    } else {
      const shapeEl = document.getElementById("shape");
      if (shapeEl) shapeEl.disabled = true;
    }

    function handleSpeedInput(e) {
      let val = Math.min(1000, Math.max(e.target.value, 20));
      gameManager.setSpeed(parseInt(val));
    }

    function handleSpeedBlur(e) {
      let val = Math.min(1000, Math.max(e.target.value, 20));
      e.target.value = val;
    }

    function handleSizeInput(e) {
      let val = Math.min(100, Math.max(e.target.value, 1));
      gameManager.resizeBoard(parseInt(val));
    }

    function handleSizeBlur(e) {
      let val = Math.min(100, Math.max(e.target.value, 1));
      e.target.value = val;
    }

    function handleShapeChange(e) {
      gameManager.reshapeBoard(e.target.value);
    }
  }

  function handleKeyPress(e) {
    switch (e.key) {
      case " ":
        e.preventDefault();
        gameManager.isPlaying ? gameManager.stop() : gameManager.start();
        break;
      case "z":
        gameManager.undo();
        break;
      case "x":
        const stateCount = gameManager.stateManager.getAllState().length;
        let next = (gameManager.selectedStateId + 1) % stateCount;
        if (next == 0) next = stateCount;
        gameManager.selectedStateId = next;
        gameManager.stateEditor.updateStateList();
        break;
      case "c":
        gameManager.clear();
        break;
    }
  }

  // Initialize events
  initCanvasEvent();
  initControlEvent();
  document.addEventListener("keydown", handleKeyPress);
  window.addEventListener('resize', () => gameManager.draw());
}

// Usage
// setupInputHandlers(gameManager);