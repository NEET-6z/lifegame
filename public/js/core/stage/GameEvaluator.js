//complete 0:評価中 1:条件を満たした -1:条件に反した -2:初期条件に反した


export class GameEvaluator{

	constructor(){
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
		return this.gameInfo["complete"];
	}

	cmis0(){
		return (this.gameInfo["complete"]===0);
	}
}