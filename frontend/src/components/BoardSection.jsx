import { useEffect, useState } from "react";
import API_BASE_URL from "../config/api";

function BoardSection() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/board-members`);

        if (!response.ok) {
          throw new Error("Failed to fetch board members");
        }

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

  const executiveBoard = members.filter((member) =>
    ["President", "Vice President", "Treasurer", "Executive Secretary"].includes(
      member.position
    )
  );

  const directors = members.filter(
    (member) =>
      !["President", "Vice President", "Treasurer", "Executive Secretary"].includes(
        member.position
      )
  );

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2);

  if (loading) {
    return (
      <section className="py-24 bg-white">
        <p className="text-center text-slate-600">Loading board members...</p>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-orange-600 font-semibold mb-2">Executive Board</p>

          <h2 className="text-4xl font-bold text-blue-950">
            Meet the IGSA Team
          </h2>

          <p className="mt-4 text-slate-600 max-w-3xl mx-auto">
            Our board works together to support Indian graduate students through
            cultural, professional, and community-driven initiatives at the
            University of Florida.
          </p>
        </div>

        {members.length === 0 ? (
          <p className="text-center text-slate-600">
            Board members will be updated soon.
          </p>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7 mb-16">
              {executiveBoard.map((member) => (
                <div
                  key={member._id}
                  className="bg-slate-50 border border-slate-200 rounded-3xl p-7 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                >
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-24 h-24 mx-auto rounded-full object-cover mb-5"
                    />
                  ) : (
                    <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-950 via-blue-800 to-orange-500 flex items-center justify-center text-white text-3xl font-bold mb-5">
                      {getInitials(member.name)}
                    </div>
                  )}

                  <h3 className="text-lg font-bold text-blue-950">
                    {member.name}
                  </h3>

                  <p className="text-orange-600 font-semibold mt-2">
                    {member.position}
                  </p>
                </div>
              ))}
            </div>

            {directors.length > 0 && (
              <>
                <div className="text-center mb-10">
                  <p className="text-orange-600 font-semibold mb-2">
                    Directors & Managers
                  </p>

                  <h3 className="text-3xl font-bold text-blue-950">
                    Supporting Leadership
                  </h3>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {directors.map((member) => (
                    <div
                      key={member._id}
                      className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                    >
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-900 to-orange-500 flex items-center justify-center text-white font-bold">
                          {getInitials(member.name)}
                        </div>
                      )}

                      <div>
                        <h4 className="font-bold text-blue-950">
                          {member.name}
                        </h4>

                        <p className="text-sm text-orange-600 font-semibold">
                          {member.position}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default BoardSection;