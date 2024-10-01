import { State } from '../core/StateManager.js';

export const Life = bsToMultiRange("3", "23");
export const Antilife = bsToMultiRange("0123478", "01234678");
export const Oils = bsToMultiRange("014", "2");
export const Invertamaze = bsToMultiRange("028", "0124");
export const H_trees = bsToMultiRange("1", "012345678");
export const GNARL = bsToMultiRange("1", "1");
export const Replicator = bsToMultiRange("1357", "1357");
export const Fredkin = bsToMultiRange("1357", "02468");
export const Seeds = bsToMultiRange("2", "02468");
export const Live_Free_or_Die = bsToMultiRange("2", "0");
export const Serviettes = bsToMultiRange("234", "");
export const Iceballs = bsToMultiRange("25678", "5678");
export const Life_without_death = bsToMultiRange("3", "012345678");
export const DotLife = bsToMultiRange("3", "023");
export const Flock = bsToMultiRange("3", "12");
export const Mazectric = bsToMultiRange("3", "1234");
export const Maze = bsToMultiRange("3", "12345");
export const B3S2 = bsToMultiRange("3", "2");
export const Three_Four_Life = bsToMultiRange("34", "34");
export const Bacteria = bsToMultiRange("34", "456");
export const Bugs = bsToMultiRange("3567", "15678");
export const Holstein = bsToMultiRange("35678", "4678");
export const Amoeba = bsToMultiRange("357", "1358");
export const HighLife = bsToMultiRange("36", "23");
export const Castles = bsToMultiRange("3678", "135678");
export const Day_and_Night = bsToMultiRange("3678", "34678");
export const Mazectric_with_Mice = bsToMultiRange("37", "1234");
export const Maze_with_Mice = bsToMultiRange("37", "12345");
export const DryLife = bsToMultiRange("37", "23");
export const Vote = bsToMultiRange("5678", "45678");


export const templates = [
  { title: 'Life', description: '通常のライフゲーム', rule: Life, bsRule: "B3/S23" },
  { title: 'Antilife', description: '', rule: Antilife, bsRule: "B0123478/S01234678" },
  { title: 'Oils', description: '', rule: Oils, bsRule: "B014/S2" },
  { title: 'Invertamaze', description: '世代ごとに反転する迷路を作成する', rule: Invertamaze, bsRule: "B028/S0124" },
  { title: 'H Trees', description: 'Hな形になる', rule: H_trees, bsRule: "B1/S012345678" },
  { title: 'GNARL', description: '', rule: GNARL, bsRule: "B1/S1" },
  { title: 'Replicator', description: '同じ形が何度も現れる', rule: Replicator, bsRule: "B1357/S1357" },
  { title: 'Fredkin', description: '同じ形が何度も現れる', rule: Fredkin, bsRule: "B1357/S02468" },
  { title: 'Seeds', description: '爆発的に増えていく。', rule: Seeds, bsRule: "B2/S02468" },
  { title: 'Live Free or Die', description: '隣接するセルがないセルのみが生き残る爆発ルール', rule: Live_Free_or_Die, bsRule: "B2/S0" },
  { title: 'Serviettes', description: 'すべてのセルが世代ごとに死ぬ爆発ルール', rule: Serviettes, bsRule: "B234/S" },
  { title: 'Iceballs', description: '', rule: Iceballs, bsRule: "B25678/S5678" },
  { title: 'Life without Death', description: '一度生存セルになったら死ぬことはない', rule: Life_without_death, bsRule: "B3/S012345678" },
  { title: 'Dot Life', description: 'ライフゲームに似ている', rule: DotLife, bsRule: "B3/S023" },
  { title: 'Flock', description: '', rule: Flock, bsRule: "B3/S12" },
  { title: 'Mazectric', description: '迷路', rule: Mazectric, bsRule: "B3/S1234" },
  { title: 'Maze', description: '迷路', rule: Maze, bsRule: "B3/S12345" },
  { title: 'B3S2', description: '', rule: B3S2, bsRule: "B3/S2" },
  { title: 'Three Four Life', description: 'ライフゲームに似ている', rule: Three_Four_Life, bsRule: "B34/S34" },
  { title: 'Bacteria', description: 'きもい。固まっていれば徐々に増えていく傾向がある', rule: Bacteria, bsRule: "B34/S456" },
  { title: 'Bugs', description: 'きもい。真っ黒な物体がうじゃうじゃ', rule: Bugs, bsRule: "B3567/S15678" },
  { title: 'Holstein', description: '', rule: Holstein, bsRule: "B35678/S4678" },
  { title: 'Amoeba', description: '複雑', rule: Amoeba, bsRule: "B357/S1358" },
  { title: 'HighLife', description: 'ライフゲームに似ている', rule: HighLife, bsRule: "B36/S23" },
  { title: 'Castles', description: '城のような形になる。周りがギザギザ', rule: Castles, bsRule: "B3678/S135678" },
  { title: 'Day and Night', description: '生死が安定している', rule: Day_and_Night, bsRule: "B3678/S34678" },
  { title: 'Mazectric with Mice', description: '迷路の中で何かが動いている', rule: Mazectric_with_Mice, bsRule: "B37/S1234" },
  { title: 'Maze with Mice', description: '迷路の中で何かが動いている2', rule: Maze_with_Mice, bsRule: "B37/S12345" },
  { title: 'Dry Life', description: 'ライフゲームに似ている', rule: DryLife, bsRule: "B37/S23" },
  { title: 'Vote', description: 'RPGマップのような形に安定する。周りのセルの多いほうの状態に変化するので「Vote」', rule: Vote, bsRule: "B5678/S45678" },
];



function getMultirange(str=""){
  const list = []
  for(let l = 0;l<str.length;l++){
    let r = l;
    for(let i = l;i<str.length;i++){
      if(i-l===str[i]-str[l]) r = i;
    }
    list.push(
      {
        target: {
          type: "state",
          value: 2,
        },
        min: {
          type: "number",
          value: str[l]-'0',
        },
        max: {
          type: "number",
          value: str[r]-'0',
        }
      }
    )
    l = r;
  }
  return list;
}

export function bsToMultiRange(B = "", S = "") {
  const Dcon = getMultirange(B);  
  const Acon = getMultirange(S);
  
  const Dead = new State(1, "Dead", "white", true, 1, [
    {
      condition: Dcon,
      nextState: 2,
      operator: 'or',
    },
  ]);
  
  const Alive = new State(2, "Alive", "black", true, 1, [
    {
      condition: Acon,
      nextState: 2,
      operator: 'or',
    },
  ]);

  return [Dead, Alive];
}


