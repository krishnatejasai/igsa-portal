const contacts = [
  { title: 'Email', label: 'igsa.uf@gmail.com', href: 'mailto:igsa.uf@gmail.com', color: 'border-orange-400' },
  { title: 'Instagram', label: '@igsa.uf', href: 'https://www.instagram.com/igsa.uf', color: 'border-blue-300' },
  { title: 'WhatsApp Community', label: 'Join our community', href: 'https://chat.whatsapp.com/KJKwl1eCzvM1FrBoahgoFs?mode=gi_t', color: 'border-green-400' },
];

export default function ContactSection() {
  return <section className="py-16 md:py-24 bg-[#004baf] text-white">
    <div className="max-w-6xl mx-auto px-5 md:px-6">
      <div className="mb-10"><h2 className="text-3xl md:text-5xl font-bold">Get in touch</h2><p className="text-blue-100 mt-4">Connect with IGSA at UF.</p></div>
      <div className="grid md:grid-cols-3 gap-5">
        {contacts.map(({ title, label, href, color }) => <a key={title} href={href} {...(href.startsWith('https:') ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className={`block rounded-2xl border-t-4 ${color} bg-white/10 p-6 transition hover:bg-white/20 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white`}>
          <h3 className="text-lg font-bold mb-3">{title}</h3><span className="text-sm break-words">{label} <span aria-hidden="true">↗</span></span>
        </a>)}
      </div>
    </div>
  </section>;
}
