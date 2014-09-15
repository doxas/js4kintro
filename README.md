#js4kintro

javascript と WebGL、そして GLSL を用いて行う 4k intro のためのひな形ファイルやサンプルファイルを収めたリポジトリです。

現状ではひな形となるベースファイルの容量が約 1.3 キロバイトになっています。工夫次第で約 2.7 キロバイトほどフラグメントシェーダのコードが書ける状態です。

リポジトリに含まれるサンプルをオンラインで実行できるリンクが文末にあります。

## イベント開催に向けて仕様その他策定中

js4kintro の企画として作品を募集するイベントを考えています。「classic 部門」と制限なしの「nolimit 部門」を開催する方針です。

classic 部門では同じひな形を利用します。このひな形は HTML や javascript、CSS がすべて含まれており、その状態で最適化されて 1.3KB の容量です。つまり残りの約 2.7KB を GLSL のフラグメントシェーダに割り当てることができます。

最終的には、最適化前の状態のコード、そして実際に 4k まで最適化したコード、両者を運営が受け取り公開する予定です。

一方、nolimit 部門には制限はありません。ファイル容量制限なし、HTML や javascript なども独自実装可となっています。


## ルール(各部門に共通の仕様)

* 外部ファイルを参照せずに単独で動作すること
* ライセンスの表記が必要なライブラリやコードを利用していないこと
* オフラインで動作するように設計されていること
* 最低でも 512px/辺 の矩形領域で動作することを保証すること
* デスクトップ版の、その時点での最新の Chrome と FireFox で同じように動作すること


## classic 部門の仕様とルール

* ひな形ファイルを元に作成しファイルサイズが 4096byte 以下であること
* ひな形ファイルで修正を加えていいのはフラグメントシェーダの部分のみ
* HTML には最終的にタイトル(titleタグ)を含めるがこれはファイルサイズにカウントしない
* シェーダのコンパイルとリンクをチェックしておりエラーがある場合には動作しない
* ブラウザのクライアント領域全面に canvas が自動的に最大化されます
* window.onload で動作開始、ESC キーによって動作を停止します


## nolimit 部門の仕様とルール

* 無制限とはいっても最低限、WebGL と GLSL を利用して canvas にレンダリングすること
* 画面に何もレンダリングされない(例えば音声のみなど)は不可


## 書いてみたくなったら

src フォルダには、一切省略せずに記述した full 版と通常版のファイルが入っています。

それぞれに、デバッグ用のコードを追加したバージョンが別途付随します。デバッグ用のコードが含まれているバージョンでは、シェーダのコンパイルなどでエラーが起こった場合にその原因をアラートで画面に出力しますので最初のうちはデバッグ版を利用したほうが開発しやすいと思います。

尚、full 版にはプリセットのフラグメントシェーダのコードとして、ジュリア集合が描かれるサンプルが入っています。


## オンラインサンプル

オンラインサンプルは、Windows7(3.40GHz Intel Corei5-3570K+Intel HD Graphics 4000+メモリ8GB)、また MacBookAir(1.4GHzデュアルコアIntel Core i5+Intel HD Graphics 5000+メモリ8MB+13.3インチ) でも動作を確認しました。スクリーンサイズを 512px 四方の正方形にして実行するとほぼ処理落ちしないで動作しているように見えます。ただスクリーンサイズの一辺が 1000 を超えるくらいになると、前述のマシンでは少々処理落ちが目立つようになります(特にレイマーチング系)。


* [01. orb](http://wgld.org/o/js4kintro/sample/01_orb "orb")
* [02. ring](http://wgld.org/o/js4kintro/sample/02_ring "ring")
* [03. flower](http://wgld.org/o/js4kintro/sample/03_flower "flower")
* [04. noise](http://wgld.org/o/js4kintro/sample/04_noise "noise")
* [05. raymarching sphere](http://wgld.org/o/js4kintro/sample/05_raymarching_sphere "sphere")
* [06. raymarching shadow](http://wgld.org/o/js4kintro/sample/06_raymarching_shadow "shadow")
* [07. simple raytrace](http://wgld.org/o/js4kintro/sample/07_simple_raytrace "raytrace")


