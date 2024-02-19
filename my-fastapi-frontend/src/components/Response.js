import React, { useEffect, useState } from 'react';

const Response = () => {
  const [userResponses, setUserResponses] = useState([]);

  useEffect(() => {
    const storedUserResponses = localStorage.getItem('allUserResponses') || '[]';
    setUserResponses(JSON.parse(storedUserResponses));
    console.log('Stored Response:', storedUserResponses)
  }, []);
  

  return (
    <div>
      <h2>User Responses</h2>
      {userResponses.map((response, index) => (
        <div key={index}>
          <h3>{response.industry_name} - {response.section_name}</h3>
          {response.answers && response.answers.length > 0 ? (
            response.answers.map((answer, answerIndex) => (
              <div key={answerIndex}>
                <p>Question: {answer.question_text} - Answer: {answer.answer}</p>
              </div>
            ))
          ) : (
            <p>No answers available for this response.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default Response;
