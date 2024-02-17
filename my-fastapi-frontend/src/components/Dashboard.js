import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [questions, setQuestions] = useState([]);
  const [userResponses, setUserResponses] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const apiUrl = "http://localhost:8000";
        const response = await axios.get(`${apiUrl}/industrial_categories/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories', error);
      }
    };

    fetchCategories();
  }, []);

  const handleLogout = () => {
    // Clear the access token from local storage
    localStorage.removeItem('access_token');
    // Redirect to the login page
    navigate('/');
  };

  const handleCategoryChange = async (event) => {
    const selectedCategoryValue = event.target.value;
    setSelectedCategory(selectedCategoryValue);

    // Fetch sections for the selected category
    const apiUrl = "http://localhost:8000";
    const sectionsResponse = await axios.get(`${apiUrl}/industrial_categories/${selectedCategoryValue}/sections`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    setSections(sectionsResponse.data);
    // Reset selectedSection and questions when changing category
    setSelectedSection('');
    setQuestions([]);
    setUserResponses([]);
  };

  const handleSectionChange = async (event) => {
    const selectedSectionValue = event.target.value;
    setSelectedSection(selectedSectionValue);

    // Fetch questions for the selected section
    const apiUrl = "http://localhost:8000";
    const questionsResponse = await axios.get(`${apiUrl}/sections/${selectedSectionValue}/questions`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    setQuestions(questionsResponse.data);
    // Reset userResponses when changing section
    setUserResponses([]);
  };

  const handleRadioChange = (questionId, answer) => {
    // Update userResponses based on the selected radio button
    const updatedUserResponses = userResponses.map((response) => {
      if (response.questionId === questionId) {
        return { ...response, answer };
      }
      return response;
    });

    setUserResponses(updatedUserResponses);
  };

  const handleSubmit = async () => {
    try {
      // Construct the UserResponse object to be sent to the server
      const userResponse = {
        user_id: 'user123', // Replace with the actual user ID
        industrial_category_id: selectedCategory,
        industry_name: selectedCategory,
        sections: [
          {
            section_id: selectedSection,
            section_name: selectedSection,
            answers: userResponses,
          },
        ],
      };

      // Post the user response to the server
      const apiUrl = "http://localhost:8000";
      await axios.post(`${apiUrl}/user_responses/`, userResponse, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      // Display a success message or perform other actions as needed
      console.log('User response submitted successfully!');
    } catch (error) {
      console.error('Error submitting user response', error);
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome to the Dashboard!</p>
      <button onClick={handleLogout}>Logout</button>

      <h3>Select Industrial Category:</h3>
      <select value={selectedCategory} onChange={handleCategoryChange}>
        <option value="" disabled>Select a category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>

      {selectedCategory && (
        <>
          <h3>Select Section:</h3>
          <select value={selectedSection} onChange={handleSectionChange}>
            <option value="" disabled>Select a section</option>
            {sections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.name}
              </option>
            ))}
          </select>
        </>
      )}

      {selectedSection && (
        <div>
          <h3>Details for {selectedCategory} - {selectedSection}:</h3>
          {/* Display other category and section details as needed */}
          {questions.map((question) => (
            <div key={question.id}>
              <p>{question.text}</p>
              <div>
                <label>
                  <input
                    type="radio"
                    name={`question_${question.id}`}
                    value="yes"
                    checked={userResponses.some((response) => response.questionId === question.id && response.answer === 'yes')}
                    onChange={() => handleRadioChange(question.id, 'yes')}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name={`question_${question.id}`}
                    value="no"
                    checked={userResponses.some((response) => response.questionId === question.id && response.answer === 'no')}
                    onChange={() => handleRadioChange(question.id, 'no')}
                  />
                  No
                </label>
              </div>
            </div>
          ))}
          <button onClick={handleSubmit}>Submit Responses</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
