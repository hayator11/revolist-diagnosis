# Threads カルーセル画像 書き出し（exports/）

初回投稿用の実PNG（1080×1350 / 4:5）を `card-templates.html` から書き出したもの。

> 📌 そのまま投稿できる初回パッケージ（文面＋画像＋投稿手順）は [`LAUNCH-PACK.md`](./LAUNCH-PACK.md)。

## 生成物
| ファイル | 内容 |
|---|---|
| `cover.png` | 表紙（`.card.cover`／シリーズ予告） |
| `01-revolist.png` | #01 レボリスト タイプカード |
| `02-maxdesigner.png` | #02 マックスデザイナー タイプカード |
| `03-imagemaister.png` | #03 イメージマイスター タイプカード |
| `04-communicator.png` | #04 コミュニケーター タイプカード |
| `05-inforader.png` | #05 インフォレイダー タイプカード |
| `06-movmentor.png` | #06 ムーブメンター タイプカード |
| `07-premiercrafter.png` | #07 プルミエルクラフター タイプカード |
| `08-logicalmaister.png` | #08 ロジカルマイスター タイプカード |
| `09-arranger.png` | #09 アレンジャー タイプカード |
| `10-soulowner.png` | #10 ソウルオーナー タイプカード |
| `11-crazist.png` | #11 クレイジスト タイプカード |
| `common-traits.png` | 「よくある特性」あるあるカード（“つい最初に動いちゃう人”） |

すべて 1080×1350・RGB PNG。11タイプカードは `.num`（#01〜#11）のテキストで特定して書き出している。

### 色地×白文字の可読性メモ
薄めの色でも白文字が潰れないことを確認済み。
- アンバー（#06）／シアン（#04）は `card-templates.html` の `darktext:true` で
  チップ文字が濃紺インクになるため高コントラスト・良好。
- エメラルド（#05）は白文字でコントラスト十分。
- ローズ（#10 `#E8628A`）は白文字で当セット中もっとも弱めだが、太字のため十分可読。
- いずれもスクリプト側の色補正は不要（HTML無改変のまま）。

## 再生成コマンド
```bash
cd docs/threads-campaign/exports
NODE_PATH=/opt/node22/lib/node_modules \
PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers \
node export.js
```
Playwright 1.56.1（global）＋ Chromium（`/opt/pw-browsers`）を使用。追加インストール不要。

## Week3 柱C：組み合わせ／チームカード（量産版）
`combo-templates.html` の `COMBOS` 配列に1件足すだけで任意ペア／トリオを量産できる。書き出し：`cd docs/threads-campaign/exports && NODE_PATH=/opt/node22/lib/node_modules PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node export-combos.js`（各カードの `data-file` 属性を自動で拾って出力。生成物：`w3-01_revolist-x-movmentor.png`／`w3-03_maxdesigner-x-premiercrafter.png`／`w3-05_team-inforader.png`、各1080×1350）。

## 仕組み（export.js）
- `card-templates.html` を `file://` で開く。
- 対象カードを1枚ずつ、`transform:none` にして `document.body` 直下に固定配置（他カードは非表示）。
- viewport 1080×1350 ＋ `clip {0,0,1080,1350}` でスクリーンショット。近接カードの写り込みを回避。
- フォントは `document.fonts.ready` ＋ 500ms 待機。豆腐（□）回避のためスクリプト側の `addStyleTag` で `IPAGothic` を明示（HTMLは無改変）。

## 別カードを足したいとき
`export.js` の `TARGETS` 配列に `{ file, pick }` を追加する。`pick` は
ブラウザ内で対象 `.card` を返す関数（例：`textContent.includes('#02')`）。

## 代替（Firefox手動書き出し）
Playwrightが使えない場合：Firefoxで `card-templates.html` を開き、対象カードを
右クリック →「スクリーンショットを撮る」でノード単位に保存。ただし画面上は
`transform:scale(0.4)` 表示のため、実寸1080×1350にするには開発者ツールで
該当 `.card` の `transform` を `none` に変更してから撮影する。
