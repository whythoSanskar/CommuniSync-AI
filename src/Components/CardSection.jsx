const CardSection = () => {
    const cardContent = [
      {
        title: "Get feedback on your communication in real-time",
        description: "Designed to be not distracting and immediately actionable. The best part? No one else knows you’re using it."
      },
      {
        title: "Stay clear and focused with live speaker notes",
        description: "CommuniSync automatically brings up your meeting notes and crosses items off as you cover them, so you can easily track what's left."
      },
      {
        title: "Immediate Actionable feedback on what to try for next time",
        description: "CommuniSync provides feedback based on meeting goals. Track progress on your growth areas over time."
      },
      {
        title: "Let AI make follow-ups easier",
        description: "With AI, streamline your follow-up processes, making communication more effective and efficient."
      },
    ];
  
    return (
      <div className="py-16 bg-gray-100">
        <div className="container mx-auto grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
          {cardContent.map((card, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">{card.title}</h3>
              <p className="text-gray-600">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default CardSection;
  