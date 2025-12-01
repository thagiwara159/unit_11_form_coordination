function analyzeResults() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('成績データ');
    const data = sheet.getDataRange().getValues();

    if (data.length <= 1) {
        SpreadsheetApp.getUi().alert('まだ受験データがありません。');
        return;
    }

    // 統計計算
    const results = data.slice(1); // ヘッダー除く
    const scores = results.map(row => row[2]);
    const totalStudents = results.length;
    const passedStudents = results.filter(row => row[5] === '合格').length;
    const stats = {
        totalStudents: totalStudents,
        averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / totalStudents),
        maxScore: Math.max(...scores), //配列を展開する
        minScore: Math.min(...scores),
        passRate: Math.round((passedStudents / totalStudents) * 100)
    };

    return stats;
}

// 問題別分析
function analyzeQuestions() {
    const questions = getAllQuestions();
    const responseSheet = getResponseSheet();
    if (!responseSheet) return;
    const data = responseSheet.getDataRange().getValues();
    const analysis = [];
    questions.forEach((question, index) => {
        let correctCount = 0;
        let totalCount = 0;
        for (let i = 1; i < data.length; i++) {
            // 名前・メールの後から問題開始
            const answer = data[i][index + 3];
            if (answer) {
                totalCount++;
                    if (answer === question.correct) {
                        correctCount++;
                    }
                }
        }
        const correctRate = totalCount > 0 ?
        Math.round((correctCount / totalCount) * 100) : 0;

        analysis.push({
            questionNumber: index + 1,
            correctRate: correctRate,
            difficulty:
            correctRate >= 80 ? '易しい' :
            correctRate >= 50 ? '普通' : '難しい'
        });
    });

    return analysis;
}

// 回答シート取得
function getResponseSheet() {
    const sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
    for (let sheet of sheets) {
        if (sheet.getName().includes('フォームの回答')){
            return sheet;
        }
    }
    return null;
}

// 分析レポート生成
function generateReport() {
    const stats = analyzeResults();
    if (!stats) return;

    const questionAnalysis = analyzeQuestions();
    const testName = getSetting('テスト名');

    let report = `【${testName} 分析レポート】
        ■ 全体統計
            受験者数: ${stats.totalStudents}名
            平均点: ${stats.averageScore}点
            最高点: ${stats.maxScore}点
            最低点: ${stats.minScore}点
            合格率: ${stats.passRate}%
        ■ 問題別分析 `;
        questionAnalysis.forEach(q => {
                report += `問題${q.questionNumber}: 正答率
                ${q.correctRate}% (${q.difficulty})\n`;
        });

    // 管理者にメール送信
    const adminEmail = Session.getActiveUser().getEmail();
    GmailApp.sendEmail(
        adminEmail, `【分析レポート】 ${testName}`, report
    );

    SpreadsheetApp.getUi().alert('分析レポートを送信しました！');
 }