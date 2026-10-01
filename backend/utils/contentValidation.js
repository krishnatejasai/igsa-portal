const httpsUrl = (value) => {
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password; }
  catch { return false; }
};
const imageValue = (value) => typeof value === 'string' && (value === '' || httpsUrl(value) || /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(value));
const text = (value, max, required = false) => typeof value === 'string' && value.length <= max && (!required || value.trim().length > 0);
function boardInput(body) {
  const { name, position, email = '', description = '', image = '', displayOrder = 1000 } = body;
  if (!text(name, 120, true) || !text(position, 120, true) || !text(description, 2000) || !text(email, 254) || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) || !imageValue(image)) throw new Error('Enter a name, position, valid email, and a JPG, PNG, WebP or HTTPS photo.');
  if (!Number.isInteger(displayOrder) || displayOrder < 0 || displayOrder > 10000) throw new Error('Display order must be a whole number between 0 and 10000.');
  if (image.length > 2000000) throw new Error('Profile photo is too large. Upload a smaller image.');
  return { name: name.trim(), position: position.trim(), email: email.trim(), description: description.trim(), image, displayOrder };
}
function galleryInput(body) {
  const { album, description = '', externalUrl = '', photos = [] } = body;
  if (!text(album, 160, true) || !text(description, 2000)) throw new Error('Enter an album name (up to 160 characters) and a description up to 2,000 characters.');
  if (!text(externalUrl, 2048) || (externalUrl && !httpsUrl(externalUrl))) throw new Error('Use a valid HTTPS album link.');
  if (!Array.isArray(photos) || photos.length > 20 || photos.some(photo => !photo || !imageValue(photo))) throw new Error('Select up to 20 JPG, PNG, or WebP photos.');
  if (!photos.length && !externalUrl) throw new Error('Add photos or a shared album link.');
  if (photos.reduce((sum, photo) => sum + photo.length, 0) > 8000000) throw new Error('Album is too large. Use fewer photos or share a Drive album.');
  return { album: album.trim(), description: description.trim(), externalUrl: externalUrl.trim(), photos };
}
module.exports = { boardInput, galleryInput };
