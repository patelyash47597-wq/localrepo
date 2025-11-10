import React, { useState } from "react";

interface RoleCard {
  title: string;
  description: string;
  icon: string;
  image: string;
  bgColor: string;
}

const roles: RoleCard[] = [
  {
    title: "Software Engineer",
    description: "Develop and maintain software",
    icon: "💻",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
    bgColor: "from-orange-200 to-orange-300",
  },
  {
    title: "Data Scientist",
    description: "Analyze data for insights",
    icon: "📊",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
    bgColor: "from-blue-200 to-blue-300",
  },
  {
    title: "Product Manager",
    description: "Manager product development",
    icon: "📈",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
    bgColor: "from-green-200 to-green-300",
  },
  {
    title: "UI/UX Designer",
    description: "Design user-friendly interface",
    icon: "🎨",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
    bgColor: "from-purple-200 to-purple-300",
  },
];

export const RoadmapSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"roles" | "skills">("roles");

  return (
    <section className="flex-1">
      <div className="mb-8">
        <h2 className="font-serif font-bold text-3xl md:text-4xl text-sidebar-foreground mb-6">
          Roadmaps
        </h2>

        {/* Tab Navigation */}
        <div className="flex gap-8 border-b border-secondary mb-8">
          <button
            onClick={() => setActiveTab("roles")}
            className={`pb-3 font-semibold text-lg transition-colors ${
              activeTab === "roles"
                ? "text-primary border-b-2 border-primary"
                : "text-sidebar-accent-foreground hover:text-sidebar-foreground"
            }`}
          >
            Roles
          </button>
          <button
            onClick={() => setActiveTab("skills")}
            className={`pb-3 font-semibold text-lg transition-colors ${
              activeTab === "skills"
                ? "text-primary border-b-2 border-primary"
                : "text-sidebar-accent-foreground hover:text-sidebar-foreground"
            }`}
          >
            Skills
          </button>
        </div>
      </div>

      {/* Role Cards Grid */}
      {activeTab === "roles" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {roles.map((role, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Card Image */}
              <div className={`h-40 bg-gradient-to-br ${role.bgColor} relative overflow-hidden`}>
                <img
                  src={role.image}
                  alt={role.title}
                  className="w-full h-full object-cover opacity-70"
                />
              </div>

              {/* Card Content */}
              <div className="p-4">
                <h3 className="font-serif font-bold text-lg text-sidebar-foreground mb-2">
                  {role.title}
                </h3>
                <p className="text-sm text-sidebar-accent-foreground leading-relaxed">
                  {role.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills Tab Content */}
      {activeTab === "skills" && (
        <div className="bg-white rounded-xl shadow-md p-8">
          <p className="text-sidebar-accent-foreground text-center py-12">
            Select a skill to view detailed learning paths and resources.
          </p>
        </div>
      )}
    </section>
  );
};
