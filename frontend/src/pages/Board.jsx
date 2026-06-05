import { useEffect, useState } from "react";
import API_BASE_URL from "../config/api";

function Board() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/board-members`);
        if (!response.ok) throw new Error("Failed to fetch board members");

        const data = await response.json();
        setMembers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2);

  if (loading) {
    return (
      <section className="pt-32 py-16 bg-white">
        <p className="text-center text-slate-600">Loading board members...</p>
      </section>
    );
  }

  return (
    <section className="pt-32 pb-16 md:pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-5 md:px-6">
        <div className="text-center mb-10">
          <p className="text-orange-600 font-semibold text-sm mb-2">
            IGSA Board
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-blue-950">
            Meet the IGSA Team
          </h2>

          <p className="mt-3 text-sm md:text-base text-slate-600 max-w-3xl mx-auto">
            Our board works together to support Indian graduate students through
            cultural, professional, and community-driven initiatives at UF.
          </p>
        </div>

        {members.length === 0 ? (
          <p className="text-center text-slate-600">
            Board members will be updated soon.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {members.map((member) => (
              <div
                key={member._id}
                className="bg-slate-50 rounded-2xl border border-slate-200 p-4 md:p-5 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 min-h-[190px] md:min-h-[260px] flex flex-col items-center"
              >
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover mb-3"
                  />
                ) : (
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-blue-950 via-blue-800 to-orange-500 flex items-center justify-center text-white text-xl md:text-2xl font-bold mb-3">
                    {getInitials(member.name)}
                  </div>
                )}

                <h3 className="text-sm md:text-lg font-bold text-blue-950 leading-snug">
                  {member.name}
                </h3>

                <p className="text-xs md:text-sm text-orange-600 font-bold mt-1">
                  {member.position}
                </p>

                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="text-[11px] md:text-xs text-slate-500 mt-1 break-all hover:text-orange-600"
                  >
                    {member.email}
                  </a>
                )}

                {member.description && (
                  <p className="hidden md:block text-xs text-slate-600 mt-3 leading-relaxed line-clamp-3">
                    {member.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Board;