class PropertiesUtil {
  constructor() {}

  /*
    GASスクリプトプロパティからWebhook URLを取得
  */
  static getWebhookUrl() {
    let properties = PropertiesService.getScriptProperties();
    return properties.getProperty('SLACK_WEBHOOK_URL');
  }

  /*
    GASスクリプトプロパティから通知チャンネル名を取得
  */
  static getChannelName() {
    let properties = PropertiesService.getScriptProperties();
    return properties.getProperty('SLACK_CHANNEL_NAME');
  }

  /*
    GASスクリプトプロパティからスプレッドシートIDを取得
  */
  static getSpreadsheetId() {
    let properties = PropertiesService.getScriptProperties();
    return properties.getProperty('USER_SPREADSHEET_ID');
  }

  /*
    ユーザー一覧をスプレッドシートから取得
  */
  static getUsers() {
    let spreadsheetId = PropertiesUtil.getSpreadsheetId();
    let spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    let sheet = spreadsheet.getActiveSheet();

    // ユーザー情報を取得
    let users = sheet.getDataRange().getValues();
    users.shift();  // 先頭行は属性名なので削除

    users = users.map(function(user) {
      return new User(user[0], user[1], user[2], user[3]);
    });
    return users;
  }

}
