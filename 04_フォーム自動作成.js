// フォーム作成メイン関数
function createTestForm() {
    const questions = getAllQuestions();
    const testName = getSetting('テスト名');

    // フォームを作成
    const form = FormApp.create(testName);

    // 受験者情報
    form.addTextItem().setTitle('お名前').setRequired(true);
    form.addTextItem().setTitle('メールアドレス').setRequired(true);
    
    // 問題を追加
    questions.forEach((question, index) => {
        const item = form.addMultipleChoiceItem();
            item.setTitle(`問題${index + 1}:
            ${question.text}`);
            item.setRequired(true);

        const choices = question.choices.map(choice =>
            item.createChoice(choice)
        );
            item.setChoices(choices);
    });
    
    // 回答先をこのスプレッドシートに設定
    form.setDestination(
        FormApp.DestinationType.SPREADSHEET,
        SpreadsheetApp.getActiveSpreadsheet().getId()
    );
    
    // URL保存
    saveFormUrl(form.getId(), form.getPublishedUrl());

    // 結果表示
    SpreadsheetApp.getUi().alert(
    `フォーム作成完了！ \n\n配信用
    URL:\n${form.getPublishedUrl()}`
    );
}

// フォームURL保存
function saveFormUrl(formId, url) {
    let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('フォームURL');
    if (!sheet) {
        sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('フォームURL');
        sheet.getRange(1, 1, 1, 3).setValues([['作成日','フォームID', 'URL']]);
    }

    sheet.appendRow([new Date(), formId, url]);
}
