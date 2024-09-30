import { LSStageProgress } from "../../common/LocalStorage.js";

export function checkStageAccess() {

  const progress = LSStageProgress.get();
  const url = window.location.pathname;

  const path = url.split("/").filter((segment) => segment);

  if (path.length < 3) {
    throw new Error("誰やねんお前");
  }

  if (
    path[0] != "stage" ||
    path[1] < "a" ||
    "d" < path[1] ||
    path[2] < "1" ||
    "5" < path[2]
  ) {
    throw new Error("誰やねんお前");
  }

  const stageNum = parseInt(path[2], 10);

  if (path.length === 3 && progress[path[1]] + 1 < stageNum) {
    document.getElementById("page").innerHTML = `
        <div class="container mt-5 text-center">
          <h1>このステージはまだ未開放です。</h1>
          <a href="/stage/" class="btn btn-primary mt-3">ステージ選択に戻る</a>
        </div>
      `;
    throw new Error("このステージは未開放です");
  }
  

  const pageElement = document.getElementById("gameui");
  if (pageElement) {
    pageElement.hidden = false;
  }

  return;
}
