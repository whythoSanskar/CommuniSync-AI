import { useState, useEffect } from "react";
import { videoPlay } from "../utils";
import CardSection from "./CardSection";
import { Link } from "react-router-dom";

const list = ["Interviews", "Presentations", "Customer Calls"];

const Landing = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % list.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-16">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 items-center bg-white shadow-lg rounded-lg p-8 md:p-16">
          <div className="text-center md:text-left space-y-6">
            <h1 className="text-5xl font-bold font-serif text-gray-800">
              Your AI Feedback Partner in:
            </h1>
            <div className="my-4">
              <span className="text-5xl text-blue-600 font-extrabold">
                {list[index]}
              </span>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed">
              CommuniSync is your AI communication coach, offering real-time feedback to help
              you speak confidently during calls. Get personalized suggestions and actionable
              insights. Your progress is tracked privately, just for you.
            </p>
            <div>
              <button
                type="submit"
                className="mt-4 px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-md shadow-md hover:bg-blue-700 transition-colors duration-300"
              >
                <Link to="/login">
                Try for Free
                </Link>
              </button>
            </div>
          </div>

          <div className="relative mt-8 md:mt-0">
            <video
              autoPlay
              muted
              playsInline={true}
              src={videoPlay}
              type="video/mp4"
              width={640}
              height={360}
              loop={true}
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      <CardSection />
    </>
  );
};

export default Landing;
