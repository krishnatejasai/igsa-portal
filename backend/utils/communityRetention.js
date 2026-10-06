const Post = require('../models/CommunityPost');
const { fiveMonthsAfter } = require('./communityValidation');
// One-time, resumable migration: extend existing posts without reopening closed/hidden ones.
module.exports = async function extendCommunityRetention() {
  const cursor = Post.find({ retentionVersion: { $ne: 2 } }).select('_id createdAt').lean().cursor();
  for await (const item of cursor) {
    const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(item.createdAt);
    await Post.updateOne({ _id: item._id, retentionVersion: { $ne: 2 } }, { $set: { expiresOn: fiveMonthsAfter(day), retentionVersion: 2 } }, { timestamps: false });
  }
};
