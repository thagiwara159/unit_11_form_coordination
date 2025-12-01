
// メニュー追加
function onOpen() {
    SpreadsheetApp.getUi()
    .createMenu('テスト管理')
    .addItem('データ確認', 'testData')
    .addItem('フォーム作成','createTestForm')
    .addItem('自動採点設定','setupTrigger')
    .addToUi();
}