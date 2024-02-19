import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Response = () => {
  const navigate = useNavigate();
  const [userResponse, setUserResponse] = useState([]);

  useEffect(() => {
    // Retrieve the locally saved user response from localStorage
    const storedUserResponse = localStorage.getItem('userResponse');

    if (storedUserResponse) {
      setUserResponse(JSON.parse(storedUserResponse));
      console.log('Stored Response:', storedUserResponse);
    }
  }, []);

  const handleLogout = () => {
    // Clear all relevant data from localStorage
    localStorage.removeItem('userResponse');
    localStorage.removeItem('access_token');
    localStorage.removeItem('categories');
    localStorage.removeItem('sections');
    localStorage.removeItem('questions');
    localStorage.removeItem('selectedData');
    localStorage.removeItem('userResponses');
    localStorage.removeItem('allUserResponses');

    // Redirect to the login page or any other desired location
    navigate('/');
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">User Response</h2>
      {userResponse ? (
        <div>
          {/* Display user response details */}
          <h3 className="text-start">Industry: {userResponse.industry_name}</h3>

          {userResponse.sections && userResponse.sections.length > 0 ? (
            userResponse.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mt-4">
                <h4 className="text-start">Section: {section.section_name}</h4>
                {section.answers && section.answers.length > 0 ? (
                  section.answers.map((answer, answerIndex) => (
                    <div key={answerIndex} className="text-start">
                      <p>
                        Question: {answer.question_text} - Answer: {answer.answer}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-start">No answers available for this section.</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-start">No sections available for this response.</p>
          )}
        </div>
      ) : (
        <p className="text-start">No user response available.</p>
      )}

      {/* Add a button for logout */}
      <button className="btn btn-primary mt-3" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Response;
