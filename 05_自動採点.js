// フォーム送信時の自動採点
function onFormSubmit(e) {
    const answers = e.values;
    const timestamp = answers[0];
    const name = answers[1];
    const email = answers[2];
    const responses = answers.slice(3); // 問題の回答部分

    // 採点実行
    const result = scoreTest(responses, name, email);

    // 結果メール送信
    sendResultEmail(result);

    // 成績記録
    recordResult(result);
}

// 採点処理
function scoreTest(responses, name, email) {
    const questions = getAllQuestions();
    let score = 0;
    let maxScore = 0;
    questions.forEach((question, index) => {
        maxScore += question.points;// 各問題の配点を加算
        if (responses[index] === question.correct) {
            score += question.points; // 正解なら得点加算
        }
    });
    const percentage =Math.round((score / maxScore) * 100);
    const passingScore = getSetting('合格点');
    const passed = percentage >= passingScore; // 合格判定
    return {
        name: name,
        email: email,
        score: score,
        maxScore: maxScore,
        percentage: percentage,
        passed: passed
    };
 }

// 結果メール送信
function sendResultEmail(result) {
    const subject = `【テスト結果】${getSetting('テスト名')}`;
    const body = `
        ${result.name} 様
        テスト結果をお知らせします。
        得点: ${result.score}点 / ${result.maxScore}点
        正答率: ${result.percentage}%
        判定: ${result.passed ? '合格' : '不合格'}
        お疲れ様でした。
        `;

    GmailApp.sendEmail(result.email, subject, body);
}

// 成績記録
function recordResult(result) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('成績データ');
    sheet.appendRow([
        result.name,
        result.email,
        result.score,
        result.maxScore,
        new Date(),
        result.passed ? '合格' : '不合格'
    ]);
}

// トリガー設定
function setupTrigger() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    ScriptApp.newTrigger('onFormSubmit')
        .forSpreadsheet(ss)
        .onFormSubmit()
        .create();
    SpreadsheetApp.getUi().alert('自動採点を設定しました！');
}
