import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";

function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/messages");

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error(error);
      alert("Unable to load messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/messages/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete message");
      }

      setMessages((prevMessages) =>
        prevMessages.filter((message) => message._id !== id)
      );
    } catch (error) {
      console.error(error);
      alert("Unable to delete message.");
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-blue-950">Messages</h1>
        <p className="text-slate-600 mt-2">
          View student inquiries submitted through the contact form.
        </p>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl shadow-md p-10 text-center">
          <p className="text-slate-500 text-lg">Loading messages...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-md p-10 text-center">
          <p className="text-slate-500 text-lg">No messages yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {messages.map((message) => (
            <div
              key={message._id}
              className="bg-white rounded-3xl shadow-md p-6 border border-slate-200"
            >
              <div className="flex justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-bold text-blue-950">
                    {message.subject}
                  </h2>

                  <p className="text-slate-600 mt-2">
                    From: {message.name} ({message.email})
                  </p>

                  <p className="text-orange-600 font-semibold mt-1">
                    {new Date(message.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(message._id)}
                  className="bg-red-500 text-white px-5 py-2 rounded-xl font-bold h-fit"
                >
                  Delete
                </button>
              </div>

              <p className="text-slate-700 mt-5 leading-relaxed">
                {message.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminMessages;