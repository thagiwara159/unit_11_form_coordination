function baseSheetCreation() {
    try{
        Object.keys(headerMap).forEach(name => {
        let sheet = ss.getSheetByName(name);

        // シートがなければ作成
        if (!sheet) {
            sheet = ss.insertSheet(name);
        }

            const header = headerMap[name];
            const range = sheet.getRange(1, 1, 1, header.length);
            range.setValues([header]);
            range.setFontWeight("bold").setBackground("#f0f0f0");
        });

  
         let settingSheet = ss.getSheetByName("設定");

        // シートがなければ作成
        if (!settingSheet) {
            settingSheet = ss.insertSheet("設定");
        }

        const settingHeader = ["キー", "値", "説明"]; // A1, A2, A3 の縦

        settingSheet.getRange(1, 1, settingHeader.length, 1)
        .setValues(settingHeader.map(v => [v]))
        .setFontWeight("bold")
        .setBackground("#f0f0f0");
    
    }catch(e){}
}

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

// メニュー追加
function onOpen() {
    SpreadsheetApp.getUi()
    .createMenu('テスト管理')
    .addItem('データ確認', 'testData')
    .addToUi();
}