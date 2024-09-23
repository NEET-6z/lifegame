import { State } from '../core/StateManager.js';

export const Life = bsToMultiRange("3", "23");
export const Antilife = bsToMultiRange("0123478", "34678");
export const Oils = bsToMultiRange("014", "2");
export const Invertamaze = bsToMultiRange("028", "0124");
export const Neon_Blobs = bsToMultiRange("08", "4");
export const H_trees = bsToMultiRange("1", "012345678");
export const FUZZ = bsToMultiRange("1", "014567");
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
  { title: 'Life', description: '通常のライフ', rule: Life },
  { title: 'Antilife', description: '反ライフ', rule: Antilife },
  { title: 'Oils', description: 'オイル', rule: Oils },
  { title: 'Invertamaze', description: 'インバート迷路', rule: Invertamaze },
  { title: 'Neon Blobs', description: 'ネオンブロブ', rule: Neon_Blobs },
  { title: 'H Trees', description: 'Hの木', rule: H_trees },
  { title: 'FUZZ', description: 'ファズ', rule: FUZZ },
  { title: 'GNARL', description: 'グナル', rule: GNARL },
  { title: 'Replicator', description: 'レプリケーター', rule: Replicator },
  { title: 'Fredkin', description: 'フレドキン', rule: Fredkin },
  { title: 'Seeds', description: 'シード', rule: Seeds },
  { title: 'Live Free or Die', description: '自由に生きる', rule: Live_Free_or_Die },
  { title: 'Serviettes', description: 'サーヴィエット', rule: Serviettes },
  { title: 'Iceballs', description: 'アイスボール', rule: Iceballs },
  { title: 'Life without Death', description: '死なないライフ', rule: Life_without_death },
  { title: 'Dot Life', description: 'ドットライフ', rule: DotLife },
  { title: 'Flock', description: 'フロック', rule: Flock },
  { title: 'Mazectric', description: 'マゼクトリック', rule: Mazectric },
  { title: 'Maze', description: '迷路', rule: Maze },
  { title: 'B3S2', description: 'B3S2', rule: B3S2 },
  { title: 'Three Four Life', description: '三四ライフ', rule: Three_Four_Life },
  { title: 'Bacteria', description: 'バクテリア', rule: Bacteria },
  { title: 'Bugs', description: 'バグ', rule: Bugs },
  { title: 'Holstein', description: 'ホルスタイン', rule: Holstein },
  { title: 'Amoeba', description: 'アメーバ', rule: Amoeba },
  { title: 'HighLife', description: 'ハイライフ', rule: HighLife },
  { title: 'Castles', description: '城', rule: Castles },
  { title: 'Day and Night', description: '昼と夜', rule: Day_and_Night },
  { title: 'Mazectric with Mice', description: 'マゼクトリックとマウス', rule: Mazectric_with_Mice },
  { title: 'Maze with Mice', description: 'マウスと迷路', rule: Maze_with_Mice },
  { title: 'Dry Life', description: 'ドライライフ', rule: DryLife },
  { title: 'Vote', description: '投票', rule: Vote },
];

export function bsToMultiRange(B = "", S = "") {
  const Dcon = [];

  //さぼりしあ
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


