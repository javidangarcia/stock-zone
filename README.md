<h1 align="center">Stock Zone</h1>

<div align="center">
  <img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E" alt="JavaScript">
  <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React">
  <img src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" alt="NodeJS">
  <img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB" alt="Express.js">
  <img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white" alt="Postgres">
  <img src="https://img.shields.io/badge/bootstrap-%238511FA.svg?style=for-the-badge&logo=bootstrap&logoColor=white" alt="Bootstrap">
  <img src="https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white" alt="Redux">
</div>

## Overview

Stock Zone is a full-stack React + Express web application that helps users learn more about the stock market. It allows users to research stocks they find using search queries, follow stocks they are interested in, create discussion posts and comments, stay up to date with the market through recent news, and connect with other users using real-time private messaging.

## Getting Started

1.  **Clone the repository**:

    Clone the repository to your local directory by running the following command in your terminal:

    ```
    git clone https://github.com/javidangarcia/stock-zone.git
    ```

2.  **Start the Docker container**:

    Navigate to the server directory:

    ```
    cd server
    ```

    Start the Docker container with the provided docker compose file:

    ```
    docker compose up -d
    ```

3.  **Install dependencies for the client**:

    Go to the client directory:

    ```
    cd client
    ```

    Then, install all necessary dependencies and packages:

    ```
    npm install
    ```

4.  **Set up the required environment variables for the client**:

    -   Create a `.env` file in the `client` directory.
    -   Copy the contents from `.env.example` into `.env`.
    -   Modify the values in `.env` as needed based on your environment.

5.  **Build and run the client application**:

    Once the dependencies are installed, build the project and start the development server:

    ```
    npm run dev
    ```

## User Roles

**Investor:** A user that wants to research stocks, follow stocks, and connect with other users.

## User Stories

1. As an investor, I want to create a profile and log in so that I can connect with other users and get personalized news on my feed based on stocks I follow.

2. As an investor, I want to search and explore for stocks so that I can research, follow them, and make informed investment decisions.

3. As an investor, I want to follow stocks that I am interested in so that I can easily access their information and updates on my home page.

4. As an investor, I want to see news about the stocks I follow in my feed to stay updated with the latest developments and make timely investment decisions.

5. As an investor, I want to see other users who follow the same stock as me so that I can connect with them and exchange insights and ideas.

6. As an investor, I want to add other users as friends who follow the same stock as me so that we can build a network of like-minded individuals and share information and recommendations.

7. As an investor, I want to like and dislike stocks to express my opinion and contribute to the platform's ranking mechanism.

8. As an investor, I want to see a list of stocks sorted by a ranking mechanism based on likes, dislikes, and follows from both myself and other users to discover popular stocks and potentially gain insights into market trends.

9. As an investor, I want to comment on stock pages to engage in discussions with other users, share my thoughts, and gather additional information about the stocks I am interested in.

10. As an investor, I want to message other users to have private conversations, seek advice, or collaborate on investment opportunities.
