# FastAPI Project Template

This is a template for a FastAPI project with MongoDB integration.

## Project Structure

app
├── database
│ └── db.py
├── models
│ ├── category.py
│ ├── item.py
│ ├── token.py
│ ├── user_response.py
│ └── user.py
├── routes
│ ├── category.py
│ ├── item.py
│ ├── user_response.py
│ └── user.py
├── main.py
├── venv
├── .gitignore
├── README.md
└── requirements.txt


## Setup

### Prerequisites

- Python 3.8 or higher
- MongoDB installed and running

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/fastapi-project.git

2. Navigate to the project directory

    ```bash
    cd fastapi-project
3. Create a virtual environment:

    ```bash
    python -m venv venv

4. Activate the Virtua Environment
    #### Windows
    ```bash
    .\venv\Scripts\activate

    #### Linux or Mac

    ```bash
    source venv/bin/activate

5. Install the dependencies:

    ```bash
    pip install -r requirements.txt


## Configuration

1. Create a .env file in the project root and configure your MongoDB connection:


    DATABASE_URL=mongodb://username:password@localhost:27017
    DATABASE_NAME=your_database_name

2. Update the db.py file in the app/database directory with your MongoDB configuration

## Run the Application

1. Start the FastAPI application:
    ```bash
    uvicorn main:app --reload

2. Visit the FastAPI documentation at http://127.0.0.1:8000/docs to interact with the API.




