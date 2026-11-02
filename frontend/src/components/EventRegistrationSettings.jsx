export default function EventRegistrationSettings({ event, onChange }) {
  const fields = event.registrationFields || { phone: 'required', ufid: 'required', program: 'required' };
  const question = event.slotQuestion || { enabled: false, label: 'Which shuttle time slot would you like to book?', options: [] };
  const update = patch => onChange({ ...event, slotQuestion: { ...question, ...patch } });
  return <section className="border border-orange-200 rounded-2xl p-5 space-y-5">
    <h2 className="text-xl font-bold text-blue-950">Registration form settings</h2>
    <p className="text-sm text-slate-600">Name and email are always required. Choose which other details to collect.</p>
    <div className="grid sm:grid-cols-3 gap-4">{[['phone', 'Phone number'], ['ufid', 'UFID'], ['program', 'Program / major']].map(([key, label]) => <label key={key} className="font-semibold text-blue-950">{label}<select className="w-full mt-2 border p-3 rounded-xl" value={fields[key] || 'required'} onChange={e => onChange({ ...event, registrationFields: { ...fields, [key]: e.target.value } })}><option value="required">Required</option><option value="optional">Optional</option><option value="hidden">Do not ask</option></select></label>)}</div>
    <label className="flex items-center gap-3 font-semibold text-blue-950"><input type="checkbox" checked={question.enabled} onChange={e => update({ enabled: e.target.checked })} />Add a dropdown question with limited-capacity time slots</label>
    {question.enabled && <>
      <label className="block font-semibold text-blue-950">Question<input className="w-full mt-2 border p-3 rounded-xl" maxLength={200} value={question.label} placeholder="Which shuttle time slot would you like to book?" onChange={e => update({ label: e.target.value })} /></label>
      <p className="text-sm text-slate-600">Each student selects one slot. Full slots stay visible but cannot be booked. The overall event capacity also applies. Booked slots cannot be removed or reduced below their booking count.</p>
      {question.options.map((slot, index) => <div key={slot.id} className="grid sm:grid-cols-[1fr_120px_auto] gap-3 items-end">
        <label className="font-semibold text-blue-950">Slot {index + 1}<input className="w-full mt-2 border p-3 rounded-xl" maxLength={150} value={slot.label} placeholder="5:00 PM — Campus to venue" onChange={e => update({ options: question.options.map(item => item.id === slot.id ? { ...item, label: e.target.value } : item) })} /></label>
        <label className="font-semibold text-blue-950">Capacity<input type="number" min="1" max="100000" step="1" className="w-full mt-2 border p-3 rounded-xl" value={slot.capacity} onChange={e => update({ options: question.options.map(item => item.id === slot.id ? { ...item, capacity: e.target.value } : item) })} /></label>
        <button type="button" disabled={slot.booked > 0} className="p-3 text-red-700 disabled:opacity-40" onClick={() => update({ options: question.options.filter(item => item.id !== slot.id) })}>Remove</button>
        {slot.booked > 0 && <p className="text-sm text-slate-600 sm:col-span-3">{slot.booked} booked</p>}
      </div>)}
      <button type="button" disabled={question.options.length >= 50} className="border border-orange-500 text-orange-700 px-4 py-2 rounded-xl font-semibold" onClick={() => update({ options: [...question.options, { id: crypto.randomUUID(), label: '', capacity: 30 }] })}>+ Add time slot</button>
    </>}
  </section>;
}
