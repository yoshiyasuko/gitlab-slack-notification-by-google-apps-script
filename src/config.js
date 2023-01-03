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
