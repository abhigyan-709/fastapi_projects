// Response.js
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
    <div>
      <h2>User Response</h2>
      {userResponse ? (
        <div>
          {/* Display user response details */}
          <h3>User: {userResponse.user_id}</h3>
          <h3>Industry: {userResponse.industry_name}</h3>
          <h3>Section: {userResponse.section_name}</h3>

          {userResponse.sections && userResponse.sections.length > 0 ? (
            userResponse.sections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <h4>Section: {section.section_name}</h4>
                {section.answers && section.answers.length > 0 ? (
                  section.answers.map((answer, answerIndex) => (
                    <div key={answerIndex}>
                      <p>Question: {answer.question_text} - Answer: {answer.answer}</p>
                    </div>
                  ))
                ) : (
                  <p>No answers available for this section.</p>
                )}
              </div>
            ))
          ) : (
            <p>No sections available for this response.</p>
          )}
        </div>
      ) : (
        <p>No user response available.</p>
      )}

      {/* Add a button for logout */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Response;
