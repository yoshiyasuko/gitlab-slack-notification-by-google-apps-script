// Slackのwebhookにリクエストを送るテスト
// 疎通確認に使用
function test_CallSlackWebhook() {  
  let params = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({
      channel: SLACK_CHANNEL_NAME,
      text:'テストおおおおおおおおおおおおおおお',
      link_names: 1,
    })
  };
  let response = UrlFetchApp.fetch(SLACK_WEBHOOK_URL, params);
  console.log("response:", response);
  return response;
}

// コメントからSlack IDsの抽出テスト
function test_ConvertSlackUserIdsFromComment() {
  const gitlabComment = "@hoge テストコメント";
  let slackUserIds = convertSlackUserIdsFromComments_(gitlabComment)
  console.log("slackUserIds", slackUserIds);
}

// GitLabユーザー名からSlack IDへの変換テスト
function test_ConvertSlackIdFromGitLabUserName() {
  const name = 'user_name';
  let slackUserId = convertSlackUserIdFromGitLabName_(name);
  console.log("slackUserId", slackUserId);
}

// GitLab IDsからSlack Idsへの変換テスト
function test_ConvertSlackUserIdsFromGitLabUserIds() {
  const ids = ['194', '239'];
  let slackUserIds = convertSlackUserIdsFromGitLabUserIds_(ids);
  console.log("slackUserIds", slackUserIds);
}

// コメントからLGTM部分を抽出可能かテスト
function test_MatchLGTMFromComment() {
  const lgtmComment = "![LGTM](https://image.lgtmoon.dev/157861)";
  let matched = lgtmComment.match(/LGTM/g);
  console.log("matched", matched);
}