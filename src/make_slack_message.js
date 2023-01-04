function makeSlackMessage_(data) {
  // イベントではないpostに対しては通知しない
  if (!data.event_type) {
    return null;
  }
  let message = "";

  switch (data.event_type) {
    // MRイベント
    case "merge_request":
      // こちらが準備しているアクションリストに存在しないアクションは通知を行わない
      if (!MR_ACTIONS[data.object_attributes.action]) {
        return null;
      }
      message += `${data.user.username} Merge Request ${MR_ACTIONS[data.object_attributes.action]} `;
      message += `[<${data.object_attributes.url}|${data.object_attributes.title}>]`;
      return message;
    // コメントイベント
    case "note":
      switch (data.object_attributes.noteable_type) {
        // MRへのコメント
        case "MergeRequest":
          if (data.object_attributes.note.match(/LGTM/g)) {
            // LGTMコメントの場合、MR担当者にLGTMメンションを行う
            if (data.merge_request.assignee_ids) {
              message += convertSlackUserIdsFromGitLabUserIds_(data.merge_request.assignee_ids);
            }
            message += `${data.user.username} LGTM on [<${data.merge_request.url}|${data.merge_request.title}>]`;
            return message;
          } else {
            // それ以外のコメントの場合は、コメント内のメンション名に従いメンションする 
            message += convertSlackUserIdsFromComments_(data.object_attributes.note);
            message += `${data.user.username} Commented on [<${data.merge_request.url}|${data.merge_request.title}>]`;
            return message;
          }
        // 現在はそれ以外のコメントは通知しない
        default:
          return null;
      }
  }

}
