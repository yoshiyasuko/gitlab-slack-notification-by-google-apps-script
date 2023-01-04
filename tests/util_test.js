// Slackのwebhookにリクエストを送るテスト
// 疎通確認に使用
function test_CallSlackWebhook() {  
  let params = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({
      channel: getChannelName_(),
      text:'テストおおおおおおおおおおおおおおお',
      link_names: 1,
    })
  };
  let response = UrlFetchApp.fetch(getWebhookUrl_(), params);
  console.log("response:", response);
  return response;
}
