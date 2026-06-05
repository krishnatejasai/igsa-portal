import { useEffect, useState } from "react";
import API_BASE_URL from "../config/api";

function BoardSection() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/board-members`);
        if (!response.ok) throw new Error("Failed to fetch board members");

        const data = await response.json();
        setMembers(data.slice(0, 8));
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
      <section className="py-16 md:py-24 bg-white">
        <p className="text-center text-slate-600">Loading board members...</p>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-5 md:px-6">
        <div className="text-center mb-10 md:mb-14">
          <p className="text-orange-600 font-semibold text-sm mb-2">
            IGSA Board
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-blue-950">
            Meet the IGSA Team
          </h2>

          <p className="mt-3 text-sm md:text-base text-slate-600 max-w-3xl mx-auto">
            Our board supports Indian graduate students through cultural,
            professional, and community-driven initiatives at UF.
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
                className="bg-slate-50 border border-slate-200 rounded-2xl p-4 md:p-5 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 min-h-[185px] md:min-h-[245px] flex flex-col items-center"
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

                <p className="text-xs md:text-sm text-orange-600 font-semibold mt-1">
                  {member.position}
                </p>

                {member.description && (
                  <p className="hidden md:block text-xs text-slate-600 mt-3 leading-relaxed line-clamp-2">
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

export default BoardSection;