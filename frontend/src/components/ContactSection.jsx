import { useState } from "react";

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

  const handleSubmit = () => {
    const savedMessages =
      JSON.parse(localStorage.getItem("igsaMessages")) || [];

    const newMessage = {
      id: Date.now(),
      ...form,
      date: new Date().toLocaleDateString(),
    };

    savedMessages.push(newMessage);

    localStorage.setItem(
      "igsaMessages",
      JSON.stringify(savedMessages)
    );

    alert("Message sent successfully!");

    setForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <section className="py-24 bg-blue-950 text-white">
      <div className="max-w-6xl mx-auto px-6">

        <div className="text-center mb-12">
          <p className="text-orange-400 font-semibold">
            Contact Us
          </p>

          <h2 className="text-5xl font-bold mt-2">
            Get In Touch
          </h2>

          <p className="text-slate-300 mt-4">
            Have questions about IGSA, events, housing, academics,
            or student life at UF? We are here to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">

          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-xl">Email</h3>
              <p className="text-slate-300">igsa@ufl.edu</p>
            </div>

            <div>
              <h3 className="font-bold text-xl">Location</h3>
              <p className="text-slate-300">Gainesville, Florida</p>
            </div>

            <div>
              <h3 className="font-bold text-xl">Instagram</h3>
              <p className="text-slate-300">@igsa.uf</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 text-black">
            <div className="space-y-4">

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full border p-4 rounded-xl"
              />

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="w-full border p-4 rounded-xl"
              />

              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Subject"
                className="w-full border p-4 rounded-xl"
              />

              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Message"
                className="w-full border p-4 rounded-xl h-32"
              />

              <button
                onClick={handleSubmit}
                className="bg-orange-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-600"
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