# Revo111 番外編リサーチ版 Googleスプレッドシート作成コード

## 目的

番外編リサーチ版の回答・結果・感想を、Googleスプレッドシートで管理できるようにする。

手作業でタブや列を作るのではなく、Google Apps Scriptにコードを貼り付けて実行するだけで、必要なシート構成を作れるようにする。

---

## 使い方

1. Googleスプレッドシートを新規作成する
2. メニューから「拡張機能」→「Apps Script」を開く
3. 下のコードを貼り付ける
4. `setupRevo111SpecialResearchSpreadsheet` を実行する
5. 権限確認が出たら許可する
6. スプレッドシートに戻る

これで、番外編リサーチ用のタブと列が自動作成される。

---

## 途中で質問を変更する場合のルール

モニター中に質問文や選択肢を変える場合、古い質問は消さない。

新しい質問として追加する。

必ず以下を守る。

- 質問文を変えたら、質問バージョンを上げる
- 選択肢を変えたら、質問バージョンを上げる
- スコアの扱いを変えたら、質問バージョンを上げる
- 古い質問は削除せず、終了日を入れる
- 回答ログには、回答時点の質問IDと質問バージョンを保存する

これにより、途中で質問が変わっても過去データの意味が残る。

---

## Apps Scriptコード

```javascript
/**
 * Revo111 番外編リサーチ版
 * Googleスプレッドシート初期セットアップ
 *
 * 使い方:
 * 1. Googleスプレッドシートを開く
 * 2. 拡張機能 > Apps Script を開く
 * 3. このコードを貼り付ける
 * 4. setupRevo111SpecialResearchSpreadsheet を実行する
 */

const REVO111_SPECIAL_SHEETS = [
  {
    name: "設定_質問バージョン",
    frozenRows: 1,
    headers: [
      "質問バージョン",
      "対象プラン",
      "ステータス",
      "開始日",
      "終了日",
      "変更理由",
      "メモ",
    ],
    rows: [
      ["価値の流れ_v1", "価値の流れプラン", "公開中", "", "", "初期版", ""],
      ["生年月日リズム_v1", "生年月日リズムプラン", "公開中", "", "", "初期版", ""],
    ],
  },
  {
    name: "設定_質問マスター",
    frozenRows: 1,
    headers: [
      "質問ID",
      "質問バージョン",
      "対象プラン",
      "表示順",
      "質問文",
      "回答形式",
      "選択肢",
      "検証軸",
      "スコア対象",
      "公開状態",
      "開始日",
      "終了日",
      "変更理由",
      "メモ",
    ],
    rows: buildQuestionMasterRows_(),
  },
  {
    name: "生データ_番外編回答",
    frozenRows: 1,
    headers: [
      "診断ID",
      "回答日時",
      "受けたプラン",
      "質問バージョン",
      "質問ID",
      "表示順",
      "質問文",
      "回答値",
      "回答ラベル",
      "検証軸",
      "スコア対象",
      "Revo111メイン役割",
      "Revo111サブ役割",
      "Revo111補助役割",
      "生年月日入力同意",
      "生年",
      "生月",
      "生日",
      "生まれた時間がわかるか",
      "生まれた時間",
      "生まれた場所",
      "流入元",
      "紹介コード",
      "ページURL",
      "メモ",
    ],
  },
  {
    name: "生データ_番外編結果",
    frozenRows: 1,
    headers: [
      "診断ID",
      "作成日時",
      "受けたプラン",
      "質問バージョン",
      "Revo111メイン役割",
      "Revo111サブ役割",
      "Revo111補助役割",
      "番外編の主結果",
      "番外編の補助結果",
      "結果要約",
      "仕事・副業の提案",
      "コミュニティでの関わり方",
      "今日の一歩",
      "コミュニティ案内表示",
      "流入元",
      "紹介コード",
      "ページURL",
      "メモ",
    ],
  },
  {
    name: "生データ_番外編感想",
    frozenRows: 1,
    headers: [
      "診断ID",
      "送信日時",
      "受けたプラン",
      "質問バージョン",
      "Revo111メイン役割",
      "番外編の主結果",
      "結果はしっくりきたか",
      "仕事や活動に活かせそうか",
      "コミュニティで試してみたいか",
      "どこが印象に残ったか",
      "違和感があった部分",
      "もっと知りたい内容",
      "コミュニティ案内希望",
      "名前",
      "SNS",
      "連絡先",
      "流入元",
      "紹介コード",
      "メモ",
    ],
  },
  {
    name: "分析_番外編サマリー",
    frozenRows: 1,
    headers: ["項目", "値", "メモ"],
    rows: [
      ["総回答数", "=COUNTA('生データ_番外編結果'!A2:A)", ""],
      ["価値の流れプラン回答数", '=COUNTIF(\'生データ_番外編結果\'!C:C,"価値の流れプラン")', ""],
      ["生年月日リズムプラン回答数", '=COUNTIF(\'生データ_番外編結果\'!C:C,"生年月日リズムプラン")', ""],
      ["感想フォーム回答数", "=COUNTA('生データ_番外編感想'!A2:A)", ""],
      ["コミュニティ案内希望数", '=COUNTIF(\'生データ_番外編感想\'!M:M,"希望する")', ""],
      ["生年月日入力同意数", '=COUNTIF(\'生データ_番外編回答\'!O:O,"同意する")', ""],
    ],
  },
  {
    name: "分析_価値の流れ",
    frozenRows: 1,
    headers: ["分析項目", "確認内容", "メモ"],
    rows: [
      ["始まりをつくる力", "高い人のRevo111役割を見る", ""],
      ["人と広げる力", "高い人のRevo111役割を見る", ""],
      ["流れを育てる力", "高い人のRevo111役割を見る", ""],
      ["仕組みにする力", "高い人のRevo111役割を見る", ""],
      ["仕事・副業関心", "結果タイプ別に見る", ""],
      ["コミュニティ関心", "結果タイプ別に見る", ""],
    ],
  },
  {
    name: "分析_生年月日リズム",
    frozenRows: 1,
    headers: ["分析項目", "確認内容", "メモ"],
    rows: [
      ["伸びる力", "高い人のRevo111役割を見る", ""],
      ["伝える力", "高い人のRevo111役割を見る", ""],
      ["支える力", "高い人のRevo111役割を見る", ""],
      ["整える力", "高い人のRevo111役割を見る", ""],
      ["深める力", "高い人のRevo111役割を見る", ""],
      ["生年月日入力同意", "同意率を見る", ""],
      ["タイミング関心", "知りたい内容として選ばれた割合を見る", ""],
    ],
  },
  {
    name: "分析_コミュニティ誘導",
    frozenRows: 1,
    headers: ["分析項目", "確認内容", "メモ"],
    rows: [
      ["結果タイプ別コミュニティ関心", "番外編の主結果ごとに見る", ""],
      ["Revo111役割別コミュニティ関心", "メイン役割ごとに見る", ""],
      ["感想入力と参加意欲", "感想を書いた人ほど参加意欲が高いか見る", ""],
      ["流入元別コミュニティ関心", "流入元ごとの反応を見る", ""],
    ],
  },
  {
    name: "分析_紹介流入",
    frozenRows: 1,
    headers: ["分析項目", "確認内容", "メモ"],
    rows: [
      ["流入元", "どこから来たかを見る", ""],
      ["紹介コード", "紹介経由の反応を見る", "外部にランキング表示しない"],
      ["紹介経由のしっくり度", "感想ログとつなげて見る", ""],
      ["紹介経由のコミュニティ関心", "感想ログとつなげて見る", ""],
    ],
  },
  {
    name: "ダッシュボード_番外編",
    frozenRows: 1,
    headers: ["表示項目", "値", "メモ"],
    rows: [
      ["総回答数", "='分析_番外編サマリー'!B2", ""],
      ["価値の流れプラン回答数", "='分析_番外編サマリー'!B3", ""],
      ["生年月日リズムプラン回答数", "='分析_番外編サマリー'!B4", ""],
      ["感想フォーム回答数", "='分析_番外編サマリー'!B5", ""],
      ["コミュニティ案内希望数", "='分析_番外編サマリー'!B6", ""],
      ["生年月日入力同意数", "='分析_番外編サマリー'!B7", ""],
    ],
  },
];

function setupRevo111SpecialResearchSpreadsheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  spreadsheet.rename("Revo111 番外編リサーチ データベース");

  REVO111_SPECIAL_SHEETS.forEach((sheetConfig) => {
    const sheet = getOrCreateSheet_(spreadsheet, sheetConfig.name);
    setupSheet_(sheet, sheetConfig);
  });

  moveSheetsInOrder_(spreadsheet, REVO111_SPECIAL_SHEETS.map((sheet) => sheet.name));
  SpreadsheetApp.flush();
}

function createNewRevo111SpecialResearchSpreadsheet() {
  const spreadsheet = SpreadsheetApp.create("Revo111 番外編リサーチ データベース");

  REVO111_SPECIAL_SHEETS.forEach((sheetConfig) => {
    const sheet = getOrCreateSheet_(spreadsheet, sheetConfig.name);
    setupSheet_(sheet, sheetConfig);
  });

  moveSheetsInOrder_(spreadsheet, REVO111_SPECIAL_SHEETS.map((sheet) => sheet.name));
  SpreadsheetApp.flush();

  Logger.log("作成したスプレッドシートURL: " + spreadsheet.getUrl());
}

function getOrCreateSheet_(spreadsheet, sheetName) {
  const existingSheet = spreadsheet.getSheetByName(sheetName);
  if (existingSheet) return existingSheet;
  return spreadsheet.insertSheet(sheetName);
}

function setupSheet_(sheet, sheetConfig) {
  sheet.clear();

  if (sheetConfig.headers && sheetConfig.headers.length > 0) {
    sheet.getRange(1, 1, 1, sheetConfig.headers.length).setValues([sheetConfig.headers]);
    sheet.getRange(1, 1, 1, sheetConfig.headers.length)
      .setFontWeight("bold")
      .setBackground("#111111")
      .setFontColor("#ffffff");
  }

  if (sheetConfig.rows && sheetConfig.rows.length > 0) {
    sheet.getRange(2, 1, sheetConfig.rows.length, sheetConfig.headers.length).setValues(sheetConfig.rows);
  }

  if (sheetConfig.frozenRows) {
    sheet.setFrozenRows(sheetConfig.frozenRows);
  }

  sheet.autoResizeColumns(1, Math.max(1, sheetConfig.headers.length));
}

function moveSheetsInOrder_(spreadsheet, sheetNames) {
  sheetNames.forEach((sheetName, index) => {
    const sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) return;
    spreadsheet.setActiveSheet(sheet);
    spreadsheet.moveActiveSheet(index + 1);
  });
}

function buildQuestionMasterRows_() {
  const rows = [];

  addQuestions_(rows, "価値の流れ_v1", "価値の流れプラン", "始まりをつくる力", [
    "新しい企画やアイデアを考える時間があると元気が出る",
    "まだ形になっていない可能性を見つけるのが好き",
    "誰もやっていない切り口を考えると動きたくなる",
    "未来のイメージを話して、人を前向きにしたい",
  ], 1);

  addQuestions_(rows, "価値の流れ_v1", "価値の流れプラン", "人と広げる力", [
    "人と話すことで、自分の考えが広がっていく",
    "誰かの魅力や可能性を見つけるのが好き",
    "人を紹介したり、場をつないだりすることに喜びを感じる",
    "一人で進めるより、誰かと熱量を共有すると動きやすい",
  ], 5);

  addQuestions_(rows, "価値の流れ_v1", "価値の流れプラン", "流れを育てる力", [
    "今は動く時か、待つ時かを感覚的に見ている",
    "周囲の状態を見ながら、無理なく進めるのが得意",
    "現場の空気や人の気持ちを感じ取って動くことが多い",
    "長く続く関係や活動を、少しずつ育てたい",
  ], 9);

  addQuestions_(rows, "価値の流れ_v1", "価値の流れプラン", "仕組みにする力", [
    "情報や手順を整理すると安心して動ける",
    "続けられる仕組みやルールを作るのが好き",
    "数字、記録、データから改善点を見つけるのが楽しい",
    "一度作った流れを、より使いやすく整えたくなる",
  ], 13);

  addQuestions_(rows, "生年月日リズム_v1", "生年月日リズムプラン", "伸びる力", [
    "新しい環境に入ると、自分の可能性が広がる感覚がある",
    "小さくてもいいので、前に進む実感があると元気が出る",
    "誰かの成長を見ると、自分も動きたくなる",
    "今の自分には、次の挑戦で育つ可能性があると感じる",
  ], 1);

  addQuestions_(rows, "生年月日リズム_v1", "生年月日リズムプラン", "伝える力", [
    "想いや体験を言葉や表現にすると、周囲に熱が広がる",
    "人前で話す、発信する、見せることで力が出ることがある",
    "場の空気が明るくなる瞬間に喜びを感じる",
    "誰かの心に火が灯るような関わり方をしたい",
  ], 5);

  addQuestions_(rows, "生年月日リズム_v1", "生年月日リズムプラン", "支える力", [
    "誰かが安心できる場をつくることに価値を感じる",
    "すぐに結果が出なくても、じっくり育てることができる",
    "人の話を受け止めたり、居場所を整えたりすることが多い",
    "自分の存在が、誰かの土台になるならうれしい",
  ], 9);

  addQuestions_(rows, "生年月日リズム_v1", "生年月日リズムプラン", "整える力", [
    "ものごとの本質や優先順位を見極めたい",
    "整った形、美しい流れ、無駄のない仕組みに惹かれる",
    "境界線やルールがあると、安心して力を使える",
    "大切なものを選び取ることで、未来が澄んでいく感覚がある",
  ], 13);

  addQuestions_(rows, "生年月日リズム_v1", "生年月日リズムプラン", "深める力", [
    "一人で考える時間が、自分の力を回復させてくれる",
    "表に出る前に、情報や感覚を深く蓄えることが多い",
    "人の言葉の奥にある気持ちや流れを感じ取ることがある",
    "すぐに動くより、流れを読んでから動く方が自然に進める",
  ], 17);

  return rows;
}

function addQuestions_(rows, questionVersion, planName, axisName, questions, startOrder) {
  questions.forEach((questionText, index) => {
    const displayOrder = startOrder + index;
    const questionId = `${questionVersion}_${axisName}_${displayOrder}`;
    rows.push([
      questionId,
      questionVersion,
      planName,
      displayOrder,
      questionText,
      "5段階",
      "1=あまり当てはまらない,2=少し当てはまる,3=どちらともいえない,4=かなり当てはまる,5=とても当てはまる",
      axisName,
      "対象",
      "公開中",
      "",
      "",
      "初期版",
      "",
    ]);
  });
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Revo111")
    .addItem("番外編リサーチ用シートを作成", "setupRevo111SpecialResearchSpreadsheet")
    .addToUi();
}
```

---

## 作成されるタブ

```text
設定_質問バージョン
設定_質問マスター
生データ_番外編回答
生データ_番外編結果
生データ_番外編感想
分析_番外編サマリー
分析_価値の流れ
分析_生年月日リズム
分析_コミュニティ誘導
分析_紹介流入
ダッシュボード_番外編
```

---

## 最初の運用

最初は、このコードで作成したスプレッドシートをマスターにする。

質問を変える場合は、`設定_質問マスター` に新しい質問バージョンとして追加する。

古い質問は消さない。

これで、途中で質問を変更しても、過去データと新しいデータを分けて分析できる。
