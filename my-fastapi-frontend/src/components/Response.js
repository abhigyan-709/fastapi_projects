// Response.js
import React, { useEffect, useState } from 'react';

const Response = () => {
  const [userResponse, setUserResponse] = useState([]);

  useEffect(() => {
    // Retrieve the locally saved user response from localStorage
    const storedUserResponse = localStorage.getItem('userResponse');
    
    if (storedUserResponse) {
      setUserResponse(JSON.parse(storedUserResponse));
      console.log('Stored Response:', storedUserResponse);
    }
  }, []);

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
    </div>
  );
};

export default Response;
