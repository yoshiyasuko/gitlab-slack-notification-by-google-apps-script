class SlackUtil {
  constructor() {}

  /*
    Slack通知メッセージの作成
  */
  static makeSlackMessage(data) {
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
                message += SlackUtil.convertSlackUserIdsFromGitLabUserIds(data.merge_request.assignee_ids);
              }
              message += `${data.user.username} LGTM on [<${data.merge_request.url}|${data.merge_request.title}>]`;
              return message;
            } else {
              // それ以外のコメントの場合は、コメント内のメンション名に従いメンションする 
              message += SlackUtil.convertSlackUserIdsFromComments(data.object_attributes.note);
              message += `${data.user.username} Commented on [<${data.merge_request.url}|${data.merge_request.title}>]`;
              return message;
            }
          // 現在はそれ以外のコメントは通知しない
          default:
            return null;
        }
    }
  }

  /*
    GitLabユーザー名の配列から、SlackユーザーIDを連結した文字列への変換
  */
  static convertSlackUserIdsFromComments(comment) {
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
      let user = PropertiesUtil.getUsers().find(function(user) {
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
  static convertSlackUserIdFromGitLabName(gitlabName) {
    let slackUserIdString = "";
    if (!gitlabName) {
      return slackUserIdString;
    }
    let user = PropertiesUtil.getUsers().find(function(user) {
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
  static convertSlackUserIdsFromGitLabUserIds(gitlabIds) {
    let slackUserIdsString = "";
    if (!gitlabIds) {
      return slackUserIdsString;
    }
    for (let i in gitlabIds) {
      let user = PropertiesUtil.getUsers().find(function(user) {
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
};
