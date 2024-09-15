export class InputHandler {
  constructor(gameManager) {
    this.gameManager = gameManager;
    this.canvas = this.gameManager.canvas;
    this.config = gameManager.config;
    this.initCanvasEvent();
    this.initControlEvent();

    document.addEventListener("keydown", (e) => {
      this.keyPressEvent(e);
    });
    window.addEventListener('resize', (e) => {
      this.gameManager.draw();
    })
  }

  keyPressEvent(e) {
    switch (e.key) {
      case " ": {
        e.preventDefault();
        if (this.gameManager.isPlaying) {
          this.gameManager.stop();
        } else {
          this.gameManager.start();
        }
        break;
      }
      case "z": {
        this.gameManager.undo();
        break;
      }

      case "x": {
        const stateCount = this.gameManager.stateManager.getAllState().length;
        let next = (this.gameManager.selectedStateId + 1) % stateCount;
        if (next == 0) next = stateCount;
        this.gameManager.selectedStateId = next;
        this.gameManager.stateEditor.updateStateList();
        break;
      }

      case "c": {
        this.gameManager.clear();
        break;
      }
    }
  }

  //ドラッグなど
  initCanvasEvent() {
    let isDraggingLeft = false;
    let isDraggingRight = false;
    let lastCell = { x: -1, y: -1 };

    this.canvas.addEventListener("mousedown", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const { x, y } = this.gameManager.board.getCellPosition(
        rect,
        e.clientX,
        e.clientY
      );
      switch (e.button) {
        case 0:
          this.gameManager.setCell(x, y, this.gameManager.selectedStateId);
          isDraggingLeft = true;
          break;
        case 2:
          this.gameManager.setCell(x, y, 1);
          isDraggingRight = true;
          break;
      }
      lastCell = { x, y };
    });

    this.canvas.addEventListener("mouseup", (e) => {
      if (e.button === 0) isDraggingLeft = false;
      if (e.button === 2) isDraggingRight = false;
    });

    this.canvas.addEventListener("mousemove", (e) => {
      if (this.gameManager.isPlaying) return;
      const rect = this.canvas.getBoundingClientRect();

      const { x, y } = this.gameManager.board.getCellPosition(
        rect,
        e.clientX,
        e.clientY
      );
      if (!this.gameManager.board.isValidCoordinate(x, y)) return;

      if (lastCell.x !== x || lastCell.y !== y) {
        if (isDraggingLeft)
          this.gameManager.setCell(x, y, this.gameManager.selectedStateId);
        if (isDraggingRight) this.gameManager.setCell(x, y, 1);
        lastCell = { x, y };
      }
    });

    this.canvas.addEventListener("mouseleave", () => {
      isDraggingLeft = false;
      isDraggingRight = false;
    });

    this.canvas.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  initControlEvent() {
    document.getElementById("speed").value = parseInt(this.gameManager.speed);
    document.getElementById("size").value = parseInt(
      this.gameManager.board.size
    );

    document
      .getElementById("start")
      .addEventListener("click", () => this.gameManager.start());

    document
      .getElementById("undo")
      .addEventListener("click", () => this.gameManager.undo());

    document
      .getElementById("stop")
      .addEventListener("click", () => this.gameManager.stop());
    document
      .getElementById("clear")
      .addEventListener("click", () => this.gameManager.clear());

    document
      .getElementById("random")
      .addEventListener("click", () => this.gameManager.random());

    document.getElementById("speed").addEventListener("input", (e) => {
      let val = Math.min(1000, Math.max(e.target.value, 20));
      this.gameManager.setSpeed(parseInt(val));
    });
    document.getElementById("speed").addEventListener("blur", (e) => {
      let val = Math.min(1000, Math.max(e.target.value, 20));
      e.target.value = val;
    });

    if (this.config.resize) {
      document.getElementById("size").addEventListener("input", (e) => {
        let val = Math.min(100, Math.max(e.target.value, 1));
        this.gameManager.resizeBoard(parseInt(val));
      });

      document.getElementById("size").addEventListener("blur", (e) => {
        let val = Math.min(100, Math.max(e.target.value, 1));
        e.target.value = val;
      });
    } else {
      const el = document.getElementById("size");
      if (el) {
        el.disabled = true;
      }
    }

    if (this.config.reshape) {
      document.getElementById("shape").addEventListener("change", (e) => {
        this.gameManager.reshapeBoard(e.target.value);
      });
    } else {
      const el = document.getElementById("shape");
      if (el) {
        el.disabled = true;
      }
    }
  }
}
