# 外部サービス連携チェック（「できない」は必ず実機検証してから言う）

## 社長の原則（最重要）
**「できない」と言う前に、必ず実機で可否を検証する。** 何も確認せずに不可と即答しない。
検証した事実だけを根拠に可否を答え、結果はここに記録する（次のセッションが無駄に再検証しない／二度と“忘れない”ため）。

## 検証手順（外部サービス連携を頼まれたら）
1. **到達性を実機確認**（この順で）：
   - `curl -s -o /dev/null -w "%{http_code}" -m20 https://<host>` … `000`＝接続不可
   - `curl -sS "$HTTPS_PROXY/__agentproxy/status"` の `recentRelayFailures` … `403 CONNECT (policy denial)`＝ネットワークポリシーで遮断
   - Playwrightで実際に開く：`NODE_PATH=/opt/node22/lib/node_modules PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node script.js` … `ERR_TUNNEL_CONNECTION_FAILED`＝遮断
2. **事実に基づいて可否を答える**（推測で「できない」と言わない）。
3. **結果をこのファイルに追記**（検証済み事実として蓄積）。

## 検証済み事実
### Buffer（2026-08-02 検証）
- **Buffer は この環境のネットワークポリシーで遮断されている**（buffer.com / publish.buffer.com / login.buffer.com / api.bufferapp.com）。
  - curl＝`000` ／ proxy status＝`403 to CONNECT (policy denial)` ／ Playwright＝`net::ERR_TUNNEL_CONNECTION_FAILED`。3経路で一致。
- 結論：**この環境からはBufferをブラウザで開くことも、APIを叩くこともできない**（ログインの有無に関係なく、ネットワーク層で遮断）。
- 社長のChromeは**社長のローカル端末側**にあり、このクラウド環境からは到達できない（別ネットワーク）。＝「社長のChromeが既にログイン済み」でも、このサンドボックスからそのセッションは使えない。

## 遮断を解除して自動予約を実現する道
- **環境のネットワークポリシーで `buffer.com` / `api.bufferapp.com` を許可**する必要がある（環境作成時の設定・管理者。docs: https://code.claude.com/docs のネットワークポリシー参照）。
- 許可された環境であれば：
  - **A. Buffer API（トークン）** … 私が予約投入スクリプトを作成し、このHQに保存（次から忘れない・自動で回る）。← 推奨
  - **B. ブラウザ自動化（Playwright）** … 社長のBufferセッションcookie or トークンを渡してもらう。壊れやすい（2FA/UI変更）。
- どちらも「実装したらHQに保存」して、決めた作業として永続化する。

## 遮断されている今の最善
- `docs/threads-campaign/exports/BUFFER-SCHEDULE.md` を使い、**社長が手動でBuffer予約**が最短・確実。
- 自動化したい場合は、まず「Bufferを許可した環境」を用意することが前提条件。
