//complete 0:評価中 1:条件を満たした -1:条件に反した -2:初期条件に反した

import { LSStageProgress } from "../../common/LocalStorage.js";


export class GameEvaluator{

	constructor(){
		this.completeFlag = false;
		this.gameManager = null; 
		this.board = null;
		this.gameInfo = {};
	}
	
	
	initialize(gameManager){
		this.gameManager = gameManager;
		this.board = this.gameManager.board;
		
		this.setgameInfo();
		const infoArea = document.getElementById("infoarea");
		infoArea.innerHTML = "";
		
		for (const [id, value] of Object.entries(this.gameInfo)) {
			const div = document.createElement("div");
			div.className = "px-4";
			div.id = `${id}_label`;
			div.innerHTML = `${id}: <span id="${id}">${value}</span>`;
			infoArea.appendChild(div);
		}
	}
	

	updateInfo(infolist) {
    for (const [id, value] of Object.entries(infolist)) {
      document.getElementById(id).innerHTML = value;
    }
  }
	start(){
		this.setgameInfo();
		this.gameInfo["turn"]++;
	}
	
	stop(){
		this.setgameInfo();
		this.updateInfo(this.gameInfo);
	}
	
	setgameInfo(){
		this.gameInfo["turn"] = 0;
	}
	
	evaluateTurn(){
		this.updateInfo(this.gameInfo);
		this.gameInfo["turn"]++;

		if(this.gameInfo['complete']==1) {
			this.stageComplete();
		}

		return this.gameInfo['complete'];
	}

	cmis0(){
		return (this.gameInfo["complete"]===0);
	}


	//条件を満たしたときの処理
	stageComplete() {
    this.gameManager.saveToLocalStorage();
    if (!this.completeFlag) {
      this.completeFlag = true;
      this.showCompletionScreen();
    }

    const progress = LSStageProgress.get();
    const url = window.location.pathname;

    const path = url.split("/").filter((segment) => segment);
    progress[path[1]] = Math.max(parseInt(progress[path[1]], 10), path[2]);

    LSStageProgress.set(progress);
  }

	
  showCompletionScreen(message = "Stage Completed!") {
    this.updateStageComplete();
		
    document.getElementById("stageClearMessage").textContent = message;
		
    var stageClearModal = new bootstrap.Modal(
			document.getElementById("stageClearModal")
    );
    stageClearModal.show();
  }


	//クリア状況を画面に更新
	updateStageComplete() {
		document.getElementById("clearStatus").innerHTML = "クリア済み";
		document.getElementById("lastClearData").hidden = false;
		document.getElementById("lastClearData").addEventListener("click", (e) => {
			this.gameManager.loadFromLocalStorage();
			this.gameManager.draw();
		});
		
		document.getElementById("nextStage").classList.remove("disabled");
		this.gameManager.draw();
	}
} 