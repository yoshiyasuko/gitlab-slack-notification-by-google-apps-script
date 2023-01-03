/*
  GASスクリプトプロパティからWebhook URLを取得
*/
function getWebhookUrl_() {
  let properties = PropertiesService.getScriptProperties();
  return properties.getProperty('SLACK_WEBHOOK_URL');
}

/*
  GASスクリプトプロパティから通知チャンネル名を取得
*/
function getChannelName_() {
  let properties = PropertiesService.getScriptProperties();
  return properties.getProperty('SLACK_CHANNEL_NAME');
}

/*
  GASスクリプトプロパティからスプレッドシートIDを取得
*/
function getSpreadsheetId_() {
  let properties = PropertiesService.getScriptProperties();
  return properties.getProperty('USER_SPREADSHEET_ID');
}

/*
  ユーザー一覧をスプレッドシートから取得
*/
function getUsers_() {
  let spreadsheetId = getSpreadsheetId_();
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

/*
  GitLabユーザー名の配列から、SlackユーザーIDを連結した文字列への変換
*/
function convertSlackUserIdsFromComments_(comment) {
  let slackUserIdsString = "";
  if (!comment) {
    return slackUserIdsString;
  }
  // コメント内にあるGitLabユーザー名メンションの取得
  let gitlabMentionNames = comment.match(/@[a-zA-Z0-9_.\-]+/g);
  if (!gitlabMentionNames) {
    return slackUserIdsString;
  }
  gitlabMentionNames = gitlabMentionNames.map(name => name.replace('@', ''));
  for (let i in gitlabMentionNames) {
    let user = getUsers_().find(function(user) {
      return user.gitlabName == gitlabMentionNames[i];
    })
    if (!user) { 
      continue;
    }
    // メンションとして機能するように半角スペースを後ろに空ける
    slackUserIdsString += `<@${user.slackUserId}> `;
  }
  return slackUserIdsString;
}

/*
  GitLabユーザー名から、SlackユーザーID文字列への変換
*/
function convertSlackUserIdFromGitLabName_(gitlabName) {
  let slackUserIdString = "";
  if (!gitlabName) {
    return slackUserIdString;
  }
  let user = getUsers_().find(function(user) {
    return user.gitlabName == gitlabName;
  });
  if (!user) {
    return slackUserIdString;
  }
  // メンションとして機能するように半角スペースを後ろに空ける
  slackUserIdString += `<@${user.slackUserId}> `;
  return slackUserIdString;
}

/*
  GitLabユーザーIDの配列から、SlackユーザーIDを連結した文字列への変換
*/
function convertSlackUserIdsFromGitLabUserIds_(gitlabIds) {
  let slackUserIdsString = "";
  if (!gitlabIds) {
    return slackUserIdsString;
  }
  for (let i in gitlabIds) {
    let user = getUsers_().find(function(user) {
      return user.gitlabId == gitlabIds[i];
    })
    if (!user) {
      continue;
    }
    // メンションとして機能するように半角スペースを後ろに空ける
    slackUserIdsString += `<@${user.slackUserId}> `;
  }
  return slackUserIdsString;
}
