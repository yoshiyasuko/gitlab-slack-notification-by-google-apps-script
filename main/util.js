const _ = Underscore.load();

/*
  GASスクリプトプロパティからWebhook URLを取得
*/
function getWebhookUrl_() {
  const properties = PropertiesService.getScriptProperties();
  return properties.getProperty('SLACK_WEBHOOK_URL');
}

/*
  GASスクリプトプロパティから通知チャンネル名を取得
*/
function getChannelName_() {
  const properties = PropertiesService.getScriptProperties();
  return properties.getProperty('SLACK_CHANNEL_NAME');
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
  for (let i in gitlabMentionNames) {
    let user = _.find(USER_NAME_LIST, function(user) {
      return user.gitlab == gitlabMentionNames[i];
    })
    if (!user) { 
      continue;
    }
    // Slack IDがある場合はそちらを優先する
    let slackName = user.slackId || user.slack;
    // メンションとして機能するように半角スペースを後ろに空ける
    slackUserIdsString += `${slackName} `;
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
  let user = _.find(USER_NAME_LIST, function(user) {
    return user.gitlab == `@${gitlabName}`;
  });
  if (!user) {
    return slackUserIdString;
  }
  // Slack IDがある場合はそちらを優先する
  let slackName = user.slackId || user.slack;
  // メンションとして機能するように半角スペースを後ろに空ける
  slackUserIdString += `${slackName} `;
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
    let user = _.find(USER_NAME_LIST, function(user) {
      return user.id == gitlabIds[i];
    })
    if (!user) {
      continue;
    }
    // Slack IDがある場合はそちらを優先する
    let slackName = user.slackId || user.slack;
    // メンションとして機能するように半角スペースを後ろに空ける
    slackUserIdsString += `${slackName} `;
  }
  return slackUserIdsString;
}
