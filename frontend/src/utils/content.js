import API_BASE_URL from '../config/api';

export async function contentRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}/api/${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('igsaAdminToken')}`, ...options.headers },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || `Request failed (${response.status}). Please try again.`);
  return data;
}

export async function preparePhoto(file, maxDimension = 1400) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Choose JPG, PNG, or WebP images.');
  if (file.size > 15 * 1024 * 1024) throw new Error(`${file.name} exceeds 15 MB. Choose a smaller image.`);
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(image.width * scale);
    canvas.height = Math.round(image.height * scale);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.78);
  } finally { URL.revokeObjectURL(url); }
}
