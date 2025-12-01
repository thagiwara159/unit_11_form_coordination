// ダッシュボード表示
function showDashboard() {
    const html =
        HtmlService.createTemplateFromFile('Dashboard')
            .evaluate()
            .setWidth(800)
            .setHeight(600);

    SpreadsheetApp.getUi().showModalDialog(html, 'テスト管理システム');
}

// 統計データ取得（ Web用）
function getStats() {
    return analyzeResults();
}