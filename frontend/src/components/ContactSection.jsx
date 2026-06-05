import { useState } from "react";
import API_BASE_URL from "../config/api";

function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.subject.trim() ||
      !form.message.trim()
    ) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      alert("Message sent successfully!");

      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      alert("Something went wrong while sending message.");
    }
  };

  return (
    <section className="py-16 md:py-24 bg-blue-950 text-white">
      <div className="max-w-6xl mx-auto px-5 md:px-6">
        <div className="text-center mb-10 md:mb-12">
          <p className="text-orange-400 font-semibold">Contact Us</p>

          <h2 className="text-3xl md:text-5xl font-bold mt-2">
            Get In Touch
          </h2>

          <p className="text-sm md:text-base text-slate-300 mt-4 max-w-3xl mx-auto">
            Have questions about IGSA, events, housing, academics, or student
            life at UF? We are here to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-10">
          <div className="grid md:grid-cols-1 gap-5">
            <div className="bg-white/10 border border-white/10 rounded-2xl p-5">
              <h3 className="font-bold text-base md:text-xl">Email</h3>
              <a
                href="mailto:igsa@gmail.com"
                className="text-sm md:text-base text-slate-300 hover:text-orange-400 transition"
              >
                igsa@gmail.com
              </a>
            </div>

            <div className="bg-white/10 border border-white/10 rounded-2xl p-5">
              <h3 className="font-bold text-base md:text-xl">Instagram</h3>
              <a
                href="https://www.instagram.com/igsa.uf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm md:text-base text-slate-300 hover:text-orange-400 transition"
              >
                @igsa.uf
              </a>
            </div>

            <div className="bg-white/10 border border-white/10 rounded-2xl p-5">
              <h3 className="font-bold text-base md:text-xl">
                WhatsApp Community
              </h3>
              <a
                href="https://chat.whatsapp.com/KJKwl1eCzvM1FrBoahgoFs?mode=gi_t"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm md:text-base text-slate-300 hover:text-orange-400 transition"
              >
                Join IGSA WhatsApp Group
              </a>
            </div>
          </div>

          <div className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-8 text-black">
            <div className="space-y-3 md:space-y-4">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full border p-3 md:p-4 rounded-xl text-sm md:text-base"
              />

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="w-full border p-3 md:p-4 rounded-xl text-sm md:text-base"
              />

              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Subject"
                className="w-full border p-3 md:p-4 rounded-xl text-sm md:text-base"
              />

              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Message"
                className="w-full border p-3 md:p-4 rounded-xl h-28 md:h-32 text-sm md:text-base"
              />

              <button
                onClick={handleSubmit}
                className="bg-orange-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold hover:bg-orange-600 text-sm md:text-base"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;