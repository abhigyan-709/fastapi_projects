// Dashboard.js
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

        localStorage.setItem('categories', JSON.stringify(response.data));
      } catch (error) {
        console.error('Error fetching categories', error);
      }
    };

    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
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
        fetchQuestions();
      }
    }
  }, [selectedSection]);

  useEffect(() => {
    const selectedCategoryData = categories.find((category) => category.name === selectedCategory);
    const selectedSectionData = sections.find((section) => section.id === selectedSection);

    if (selectedSectionData && selectedSectionData.questions) {
      const mappedQuestions = selectedSectionData.questions.map((question, index) => ({
        ...question,
        question_id: selectedSectionData.questions_ids[index],
      }));

      const selectedData = {
        selectedCategory: selectedCategoryData,
        selectedSection: {
          ...selectedSectionData,
          questions: mappedQuestions,
        },
      };

      if (selectedSectionData.questions) {
        const initialUserResponses = selectedSectionData.questions.map((question) => {
          const answer = question.answers && question.answers.length > 0 ? question.answers[0].value : '';
          return { question_id: question.question_id, answer };
        });
        setUserResponses(initialUserResponses);
      }

      localStorage.setItem('selectedData', JSON.stringify(selectedData));
    }
  }, [selectedCategory, selectedSection, categories, sections]);

  const handleCategoryChange = async (event) => {
    const selectedCategoryValue = event.target.value;
    setSelectedCategory(selectedCategoryValue);

    const apiUrl = "http://localhost:8000";
    const sectionsResponse = await axios.get(`${apiUrl}/industrial_categories/${selectedCategoryValue}/sections`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    setSections(sectionsResponse.data);
    setSelectedSection('');
    setQuestions([]);
    setUserResponses([]);
  };

  const handleSectionChange = async (event) => {
    const selectedSectionValue = event.target.value;
    setSelectedSection(selectedSectionValue);

    const apiUrl = "http://localhost:8000";
    const questionsResponse = await axios.get(`${apiUrl}/sections/${selectedSectionValue}/questions`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    setQuestions(questionsResponse.data);
    setUserResponses([]);
  };

  const handleRadioChange = (questionId, answer) => {
    const updatedUserResponses = [...userResponses];

    const existingResponseIndex = updatedUserResponses.findIndex(response => response.question_id === questionId);

    if (existingResponseIndex !== -1) {
      updatedUserResponses[existingResponseIndex].answer = answer;
    } else {
      updatedUserResponses.push({ question_id: questionId, answer });
    }

    setUserResponses(updatedUserResponses);
  };

  const handleSaveAndContinue = () => {
    const storedSelectedData = localStorage.getItem('selectedData');
    if (!storedSelectedData) {
      console.error('Selected data not found in localStorage.');
      return;
    }

    const { selectedCategory, selectedSection } = JSON.parse(storedSelectedData);

    if (!selectedCategory || !selectedCategory.id || !selectedSection || !selectedSection.id) {
      console.error('Selected category, section, or their ids are missing.');
      return;
    }

    const username = localStorage.getItem('username');

    const userResponse = {
      user_id: username,
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

    const storedUserResponses = localStorage.getItem('userResponses') || '[]';
    const existingUserResponses = JSON.parse(storedUserResponses);
    const updatedUserResponses = [...existingUserResponses, userResponse];
    localStorage.setItem('userResponses', JSON.stringify(updatedUserResponses));
    localStorage.setItem('userResponse', JSON.stringify(userResponse)); // Store the current user response locally

    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setQuestions([]);
      setUserResponses([]);
    } else {
      console.error('No next section available.');
    }
  };

  const handleSubmit = async () => {
    try {
      const storedSelectedData = localStorage.getItem('selectedData');
      if (!storedSelectedData) {
        console.error('Selected data not found in localStorage.');
        return;
      }

      const { selectedCategory, selectedSection } = JSON.parse(storedSelectedData);

      if (!selectedCategory || !selectedCategory.id || !selectedSection || !selectedSection.id) {
        console.error('Selected category, section, or their ids are missing.');
        return;
      }

      const username = localStorage.getItem('username');

      const userResponse = {
        user_id: username,
        industrial_category_id: selectedCategory.id,
        industry_name: selectedCategory.name,
        sections: JSON.parse(localStorage.getItem('userResponses') || '[]'),
      };

      console.log('User Response:', userResponse);

      const apiUrl = "http://localhost:8000";
      await axios.post(`${apiUrl}/user_responses/`, userResponse, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      console.log('User response submitted successfully!', userResponse);

      localStorage.setItem('userResponse', JSON.stringify(userResponse));
      console.log('Data after Saving Locally: ', userResponse);
      // Store userResponse locally for future reference
      const storedUserResponses = localStorage.getItem('allUserResponses') || '[]';
      const existingUserResponses = JSON.parse(storedUserResponses);
      const updatedUserResponses = [...existingUserResponses, userResponse];
      localStorage.setItem('allUserResponses', JSON.stringify(updatedUserResponses));

      // Navigate to the Response page after successful submission
      navigate('/response');

      setSelectedCategory('');
      setSelectedSection('');
      setSections([]);
      setCurrentSectionIndex(0);
      setUserResponses([]);
      localStorage.removeItem('userResponses');
    } catch (error) {
      console.error('Error submitting user response', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('categories');
    localStorage.removeItem('sections');
    localStorage.removeItem('questions');
    localStorage.removeItem('selectedData');
    // localStorage.removeItem('userResponses');
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
