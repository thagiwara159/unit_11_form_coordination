function baseSheetCreation() {
    try{
        // スプレッドシートの取得
        const ss = SpreadsheetApp.getActiveSpreadsheet();

        // 各シートの作成、シートごとのヘッダー設定
        const headerMap = {
        "問題バンク": ["問題ID", "問題文", "選択肢", "正答", "配点"],
        "成績データ": ["受験者名", "メール", "得点", "満点","受験日","合否"]
        };

        // シートの作成とオブジェクト配置
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

        // 設定シートの作成
        let settingSheet = ss.getSheetByName("設定");

        // シートがなければ作成
        if (!settingSheet) {
            settingSheet = ss.insertSheet("設定");
        }
        const settingHeader = ["項目", "テスト名", "合格点"]; // A1, A2, A3 の縦
        settingSheet.getRange(1, 1, settingHeader.length, 1)
        .setValues(settingHeader.map(v => [v]))
        .setFontWeight("bold")
        .setBackground("#f0f0f0");
    
    }catch(e){}
}
