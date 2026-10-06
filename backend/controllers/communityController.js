const crypto = require('node:crypto');
const Post = require('../models/CommunityPost');
const { communityInput, today, date } = require('../utils/communityValidation');
const hash = token => crypto.createHash('sha256').update(token).digest('hex');
const publicFields = 'kind name title details email phone location destination startDate endDate stayType budget travelMode expiresOn status createdAt';
const failure = res => res.status(500).json({ message: 'Unable to load community posts. Please try again.' });
const validId = id => typeof id === 'string' && /^[a-f\d]{24}$/i.test(id);
const literal = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
async function create(req, res) {
  let input;
  try { input = communityInput(req.body); } catch (error) { return res.status(400).json({ message: error.message }); }
  try {
    const contacts = [input.email && { email: input.email }, input.phone && { phone: input.phone }].filter(Boolean);
    const recent = await Post.countDocuments({ $or: contacts, createdAt: { $gte: new Date(Date.now() - 86400000) } });
    if (recent >= 5) return res.status(429).json({ message: 'You can publish up to five listings per day. Please try again tomorrow.' });
    const manageToken = crypto.randomBytes(32).toString('hex');
    const post = await Post.create({ ...input, status: 'active', manageTokenHash: hash(manageToken), consentAt: new Date() });
    res.status(201).json({ id: post._id, manageToken, expiresOn: post.expiresOn });
  } catch { failure(res); }
}
async function list(req, res) {
  try {
    const query = { status: 'active', expiresOn: { $gte: today() } };
    const { kind, q, from, to, stayType, travelMode } = req.query;
    if (kind && !['roommate', 'travel'].includes(kind)) return res.status(400).json({ message: 'Invalid listing type.' });
    if (kind) query.kind = kind;
    if (stayType && ['temporary', 'permanent'].includes(stayType)) query.stayType = stayType;
    if (travelMode && ['offering-ride', 'need-ride', 'travel-together'].includes(travelMode)) query.travelMode = travelMode;
    if (q) {
      if (typeof q !== 'string' || q.length > 100) return res.status(400).json({ message: 'Search must be under 100 characters.' });
      query.$or = ['title', 'location', 'destination'].map(field => ({ [field]: { $regex: literal(q.trim()), $options: 'i' } }));
    }
    try {
      if (from) query.startDate = { $gte: date(from, 'start date', true) };
      if (to) query.startDate = { ...query.startDate, $lte: date(to, 'end date', true) };
      if (from && to && from > to) throw new Error('Choose an end date on or after the start date.');
    } catch (error) { return res.status(400).json({ message: error.message }); }
    const page = Math.max(1, Math.min(1000, parseInt(req.query.page, 10) || 1));
    const items = await Post.find(query).select(publicFields).sort({ createdAt: -1, _id: -1 }).skip((page - 1) * 12).limit(13).lean();
    res.json({ items: items.slice(0, 12), hasMore: items.length > 12, page });
  } catch { failure(res); }
}
async function owner(req, res) {
  if (!validId(req.params.id) || typeof req.body.token !== 'string' || !/^[a-f\d]{64}$/.test(req.body.token)) return res.status(404).json({ message: 'This management link is invalid.' });
  try {
    const query = { _id: req.params.id, manageTokenHash: hash(req.body.token) };
    if (req.path.endsWith('/close')) {
      const post = await Post.findOneAndUpdate(query, { $set: { status: 'closed' } }, { new: true }).select(publicFields);
      if (!post) return res.status(404).json({ message: 'This management link is invalid.' });
      return res.json(post);
    }
    const post = await Post.findOne(query).select(publicFields);
    if (!post) return res.status(404).json({ message: 'This management link is invalid.' });
    res.json(post);
  } catch { failure(res); }
}
async function adminList(req, res) {
  try {
    const status = ['active', 'closed', 'hidden'].includes(req.query.status) ? req.query.status : 'active';
    const page = Math.max(1, Math.min(1000, parseInt(req.query.page, 10) || 1));
    const items = await Post.find({ status }).select(publicFields).sort({ createdAt: -1, _id: -1 }).skip((page - 1) * 12).limit(13).lean();
    res.json({ items: items.slice(0, 12), hasMore: items.length > 12, page });
  } catch { failure(res); }
}
async function moderate(req, res) {
  if (!validId(req.params.id) || !['hidden', 'active', 'closed'].includes(req.body.status)) return res.status(400).json({ message: 'Invalid moderation request.' });
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, { $set: { status: req.body.status } }, { new: true }).select(publicFields);
    if (!post) return res.status(404).json({ message: 'Listing not found.' });
    res.json(post);
  } catch { failure(res); }
}
module.exports = { create, list, owner, adminList, moderate };
