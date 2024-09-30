# CAS

## 概要
セル・オートマトンを自由にカスタマイズしてシミュレーションできます。
セルオートマトンとは、格子状のセルが特定のルールに従って時間と共に変化するモデルで、生命の進化や物理現象のモデリングに用いられます。
このサイトでは、コンウェイの「ライフゲーム」を中心に、様々なルールのセルオートマトンをシミュレーションできます。

## 特徴
- 用意されたルールの読み込み
- ユーザーによるルールのカスタマイズ機能
- インタラクティブなGUIを提供
- ライフゲーム×パズル のステージモード


## 基本操作
- start: スタート
- stop: ストップ
- undo: 戻る
- clear: すべて死滅セルに
- randomに生成する: ランダムに生成する
- キャッシュをクリアしてリロード: 盤面のサイズや状態がすべて初期化される。



- 左ドラッグ: セルを選択中の状態に変更
- 右ドラッグ: セルを死滅に変更


### ショートカットキー
- space: start/stop
- z: Undo
- x: 選択中の状態を変更
- c: Clear

## カスタマイズ機能

### グリッドの形状
1. 長方形  
ムーア1近傍

1. 三角形  
三角形ムーア近傍

1. 六角形  
六角形1近傍


の3つを用意しています。トップページから選択できます。

### グリッドのサイズ
1~100まで対応しています。
S画面の右上から変更可能です。

### シミュレーション速度
20~1000まで対応しています。
値が小さいほど速度が早いです。

### 各状態の名前,色の編集
S画面の右側にある状態のリストの「名前&色編集」から編集できます。
「保存」を押さないと編集内容に更新されません。

### 各状態のルール編集
S画面の右側なる状態のリストの「ルール編集」から編集できます。

全体は複数の遷移ルールからなっていて、1つの遷移ルールには複数の条件式が含まれています。
それらの条件式をすべてもしくは一つ以上満たした場合その遷移ルールが適用されます。

#### 条件式
各条件式では`a<=b<=c`のような大小関係を満たしているか判定することができます。
a,b,cに代入できる値は、数値、近傍の特定の状態の個数、近傍のパラメータの総和　です。(パラメータについては後ほど説明します)

#### 遷移ルール
遷移ルールは上から順番に処理されていき、適用(条件を満たす)されたら即処理を打ち切ります。すべての遷移ルールが適用されなかった場合は、「すべてのルールを満たさないときの遷移先」へ遷移します。(if elseif elseみたいな？)

例えば、コンウェイのライフゲームなら

生存セル
- `2<={近傍の生存セルの個数}<=3` なら生存セルへ遷移。
- そうでないなら死滅セルに遷移

死滅セル
- `3<={近傍の生存セルの個数}<=3` なら生存セルへ遷移
- そうでないなら死滅セルに遷移

のように表現でき、これをCASで実装すると

![](https://github.com/user-attachments/assets/ffbf1576-39fd-4a3b-bb4b-14a8f8b022ee)

![](https://github.com/user-attachments/assets/1b8fe25c-5d92-4b8d-8deb-657c2f32af5f)


こうなります。

#### パラメータについて
これまでの機能を活用すればかなり複雑なルールでも表現できますが、少し冗長になってしまうケースがそれなりにあることに気づきました。

パラメータは、各状態に割り当てられた5つの数値のことです。条件式の中でこのパラメータの**総和**を使うことができます。

ライフゲームをあえてパラメータを使って表現するならば、

生存セル(p1=1)
- 2<={近傍のセルのp1の総和}<=3 なら生存セルへ遷移。
- そうでないなら死滅セルに遷移

死滅セル(p1=0)
- 3<={近傍のセルのp1の総和}<=3 なら生存セルへ遷移
- そうでないなら死滅セルに遷移

です。(生存セルの個数をp1の総和に置き換えただけです)


パラメータ機能を導入することで嬉しいことは大きく2つあります


1. 状態のグルーピング化  
状態A,B,C,Dがあったとすると「近傍のAの個数とBの個数の総和がx以上」のような条件式を作ることができる。
AとBのp1に1を設定して、CとDには0を設定すると、`x<=(近傍のセルの)p1の総和<=999`のようにシンプルに条件を書くことができます。

2. 状態の個数の差分や比率関係を指定できる  
パラメータには**負の数**を設定することができます。
例えば状態Aのp1に1を設定し、状態Bのp1に-1を設定すると、「p1の総和」が指すものは「状態Aの個数-状態Bの個数」です。
また、Aに1を、Bに-2を設定したとき、`0<=p1の総和<=999`という条件式で「状態Aの個数が状態Bの二倍以上か」を判定できます。


## テンプレート機能
状態全体の保存と読み込みです

### 保存
S画面の右下にある「現在のルールを保存」から、ルール名と説明をつけて、現在のすべての状態を保存することができます。

### 読み込み
自分が保存したルールや、サイトに用意されているデフォルトのルールを読み込むことができます。

特徴的なルールを**30種類**用意しているので、興味があれば読み込んでみてください。(特に、Hな形になる「H Trees」がおすすめ)

## ステージモード(おまけ)
おまけのつもりでした。

条件を満たす初期盤面を作成できたらクリアです。
全15ステージ
