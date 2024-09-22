//complete 0:評価中 1:条件を満たした -1:条件に反した -2:初期条件に反した
//setCustomInfoとevaluateTurnをオーバーライドして判定ルールを書き換える


export class GameEvaluator{

	constructor(){
		this.gameManager = null;
		this.board = null;
		this.customInfo = {};
	}
	
	
	initialize(gameManager){
		this.gameManager = gameManager;
		this.board = this.gameManager.board;
		
		this.setCustomInfo();
		const infoArea = document.getElementById("infoarea");
		infoArea.innerHTML = "";
		
		for (const [id, value] of Object.entries(this.customInfo)) {
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
		this.setCustomInfo();
	}
	
	stop(){
		this.setCustomInfo();
		this.updateInfo(this.customInfo);
	}
	
	setCustomInfo(){
		this.customInfo["turn"] = 0;
	}
	
	evaluateTurn(){
		this.customInfo["turn"]++;
		this.updateInfo(this.customInfo);
		return false;
	}

	cmis0(){
		return (this.customInfo["complete"]===0);
	}
}