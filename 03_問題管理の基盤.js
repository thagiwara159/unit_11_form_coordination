// 問題データを取得する関数
function getAllQuestions() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('問題バンク');
    const data = sheet.getDataRange().getValues();

    const questions = [];
    for (let i = 1; i < data.length; i++) {
        if (data[i][0]) { // 問題IDがある行のみ
            questions.push({
                id: data[i][0],
                text: data[i][1],
                choices: data[i][2].split('|'),
                correct: data[i][3],
                points: data[i][4]
            });
        }
    }

    return questions;
}

// 設定値を取得する関数
function getSetting(key) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('設定');
    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
        if (data[i][0] === key) {
        return data[i][1];
        }
    }
    return null;
}

// 簡単な動作確認
function testData() {
    const questions = getAllQuestions();
    const testName = getSetting('テスト名');

    const message =
        `${testName}
        問題数: ${questions.length}問
        総配点: ${questions.reduce((sum, q) => sum + q.points,0)}点`;

    SpreadsheetApp.getUi().alert(message);
}