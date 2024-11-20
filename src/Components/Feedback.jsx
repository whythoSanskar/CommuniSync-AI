import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Feedback = ({ stats }) => {
  // Default stats if no interview stats are passed
  const defaultStats = {
    correct: 5,
    wrong: 3,
    unanswered: 2,
    performance: [75, 65, 80], // [Technical, Behavioral, Communication]
    feedback: {
      strengths: [
        "Strong problem-solving approach",
        "Clear communication style",
        "Good technical knowledge"
      ],
      improvements: [
        "Could elaborate more on solutions",
        "Consider alternative approaches",
        "Work on time management"
      ]
    }
  };

  const currentStats = stats || defaultStats;
  const { correct, wrong, unanswered, performance, feedback } = currentStats;

  const pieData = {
    labels: ['Correct', 'Wrong', 'Unanswered'],
    datasets: [
      {
        data: [correct, wrong, unanswered],
        backgroundColor: [
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(255, 206, 86, 0.8)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: ['Technical Skills', 'Behavioral Skills', 'Communication'],
    datasets: [
      {
        label: 'Performance Score (%)',
        data: performance,
        backgroundColor: 'rgba(53, 162, 235, 0.8)',
        borderColor: 'rgba(53, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-xl p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Interview Feedback</h1>
            <p className="mt-2 text-gray-600">Here's a detailed analysis of your interview performance</p>
          </div>

          {/* Charts Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Question Response Distribution</h2>
              <div className="aspect-square">
                <Pie data={pieData} />
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Skills Assessment</h2>
              <Bar data={barData} options={barOptions} />
            </div>
          </div>

          {/* Detailed Feedback */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-green-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-green-800">Strengths</h2>
              <ul className="space-y-2">
                {feedback.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-200 text-green-800 mr-2">
                      ✓
                    </span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-blue-800">Areas for Improvement</h2>
              <ul className="space-y-2">
                {feedback.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-200 text-blue-800 mr-2">
                      i
                    </span>
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;