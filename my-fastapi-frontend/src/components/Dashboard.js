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
  
      // Log the selected data whenever it changes
      console.log('Selected Data:', selectedData);
  
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
  
      // Log all data in selectedCategory
      console.log('Selected Category:', selectedCategory);
  
      // Construct the UserResponse object to be sent to the server
      const userResponse = {
        user_id: 'user123', // Replace with the actual user ID
        industrial_category_id: selectedCategory.id,
        industry_name: selectedCategory.name,
        sections: [
          {
            section_id: selectedSection.id,
            section_name: selectedSection.name,
            answers: selectedSection.questions.map((question) => ({
              question_id: question.question_id,
              question_text: question.text,
              answer: question.answers[0].value, // Assuming answers is an array with one value
            })),
          },
        ],
      };
      console.log('User Response:', userResponse)
  
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
  

  const handleLogout = () => {
    // Clear the access token and data from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('categories');
    localStorage.removeItem('sections');
    localStorage.removeItem('questions');
    localStorage.removeItem('selectedData'); // Remove selectedData from local storage
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
