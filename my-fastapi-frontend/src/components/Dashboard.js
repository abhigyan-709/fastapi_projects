import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [questions, setQuestions] = useState([]);
  const [userResponses, setUserResponses] = useState([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

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

        // Save categories to local storage
        localStorage.setItem('categories', JSON.stringify(response.data));
      } catch (error) {
        console.error('Error fetching categories', error);
      }
    };

    // Check if categories are already in local storage
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      // Fetch categories if not present in local storage
      fetchCategories();
    }
  }, []);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const apiUrl = "http://localhost:8000";
        const sectionsResponse = await axios.get(`${apiUrl}/industrial_categories/${selectedCategory}/sections`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSections(sectionsResponse.data);

        // Save sections to local storage
        localStorage.setItem('sections', JSON.stringify(sectionsResponse.data));
      } catch (error) {
        console.error('Error fetching sections', error);
      }
    };

    if (selectedCategory) {
      const storedSections = localStorage.getItem('sections');
      if (storedSections) {
        setSections(JSON.parse(storedSections));
      } else {
        // Fetch sections if not present in local storage
        fetchSections();
      }
    }
  }, [selectedCategory]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const apiUrl = "http://localhost:8000";
        const questionsResponse = await axios.get(`${apiUrl}/sections/${selectedSection}/questions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setQuestions(questionsResponse.data);

        // Save questions to local storage
        localStorage.setItem('questions', JSON.stringify(questionsResponse.data));
      } catch (error) {
        console.error('Error fetching questions', error);
      }
    };

    if (selectedSection) {
      const storedQuestions = localStorage.getItem('questions');
      if (storedQuestions) {
        setQuestions(JSON.parse(storedQuestions));
      } else {
        // Fetch questions if not present in local storage
        fetchQuestions();
      }
    }
  }, [selectedSection]);

  useEffect(() => {
    // Filter categories, sections, and questions based on selectedCategory and selectedSection
    const selectedCategoryData = categories.find((category) => category.name === selectedCategory);
    const selectedSectionData = sections.find((section) => section.id === selectedSection);

    // Check if selectedSectionData and its questions are defined
    if (selectedSectionData && selectedSectionData.questions) {
      // Map questions_ids to the respective questions
      const mappedQuestions = selectedSectionData.questions.map((question, index) => ({
        ...question,
        question_id: selectedSectionData.questions_ids[index],
      }));

      // Create an object to represent the selected data
      const selectedData = {
        selectedCategory: selectedCategoryData,
        selectedSection: {
          ...selectedSectionData,
          questions: mappedQuestions,
        },
      };

      // Use selectedData to set initial userResponses
      if (selectedSectionData.questions) {
        const initialUserResponses = selectedSectionData.questions.map((question) => {
          const answer = question.answers && question.answers.length > 0 ? question.answers[0].value : '';
          return { question_id: question.question_id, answer };
        });
        setUserResponses(initialUserResponses);
      }

      // Optionally, you can store the selected data in local storage if needed
      localStorage.setItem('selectedData', JSON.stringify(selectedData));
    }
  }, [selectedCategory, selectedSection, categories, sections]);

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
    const updatedUserResponses = [...userResponses];

    // Check if the question already exists in userResponses
    const existingResponseIndex = updatedUserResponses.findIndex(response => response.question_id === questionId);

    if (existingResponseIndex !== -1) {
      // If the question exists, update its answer
      updatedUserResponses[existingResponseIndex].answer = answer;
    } else {
      // If the question doesn't exist, add it to userResponses
      updatedUserResponses.push({ question_id: questionId, answer });
    }

    setUserResponses(updatedUserResponses);
  };

  const handleSaveAndContinue = () => {
    // Save the current responses locally and move to the next section
    const storedSelectedData = localStorage.getItem('selectedData');
    if (!storedSelectedData) {
      console.error('Selected data not found in localStorage.');
      return;
    }

    const { selectedCategory, selectedSection } = JSON.parse(storedSelectedData);

    // Ensure that selectedCategory and selectedSection are not undefined and have the required properties
    if (!selectedCategory || !selectedCategory.id || !selectedSection || !selectedSection.id) {
      console.error('Selected category, section, or their ids are missing.');
      return;
    }

    const username = localStorage.getItem('username');

    // Construct the UserResponse object to be saved locally
    const userResponse = {
      user_id: username, // Replace with the actual user ID
      industrial_category_id: selectedCategory.id,
      industry_name: selectedCategory.name,
      section_id: selectedSection.id,
      section_name: selectedSection.name,
      answers: userResponses.map((response) => {
        const question = selectedSection.questions.find((question) => question.question_id === response.question_id);
        return {
          question_id: response.question_id,
          question_text: question ? question.text : '',
          answer: response.answer,
        };
      }),
    };

    // Save the userResponse locally
    const storedUserResponses = localStorage.getItem('userResponses') || '[]';
    const existingUserResponses = JSON.parse(storedUserResponses);
    const updatedUserResponses = [...existingUserResponses, userResponse];
    localStorage.setItem('userResponses', JSON.stringify(updatedUserResponses));

    // Move to the next section if available
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);

      // Reset questions and userResponses for the new section
      setQuestions([]);
      setUserResponses([]);
    } else {
      console.error('No next section available.');
    }
  };

  const handleSubmit = async () => {
    try {
      // Retrieve selected data from localStorage
      const storedSelectedData = localStorage.getItem('selectedData');
      if (!storedSelectedData) {
        console.error('Selected data not found in localStorage.');
        return;
      }

      const { selectedCategory, selectedSection } = JSON.parse(storedSelectedData);

      // Ensure that selectedCategory and selectedSection are not undefined and have the required properties
      if (!selectedCategory || !selectedCategory.id || !selectedSection || !selectedSection.id) {
        console.error('Selected category, section, or their ids are missing.');
        return;
      }

      const username = localStorage.getItem('username');

      // Construct the final UserResponse object to be sent to the server
      const userResponse = {
        user_id: username, // Replace with the actual user ID
        industrial_category_id: selectedCategory.id,
        industry_name: selectedCategory.name,
        sections: JSON.parse(localStorage.getItem('userResponses') || '[]'),
      };

      // Log the userResponse
      console.log('User Response:', userResponse);

      // Post the user response to the server
      const apiUrl = "http://localhost:8000";
      await axios.post(`${apiUrl}/user_responses/`, userResponse, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      // Display a success message or perform other actions as needed
      console.log('User response submitted successfully!');

      // Reset the state and redirect to the initial state
      setSelectedCategory('');
      setSelectedSection('');
      setSections([]);
      setCurrentSectionIndex(0);
      setUserResponses([]);
      localStorage.removeItem('userResponses'); // Remove saved userResponses
    } catch (error) {
      console.error('Error submitting user response', error);
    }
  };

  const handleLogout = () => {
    // Clear the access token and data from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('categories');
    localStorage.removeItem('sections');
    localStorage.removeItem('questions');
    localStorage.removeItem('selectedData'); // Remove selectedData from local storage
    localStorage.removeItem('userResponses'); // Remove saved userResponses
    // Redirect to the login page
    navigate('/');
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
          {questions.map((question) => (
            <div key={question.id}>
              <p>{question.text}</p>
              <div>
                <label>
                  <input
                    type="radio"
                    name={`question_${question.id}`}
                    value="yes"
                    checked={userResponses.find((response) => response.question_id === question.id)?.answer === 'yes'}
                    onChange={() => handleRadioChange(question.id, 'yes')}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name={`question_${question.id}`}
                    value="no"
                    checked={userResponses.find((response) => response.question_id === question.id)?.answer === 'no'}
                    onChange={() => handleRadioChange(question.id, 'no')}
                  />
                  No
                </label>
              </div>
            </div>
          ))}

          <button onClick={handleSaveAndContinue}>
            Save and Continue
          </button>
          <button onClick={handleSubmit}>
            Submit Responses
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
