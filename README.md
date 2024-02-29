# FastAPI Project 

This is a backend API for the project and it will work in isolated way also for a FastAPI project with MongoDB integration.

## Project Structure

``` bash
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

```
Above you have seen the project structure for the fastapi

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

# Launching an EC2 Instance on AWS and Configuring Nginx

## 1. Launch an EC2 Instance

- Go to the AWS Management Console.
- Click on "Services" and select "EC2" under the "Compute" section.
- Click on "Launch Instance".
- Choose an Amazon Machine Image (AMI), such as Ubuntu Server.
- Select an instance type based on your requirements.
- Configure instance details, including the number of instances, network settings, and storage.
- Add tags for easier identification (optional).
- Configure security groups to allow SSH (port 22) and HTTP/HTTPS (ports 80 and 443) traffic.
- Review your instance configuration and click "Launch".
- Choose an existing key pair or create a new one. Download the private key file (.pem) and keep it secure.
- Click "Launch Instances".

## 2. Connect to the EC2 Instance via SSH

- Open a terminal on your local machine.

- Change the permissions of your private key file to secure it:
  ```bash
  chmod 400 path/to/your/private-key.pem

  ```

- Connect to the instance using SSH:
ssh -i path/to/your/private-key.pem ubuntu@your_server_ip

## 3. Install Docker in the Ubuntu
```bash
 # Set up Docker's apt repository.
 # Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

```
- Install the Docker packages.
```bash 
# To install the latest version, run:
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

```

- Verify that the Docker Engine installation is successful by running the hello-world image.
```bash 
sudo docker run hello-world
# This command downloads a test image and runs it in a container. When the container runs, it prints a confirmation message and exits.

```







