import { roleSummary } from '../config/board';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { canManageBoard, canManageGallery } from '../config/permissions';
import { contentRequest, preparePhoto } from '../utils/content';

export default function ContentEditor({ kind }) {
  const board = kind === 'board';
  const { id } = useParams();
  const navigate = useNavigate();
  const base = board ? 'board-members' : 'gallery';
  const back = `/admin/${kind}`;
  const allowed = board ? canManageBoard() : canManageGallery();
  const [value, setValue] = useState(board ? { name: '', position: '', email: '', description: '', image: '', displayOrder: 1000 } : { album: '', description: '', externalUrl: '', photos: [] });
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(!id);
  useEffect(() => {
    if (!id || !allowed) return;
    let active = true;
    contentRequest(`${base}/${id}`).then(data => {
      if (active) {
        setValue(board ? { ...data, displayOrder: data.displayOrder ?? 1000 } : { ...data, description: data.description || '', externalUrl: data.externalUrl || '', photos: data.photos?.length ? data.photos : data.image ? [data.image] : [] });
        setLoaded(true);
      }
    }).catch(err => { if (active) setError(err.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id, base, board, allowed]);
  const change = event => setValue(prev => ({ ...prev, [event.target.name]: event.target.name === "displayOrder" ? Number(event.target.value) : event.target.value }));
  async function upload(event) {
    const files = Array.from(event.target.files);
    event.target.value = '';
    if (!files.length) return;
    setError('');
    if (!board && files.length + value.photos.length > 20) { setError('Use up to 20 highlight photos. Share a Drive link for the full collection.'); return; }
    setProcessing(true);
    try {
      const photos = [];
      for (const file of files) photos.push(await preparePhoto(file, board ? 800 : 1400));
      setValue(prev => board ? { ...prev, image: photos[0] } : { ...prev, photos: [...prev.photos, ...photos] });
    } catch (err) { setError(err.message || 'Unable to read this photo. Try another file.'); }
    finally { setProcessing(false); }
  }
  async function save(event) {
    event.preventDefault();
    setError('');
    if (!board && !value.photos.length && !value.externalUrl.trim()) { setError('Add photos or a shared album link.'); return; }
    if (JSON.stringify(value).length > (board ? 2000000 : 8000000)) { setError('These photos are too large. Remove some photos and share the full album through Drive.'); return; }
    setSaving(true);
    try {
      await contentRequest(`${base}${id ? `/${id}` : ''}`, { method: id ? 'PUT' : 'POST', body: JSON.stringify(value) });
      navigate(back, { state: { message: `${board ? 'Board member' : 'Album'} saved successfully.` } });
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  }
  return <AdminLayout>
    <Link to={back} className="text-blue-800 font-semibold">← {board ? 'Board members' : 'Gallery'}</Link>
    <div className="mt-6 mb-8"><p className="text-xs uppercase tracking-widest text-orange-700 font-bold">Community / {board ? 'People' : 'Memories'}</p>
      <h1 className="text-3xl md:text-4xl font-bold text-blue-950 mt-2">{id ? 'Edit' : 'Add'} {board ? 'board member' : 'gallery album'}</h1>
      <p className="text-slate-600 mt-3">{board ? 'Introduce the people behind IGSA. Changes appear on the public board page.' : 'Share a few highlights here and link the full collection from Google Drive or Google Photos.'}</p></div>
    {!allowed ? <p role="alert" className="notice">Your board role does not have permission to manage this content.</p> : <>
      {error && <p role="alert" className="notice notice-error mb-6">{error}</p>}
      {loading ? <p role="status">Loading content…</p> : loaded && <form onSubmit={save} className="grid xl:grid-cols-[minmax(0,1fr)_320px] gap-6 max-w-6xl">
        <fieldset disabled={saving || processing} className="min-w-0 bg-white border border-slate-200 rounded-3xl p-5 md:p-8 space-y-6">
          <h2 className="text-xl font-bold text-blue-950">{board ? 'Profile details' : 'Album details'}</h2>
          <label className="field-label">{board ? 'Full name' : 'Album name'} <span className="text-orange-700">*</span>
            <input name={board ? 'name' : 'album'} value={board ? value.name : value.album} onChange={change} required maxLength={board ? 120 : 160} placeholder={board ? 'Full name' : 'Diwali Night 2026'} className="field-input" /></label>
          {board && <><label className="field-label">Position <span className="text-orange-700">*</span><input name="position" value={value.position} onChange={change} required maxLength={120} list="board-positions" className="field-input" placeholder="Choose or type a position" /></label>
            <datalist id="board-positions">{['President','Vice President','Treasurer','Executive Secretary','IT Director','Event Director','Event Manager','PR Director','Marketing Manager','Social Media Manager','Creative Director','Board Member'].map(role => <option key={role}>{role}</option>)}</datalist>
            <label className="field-label">Public contact email <input type="email" name="email" value={value.email} onChange={change} maxLength={254} className="field-input" placeholder="Optional" /><span className="field-help">This email will be visible to website visitors.</span></label></>}
          {board && <label className="field-label">Display order<input type="number" name="displayOrder" min="0" max="10000" step="1" required value={value.displayOrder} onChange={change} className="field-input" /><span className="field-help">Lower numbers appear first on the board page and homepage. Use 10, 20, 30… to leave room between members.</span></label>}
          {board && <button type="button" className="text-sm font-semibold text-blue-800 underline" onClick={() => setValue(prev => ({ ...prev, description: roleSummary(prev.position) }))}>Use a concise role description</button>}
          <label className="field-label">{board ? 'Short bio / responsibilities' : 'Description'}<textarea name="description" value={value.description} onChange={change} maxLength={2000} rows={4} className="field-input" placeholder={board ? 'How does this member support the community?' : 'Tell the story behind this event.'} /></label>
          {!board && <div className="rounded-2xl bg-blue-50 border border-blue-100 p-5"><label className="field-label">Full album link<input type="url" name="externalUrl" value={value.externalUrl} onChange={change} maxLength={2048} pattern="https://.*" placeholder="https://drive.google.com/drive/folders/…" className="field-input bg-white" /></label><p className="field-help">Upload the full collection to Drive or Google Photos, enable viewing for anyone with the link, then paste the shared link here. Check it in a signed-out browser before publishing. A link-only album needs no photo storage on this site.</p></div>}
          <div><label className="field-label">{board ? 'Profile photo' : 'Highlight photos'}<input type="file" accept="image/jpeg,image/png,image/webp" multiple={!board} onChange={upload} className="field-input file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-blue-900" /></label><p className="field-help">JPG, PNG or WebP · up to 15 MB per file. Photos are resized automatically.{!board && ' Up to 20 highlights; the first photo is the cover.'}</p></div>
          {processing && <p role="status" className="text-blue-800">Preparing photos…</p>}
          {board && value.image && <button type="button" onClick={() => setValue(prev => ({ ...prev, image: '' }))} className="text-red-700 font-semibold">Remove profile photo</button>}
          {!board && <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{value.photos.map((photo, index) => <div key={index} className="border border-slate-200 rounded-xl overflow-hidden"><img src={photo} alt={`Highlight ${index + 1}`} className="h-32 w-full object-cover" /><div className="flex flex-wrap gap-2 p-2 text-xs"><button type="button" onClick={() => setValue(prev => ({ ...prev, photos: [photo, ...prev.photos.filter((_, i) => i !== index)] }))} className="text-blue-800 font-bold">{index === 0 ? 'Cover photo' : 'Make cover'}</button><button type="button" aria-label={`Remove photo ${index + 1}`} onClick={() => setValue(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }))} className="text-red-700">Remove</button></div></div>)}</div>}
          <div className="border-t border-slate-200 pt-6 flex items-center gap-5"><button type="submit" className="bg-blue-950 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50">{saving ? 'Saving…' : `Save ${board ? 'member' : 'album'}`}</button><Link to={back} className="text-slate-600">Cancel</Link></div>
        </fieldset>
        <aside className="space-y-5"><div className="bg-white border border-slate-200 rounded-3xl overflow-hidden"><div className="bg-blue-950 text-white px-6 py-4 text-sm font-semibold">Public preview</div><div className="p-6 text-center">
          {(board ? value.image : value.photos[0]) ? <img src={board ? value.image : value.photos[0]} alt="Content preview" className={board ? 'w-28 h-28 object-cover rounded-full mx-auto mb-5' : 'w-full h-44 object-cover rounded-xl mb-5'} /> : <div className="bg-blue-50 text-blue-800 rounded-2xl p-8 mb-5 text-3xl">{board ? (value.name || 'IGSA').split(' ').map(word => word[0]).slice(0, 2).join('') : 'IGSA Memories'}</div>}
          <h2 className="font-bold text-xl text-blue-950 break-words">{(board ? value.name : value.album) || (board ? 'Member name' : 'Album title')}</h2>
          <p className="text-orange-700 text-sm mt-2">{board ? value.position || 'Board position' : value.externalUrl ? 'Full collection linked' : `${value.photos.length} highlights`}</p><p className="text-sm text-slate-600 mt-3 break-words whitespace-pre-line">{value.description}</p></div></div>
          <p className="text-sm text-slate-500 px-2">{board ? 'A public profile does not create a dashboard login. Manage login access separately under Admin Users.' : 'Share photos you have permission to publish. Use a dedicated event folder so unrelated files stay private.'}</p></aside>
      </form>}
    </>}
  </AdminLayout>;
}
