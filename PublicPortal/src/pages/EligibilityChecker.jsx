import { useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaQuestionCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';

const EligibilityChecker = () => {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const questions = [
    {
      id: 'age',
      question: 'Are you between 18 and 65 years old?',
      type: 'radio',
      options: ['Yes', 'No']
    },
    {
      id: 'weight',
      question: 'Do you weigh at least 50 kg (110 lbs)?',
      type: 'radio',
      options: ['Yes', 'No']
    },
    {
      id: 'health',
      question: 'Are you in good general health?',
      type: 'radio',
      options: ['Yes', 'No']
    },
    {
      id: 'pregnancy',
      question: 'Are you pregnant or have you been pregnant in the last 6 weeks?',
      type: 'radio',
      options: ['No', 'Yes']
    },
    {
      id: 'recent_donation',
      question: 'Have you donated blood in the last 56 days?',
      type: 'radio',
      options: ['No', 'Yes']
    },
    {
      id: 'medications',
      question: 'Are you currently taking any medications that might affect blood donation?',
      type: 'radio',
      options: ['No', 'Yes']
    },
    {
      id: 'travel',
      question: 'Have you traveled to areas with malaria risk in the last 3 months?',
      type: 'radio',
      options: ['No', 'Yes']
    },
    {
      id: 'tattoo',
      question: 'Have you had a tattoo or body piercing in the last 4 months?',
      type: 'radio',
      options: ['No', 'Yes']
    }
  ];

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const checkEligibility = () => {
    const requiredAnswers = questions.length;
    const givenAnswers = Object.keys(answers).length;

    if (givenAnswers < requiredAnswers) {
      toast.warning('Please answer all questions before checking eligibility.');
      return;
    }

    // Eligibility criteria
    const eligible = (
      answers.age === 'Yes' &&
      answers.weight === 'Yes' &&
      answers.health === 'Yes' &&
      answers.pregnancy === 'No' &&
      answers.recent_donation === 'No' &&
      answers.medications === 'No' &&
      answers.travel === 'No' &&
      answers.tattoo === 'No'
    );

    setResult(eligible);
    setShowResult(true);

    if (eligible) {
      toast.success('You appear to be eligible to donate blood!');
    } else {
      toast.info('You may not be eligible at this time. Please consult with a healthcare professional.');
    }
  };

  const resetChecker = () => {
    setAnswers({});
    setResult(null);
    setShowResult(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <FaQuestionCircle className="text-red-500" />
            Blood Donation Eligibility Checker
          </h1>

          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">
              <strong>Important:</strong> This is a preliminary screening tool. Final eligibility determination
              will be made by a healthcare professional at the donation center. Always consult with medical
              staff for personalized advice.
            </p>
          </div>

          {!showResult ? (
            <div className="space-y-6">
              {questions.map((q, index) => (
                <div key={q.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    {index + 1}. {q.question}
                  </h3>
                  <div className="flex gap-4">
                    {q.options.map(option => (
                      <label key={option} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={q.id}
                          value={option}
                          checked={answers[q.id] === option}
                          onChange={(e) => handleAnswer(q.id, e.target.value)}
                          className="text-red-500 focus:ring-red-500"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex justify-center pt-6">
                <button
                  onClick={checkEligibility}
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Check Eligibility
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className={`text-6xl mb-4 ${result ? 'text-green-500' : 'text-red-500'}`}>
                {result ? <FaCheckCircle /> : <FaTimesCircle />}
              </div>
              <h2 className={`text-2xl font-bold mb-4 ${result ? 'text-green-600' : 'text-red-600'}`}>
                {result ? 'You May Be Eligible!' : 'You May Not Be Eligible'}
              </h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {result
                  ? 'Based on your answers, you appear to meet the basic eligibility criteria for blood donation. Please visit a donation center for a complete health screening.'
                  : 'Based on your answers, you may not meet the eligibility criteria at this time. Please consult with a healthcare professional for more information.'
                }
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={resetChecker}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Retake Quiz
                </button>
                {result && (
                  <button
                    onClick={() => window.location.href = '/donor/nearby-requests'}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Find Donation Centers
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EligibilityChecker;
