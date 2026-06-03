import { useState } from "react";

const defaultBoardMembers = [
  { id: 1, name: "Sai Sri Krishna Teja Sanku", position: "President", initials: "KS" },
  { id: 2, name: "Drushtant Patil", position: "Vice President", initials: "DP" },
  { id: 3, name: "Simha Kishore Reddy", position: "Treasurer", initials: "SR" },
  { id: 4, name: "Lohith Maricharla", position: "Executive Secretary", initials: "LM" },
  { id: 5, name: "Riddhi Nijhawan", position: "Creative Director", initials: "RN" },
  { id: 6, name: "Jatin Salve", position: "Event Director", initials: "JS" },
  { id: 7, name: "Anitha Madapakula", position: "Event Manager", initials: "AM" },
  { id: 8, name: "Pavan Karthik Chila", position: "Social Media Manager", initials: "KC" },
  { id: 9, name: "Ayush Ranjan", position: "Marketing Manager", initials: "AR" },
  { id: 10, name: "Himanshu Potham Shetty", position: "IT Director", initials: "HS" },
  { id: 11, name: "Atish Maragur", position: "PR Director", initials: "AM" },
];

function Board() {
  const [members] = useState(() => {
    const savedMembers =
      JSON.parse(localStorage.getItem("igsaBoardMembers")) || [];

    return [...defaultBoardMembers, ...savedMembers];
  });

  const executiveMembers = members.filter((member) =>
    ["President", "Vice President", "Treasurer", "Executive Secretary"].includes(
      member.position
    )
  );

  const supportingMembers = members.filter(
    (member) =>
      !["President", "Vice President", "Treasurer", "Executive Secretary"].includes(
        member.position
      )
  );

  const Avatar = ({ member, size = "large" }) => {
    const avatarSize = size === "large" ? "w-24 h-24 text-3xl" : "w-14 h-14 text-sm";

    return member.image ? (
      <img
        src={member.image}
        alt={member.name}
        className={`${avatarSize} rounded-full object-cover`}
      />
    ) : (
      <div
        className={`${avatarSize} rounded-full bg-gradient-to-br from-blue-900 to-orange-500 flex items-center justify-center text-white font-bold`}
      >
        {member.initials ||
          member.name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .slice(0, 2)}
      </div>
    );
  };

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
            cultural, professional, and community-driven initiatives at UF.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {executiveMembers.map((member) => (
            <div
              key={member.id}
              className="bg-slate-50 rounded-3xl p-8 text-center border border-slate-200 hover:shadow-xl transition"
            >
              <div className="flex justify-center mb-6">
                <Avatar member={member} />
              </div>

              <h3 className="text-xl font-bold text-blue-950">
                {member.name}
              </h3>

              <p className="text-orange-600 font-bold mt-2">
                {member.position}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mb-10">
          <p className="text-orange-600 font-semibold">Directors & Managers</p>

          <h2 className="text-3xl font-bold text-blue-950 mt-2">
            Supporting Leadership
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {supportingMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-lg transition"
            >
              <Avatar member={member} size="small" />

              <div>
                <h3 className="font-bold text-blue-950">{member.name}</h3>
                <p className="text-orange-600 font-semibold text-sm">
                  {member.position}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Board;