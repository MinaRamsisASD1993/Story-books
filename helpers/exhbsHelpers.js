const dateFormat = require("dateformat");

module.exports = {
  stripTags: function(strInputCode) {
    const cleanText = strInputCode.replace(/<\/?[^>]+(>|$)/g, "");
    return cleanText;
  },
  truncateString: function(strInputCode) {
    const len = 80;
    const truncatedStr = strInputCode.substring(0, len);
    return truncatedStr + "...";
  },
  formatDate: function(inputDate) {
    const output = dateFormat(inputDate, "dddd, mmmm dS, yyyy, h:MM:ss TT");
    return output;
  },
  select: function(selected, options) {
    return options
      .fn(this)
      .replace(new RegExp(' value="' + selected + '"'), "$& selected");
  },
  compare: function(userId1, userId2, storyId) {
    if (userId1 == userId2) {
      return `<div class="card-image">
      <a href="/stories/edit/${storyId}" class="btn-floating halfway-fab waves-effect waves-light red"><i
              class="fa fa-edit"></i></a>
  </div>`;
    } else {
      return "";
    }
  }
};
