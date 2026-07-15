# Threads カルーセル画像 書き出し（exports/）

初回投稿用の実PNG（1080×1350 / 4:5）を `card-templates.html` から書き出したもの。

> 📌 そのまま投稿できる初回パッケージ（文面＋画像＋投稿手順）は [`LAUNCH-PACK.md`](./LAUNCH-PACK.md)。

## 生成物
| ファイル | 内容 |
|---|---|
| `cover.png` | 表紙（`.card.cover`／シリーズ予告） |
| `01-revolist.png` | #01 レボリスト タイプカード |
| `common-traits.png` | 「よくある特性」あるあるカード（“つい最初に動いちゃう人”） |

すべて 1080×1350・RGB PNG。

## 再生成コマンド
```bash
cd docs/threads-campaign/exports
NODE_PATH=/opt/node22/lib/node_modules \
PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers \
node export.js
```
Playwright 1.56.1（global）＋ Chromium（`/opt/pw-browsers`）を使用。追加インストール不要。

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
