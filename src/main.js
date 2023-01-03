// イベントがフックされると、この関数がコールバックされる
function doPost(e) {
  let data = JSON.parse(e.postData.getDataAsString());
  console.log("data", data);  // 送られてきたデータはログを残す

  // 通知メッセージを作成
  let message = makeSlackMessage_(data);
  if (!message) {
    return;
  }
  // Slackに通知を行う
  let params = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({
      channel: getChannelName_(),
      text: message,
      link_names: 1,
    })
  };
  let response = UrlFetchApp.fetch(getWebhookUrl_(), params);
  console.log("response", response);
  return response;
}
