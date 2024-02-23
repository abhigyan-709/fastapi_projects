# FastAPI Static Deployment Guide

## Table of Contents
1. [EC2 Instance Setup](#ec2-instance-setup)
2. [SSH Connection](#ssh-connection)
3. [Install Dependencies](#install-dependencies)
4. [GitHub Private Repository](#github-private-repository)
5. [NGINX Configuration](#nginx-configuration)
6. [Domain Setup with Route 53](#domain-setup-with-route-53)
7. [SSL Installation](#ssl-installation)

## 1. EC2 Instance Setup

- Launch an EC2 instance on AWS with the desired specifications.
- Configure security groups to allow SSH (port 22) and HTTP/HTTPS traffic (ports 80 and 443).

## 2. SSH Connection

- Connect to your EC2 instance using SSH:
  ```bash
  ssh -i path/to/your/private-key.pem ec2-user@your-ec2-public-ip

## 3. Install Dependencies

- Update the package lists and install necessary dependencies:
  ```bash
  sudo apt update
  sudo apt install python3-pip python3-venv nginx

## 4. Pull the code from GitHub Private Repository

- Generate SSH Key
In Terminal, run the following command:

  ```bash
  ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

- Generate SSH Key
In Terminal, run the following command:

## 5. GitHub Private Repository

### Generate SSH Key (macOS/Linux)

1. Open Terminal.

2. Check for existing SSH keys:
   ```bash
   ls -al ~/.ssh


