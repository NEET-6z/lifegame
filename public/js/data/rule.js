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
  { title: 'Life', description: '通常のライフゲームです', rule: Life },
  { title: 'Antilife', description: '', rule: Antilife },
  { title: 'Oils', description: 'オイル', rule: Oils },
  { title: 'Invertamaze', description: '世代ごとに反転する迷路を作成する', rule: Invertamaze },
  { title: 'H Trees', description: 'Hな形になる', rule: H_trees },
  { title: 'GNARL', description: 'グナル', rule: GNARL },
  { title: 'Replicator', description: '同じ形が何度も現れる', rule: Replicator },
  { title: 'Fredkin', description: '同じ形が何度も現れる', rule: Fredkin },
  { title: 'Seeds', description: '爆発的に増えていく。シュシュポッポ', rule: Seeds },
  { title: 'Live Free or Die', description: '隣接するセルがないセルのみが生き残る爆発ルール', rule: Live_Free_or_Die },
  { title: 'Serviettes', description: 'すべてのセルが世代ごとに死ぬ爆発ルール', rule: Serviettes },
  { title: 'Iceballs', description: '', rule: Iceballs },
  { title: 'Life without Death', description: '一度生存セルになったら死ぬことはない', rule: Life_without_death },
  { title: 'Dot Life', description: 'ライフゲームに似ている', rule: DotLife },
  { title: 'Flock', description: '', rule: Flock },
  { title: 'Mazectric', description: '迷路', rule: Mazectric },
  { title: 'Maze', description: '迷路', rule: Maze },
  { title: 'B3S2', description: '', rule: B3S2 },
  { title: 'Three Four Life', description: 'ライフゲームに似ている', rule: Three_Four_Life },
  { title: 'Bacteria', description: 'きもい。固まっていれば徐々に増えていく傾向がある', rule: Bacteria },
  { title: 'Bugs', description: 'きもい。真っ黒な物体がうじゃうじゃ', rule: Bugs },
  { title: 'Holstein', description: '', rule: Holstein },
  { title: 'Amoeba', description: '複雑', rule: Amoeba },
  { title: 'HighLife', description: 'ライフゲームに似ている', rule: HighLife },
  { title: 'Castles', description: '城のような形になる。周りがギザギザ', rule: Castles },
  { title: 'Day and Night', description: '生死が安定している', rule: Day_and_Night },
  { title: 'Mazectric with Mice', description: '迷路の中で何かが動いている', rule: Mazectric_with_Mice },
  { title: 'Maze with Mice', description: '迷路の中で何かが動いている2', rule: Maze_with_Mice },
  { title: 'Dry Life', description: 'ライフゲームに似ている', rule: DryLife },
  { title: 'Vote', description: 'RPGマップのような形に安定する。周りのセルの多いほうの状態に変化するので「Vote」です', rule: Vote },
];

export function bsToMultiRange(B = "", S = "") {
  const Dcon = [];

  for(let l = 0;l<B.length;l++){
    let r = l;
    for(let i = l;i<B.length;i++){
      if(i-l==B[i]-B[l]) r = i;
    }
    Dcon.push(
      {
        target: {
          type: "state",
          value: 2,
        },
        min: {
          type: "number",
          value: B[l]-'0',
        },
        max: {
          type: "number",
          value: B[r]-'0',
        }
      }
    )
    l = r;
  }

  
  const Acon = [];
  
  for(let l = 0;l<S.length;l++){
    let r = l;
    for(let i = l;i<S.length;i++){
      if(i-l==S[i]-S[l]) r = i;
    }
    Acon.push(
      {
        target: {
          type: "state",
          value: 2,
        },
        min: {
          type: "number",
          value: S[l]-'0',
        },
        max: {
          type: "number",
          value: S[r]-'0',
        }
      }
    )
    l = r;
  }
  
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


