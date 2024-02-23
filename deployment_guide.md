# FastAPI Deployment Guide

## 1. Create an EC2 Instance

- Go to the AWS Management Console.

- Launch an EC2 instance, choosing an Amazon Machine Image (AMI) and instance type.

- Configure security groups to allow SSH (port 22) and HTTP/HTTPS (ports 80 and 443) traffic.

- Download the private key file (.pem) during instance creation.

- Connect to the instance using SSH:
  ```bash
  ssh -i path/to/your/private-key.pem ubuntu@your_server_ip


## 2. Install Nginx on EC2 Instance
  ```bash
    sudo apt update
    sudo apt install nginx


## 3. Install Nginx on EC2 Instance