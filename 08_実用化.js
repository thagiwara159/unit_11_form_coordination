// ⭐️重要３シートどれ？タイムスタンプは？ドライブに保存するには？
// システムバックアップ
function createBackup() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    /* ⭐️変数を作ってそこにタイムスタンプとシートのデータを
     * 入れるのがわからなかった　バックアップしたいものを明確にして変数に入れる
    */
    const backup = {
        timestamp: new Date(), // ⭐️タイムスタンプはnew Date
        sheets: {}             // ⭐️ステータスはオブジェクトにする
    };

    // 重要シートをバックアップ
    /* ⭐️シートを配置化してfor Eachで変数に入れて
     * .getDataRange().getValue()で各シートの全データ取得できる
    */
    ['問題バンク', '成績データ', '設定'].forEach(sheetName => {
        const sheet = ss.getSheetByName(sheetName); // ⭐️変数に各シートの名前入れてる
        if (sheet) {
            backup.sheets[sheetName] =sheet // ⭐️シート名の入った変数を使ってデータの取得してるそれをバックアップに入れてる
                .getDataRange() // ⭐️この2行で全データ取得してる
                .getValues();
        }
    });
    
    // Google Driveに保存
    // ⭐️ドライブに保存はDriveApp.createFile(ファイル名，タイムスタンプ)
    const fileName = `テストシステム_バックアップ_
                        ${Utilities.formatDate(new Date(), 'JST', 'yyyy-MM-dd_HHmm')}.json`; // ⭐️タイムスタンプをフォーマット
    const json = JSON.stringify(backup); // ⭐️データをJSON形式に変換
    DriveApp.createFile(fileName, json); // 保存
    SpreadsheetApp.getUi().alert(`バックアップ完了: ${fileName}`); // ⭐️.getUi().alert(コメント,ファイル名など)でユーザーに見える形でお知らせ
}


// 週次自動バックアップ設定
// ⭐️自分で作ったのは変数に呼び出し関数を入れたが
// 直接 ScriptApp.newTrigger('ここ')に呼び出し関数入れても良かった
function setupAutoBackup() {
    ScriptApp.newTrigger('createBackup')
        .timeBased() // ⭐️タイムベースのトリガー
        .everyWeeks(1) // ⭐️毎週実行
        .onWeekDay(ScriptApp.WeekDay.SUNDAY) // ⭐️曜日指定
        .create(); // ⭐️トリガー生成　ここで完成

    // ⭐️spreadsheet.getUi().alert('コメント')で見える形に 🙆これ使える
    SpreadsheetApp.getUi().alert('毎週日曜日の自動バックアップを設定しました！');
}


// ⭐️問題数、設定、トリガー、フォーム作成状況を引っ張ってきてレポート？
// システム動作確認
/* ⭐️システム動作の確認の方法がわからなかった。作った関数を各チェック項目でチェックして
 * 変数にPushしてconst checks = []; 配列化して最終的にすべてをレポートで報告
 * チェック機能でユーザーに見える化することでユーザーフレンドリーなシステムになる！
*/
function checkSystem() {
    const checks = [];

    // 問題データチェック
    const questions = getAllQuestions();
        checks.push(`✅️問題数: ${questions.length}問`); // ⭐️Pushする内容は()の中に書く

    // 設定チェック　⭐️単純なチェックなら？を使った三項演算子がいい
    const testName = getSetting('テスト名');
        checks.push(testName ? `✅️テスト名: ${testName}`: '❌️テスト名が未設定');

    // 成績データチェック
    const resultSheet = SpreadsheetApp
            .getActiveSpreadsheet()
            .getSheetByName('成績データ');
    const resultCount = resultSheet
            .getLastRow() - 1;
        checks.push(`📊受験者数: ${resultCount}名`);
    
    // トリガーチェック　⭐️hasは〇〇があるか？で使われる意味
    // この場合だとトリガーの設定があるか？どうか　hasTrigger
    const triggers = ScriptApp.getProjectTriggers();
    const hasTrigger = triggers.some(t => t.getHandlerFunction() === 'onFormSubmit');
        checks.push(hasTrigger ? '✅️自動採点: 設定済み' : '❌️自動採点: 未設定');

    // フォームチェック
    const urlSheet = SpreadsheetApp
            .getActiveSpreadsheet()
            .getSheetByName('フォームURL');
    const formCount = urlSheet ? urlSheet.getLastRow() - 1 : 0;
        checks.push(`📝作成済みフォーム : ${formCount}個`);

    // ⭐️レポートにしてユーザーに見せる
    const report = `システム状態確認
            ${checks.join('\n')}
            ${questions.length >= 3 && testName && hasTrigger ? 
            '✅️システム準備完了！' : '⚠️設定を確認してください'}`;
    // ⭐️ユーザーに見える形でレポート表示
    SpreadsheetApp.getUi().alert(report);
}
function verifyCompletion(){
    // ⭐️完成判定？必要設定完了確認、運用可能状況？自動判定、表示
}

// 完成確認
/**
 * ⭐️完成確認の方法がわからなかった。問題バンクシートから問題数、設定シートからテスト名、トリガーが
 * 設定されているかのチェック　どれか1つでもFalseなら「設定が不完全です」をユーザーに伝える
 */
function verifyCompletion() {
    const questions = getAllQuestions();
    const testName = getSetting('テスト名');
    const triggers = ScriptApp
        .getProjectTriggers();
    const hasTrigger = triggers.some(t => t.getHandlerFunction() === 'onFormSubmit');
    // ⭐️isは「～であるか？」を表す真偽値用の接頭語
    const isComplete = questions.length >= 3 && testName && hasTrigger;

    const message = isComplete 
      ? `テスト管理システムが完成しました！
        主な機能:
        • 問題バンク管理
        • フォーム自動生成
        • 自動採点・通知
        • 結果分析
        • Web管理画面
        • バックアップ機能`
        : `⚠️まだ設定が不完全です。システム確認を実行してください。`;
    SpreadsheetApp.getUi().alert(message);
}

/* ⭐️最終メニュー構成整理
* 全機能　管理画面　データ確認　個別機能　システム管理　に分類配置？
* 実用レベル確認、完成
* バックアップ、監視機能完備、本格運用対応システム完成まで！！わからん！！
*/

/** 
 * ⭐️ .getDataRange().getValue()で各シートの全データ取得できる
 * ⭐️ ドライブにファイル保存はDriveApp.createFile(ファイル名，タイムスタンプなど)
 * ⭐️ データをJSON形式に変換　　JSON.stringify()
 * ⭐️ .getUi().alert(コメント,ファイル名など)でユーザーに見える形でお知らせ
 * ⭐️ has は「～があるか？」で使われる接頭語 所有/存在
 * ⭐️ is は「～であるか？」を表す真偽値用の接頭語 状態/性質
 * ⭐️ can は「～できるか？」を表す接頭語　可能/権限
*/