const SLACK_WEBHOOK_URL = '<enter webhook url of your slack workspace>';
const SLACK_CHANNEL_NAME = '<enter target slack channel name>';

// MRのアクション名に対応する文字列表
// コメントアウトしたアクションは通知されなくなる
// see: https://docs.gitlab.com/ee/user/project/integrations/webhook_events.html#merge-request-events
const MR_ACTIONS = {
  "open": "Opened",
  "close": "Closed",
  "reopen": "Reopened",
  // "update": "Updated",
  "approved": "Approved",
  "unapproved": "Unapproved",
  "merge": "Merged",
};

// GitLabユーザー名とSlackユーザーIDの対応表
// Slack APIでメッセージを送信する場合は「@〜」でのメンションは機能せず、「<@user_id>」という形式で送信する必要がある
// see: https://api.slack.com/changelog/2017-09-the-one-about-usernames
const USER_NAME_LIST = [
  // ex: { name: '高', id: '99999', gitlab: '@gitlab-user-name', slack: '<@user_id>' }
];
