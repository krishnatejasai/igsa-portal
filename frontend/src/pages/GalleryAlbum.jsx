import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { contentRequest } from '../utils/content';

export default function GalleryAlbum() {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [selected, setSelected] = useState(0);
  const dialog = useRef(null);
  useEffect(() => {
    let active = true;
    contentRequest(`gallery/${id}`).then(data => { if (active) setAlbum(data); }).catch(err => { if (active) setError(err.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id, retry]);
  const photos = album?.photos?.length ? album.photos : album?.image ? [album.image] : [];
  function show(index) { setSelected(index); dialog.current.showModal(); }
  return <main className="pt-32 pb-20 min-h-screen bg-slate-100"><div className="max-w-7xl mx-auto px-5 md:px-6">
    <Link to="/gallery" className="text-blue-800 font-semibold">← All albums</Link>
    {loading ? <p role="status" className="mt-10">Loading album…</p> : error ? <div role="alert" className="notice notice-error mt-10">{error}<button onClick={() => { setError(''); setLoading(true); setRetry(prev => prev + 1); }} className="ml-3 underline">Retry</button></div> : album && <>
      <header className="my-10"><p className="text-orange-700 text-xs uppercase tracking-widest font-bold mb-3">IGSA / Community memories</p><h1 className="text-3xl md:text-5xl font-bold text-blue-950">{album.album}</h1>{album.description && <p className="text-slate-600 mt-5 max-w-3xl whitespace-pre-line">{album.description}</p>}<p className="text-slate-500 mt-4">{photos.length ? `${photos.length} highlights · Select a photo to view it.` : 'Explore the full photo collection below.'}</p></header>
      {album.externalUrl && /^https:\/\//i.test(album.externalUrl) && <div className="bg-blue-950 text-white p-6 md:p-8 rounded-3xl mb-8 flex flex-wrap justify-between items-center gap-5"><div><h2 className="text-xl font-bold">The full collection</h2><p className="text-blue-200 mt-2">View all photos in the shared external album.</p></div><a href={album.externalUrl} target="_blank" rel="noopener noreferrer" className="bg-white text-blue-950 px-5 py-3 rounded-xl font-bold">Open full album ↗</a></div>}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">{photos.map((photo, index) => <button key={index} onClick={() => show(index)} className="group aspect-[4/3] overflow-hidden rounded-2xl bg-slate-200" aria-label={`View ${album.album} photo ${index + 1}`}><img src={photo} alt={`${album.album} — photo ${index + 1}`} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition" /></button>)}</div>
    </>}
    <dialog ref={dialog} aria-label="Photo viewer" className="m-auto max-w-[95vw] max-h-[95vh] rounded-2xl bg-slate-950 text-white p-4 backdrop:bg-black/80" onClick={event => { if (event.target === event.currentTarget) dialog.current.close(); }}>
      <div className="flex items-center justify-between gap-8 mb-3"><p>Photo {selected + 1} of {photos.length}</p><button onClick={() => dialog.current.close()} className="rounded-lg px-4 py-2 bg-white/15" autoFocus>Close ×</button></div>
      {photos[selected] && <img src={photos[selected]} alt={`${album?.album} — photo ${selected + 1}`} className="max-h-[70vh] max-w-full mx-auto object-contain" />}
      <div className="flex items-center justify-between gap-5 mt-4"><button disabled={selected === 0} onClick={() => setSelected(prev => prev - 1)} className="disabled:opacity-30 px-3 py-2">← Previous</button><a href={photos[selected]} download={`${album?.album || 'IGSA'}-photo-${selected + 1}.jpg`} target="_blank" rel="noopener noreferrer" className="underline">Download / open</a><button disabled={selected >= photos.length - 1} onClick={() => setSelected(prev => prev + 1)} className="disabled:opacity-30 px-3 py-2">Next →</button></div>
    </dialog>
  </div></main>;
}
