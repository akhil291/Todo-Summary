Todo Summary Assistant :
A full-stack application that allows users to manage their personal to-do items, summarize all pending tasks using an LLM, and send the generated summary to a Slack channel.

Live Link : https://todo-summary-frontend.onrender.com

Demo : https://drive.google.com/file/d/1MyaFa7kRbko39sOctM03vblwkqLR35Rx/view?usp=sharing

Features :
----------
1)Create, Edit, Delete To-Dos: Full CRUD operations for personal to-do items.
2)View To-Do List: Clearly displays current to-do items with their status (pending/completed).
3)Summarize Pending To-Dos: A dedicated button triggers the summarization of only pending to-dos using Google's Gemini LLM.
4)Send Summary to Slack: The generated summary is automatically posted to a configured Slack channel.
5)User Feedback: Provides success/failure messages for all operations, especially for Slack integration.


Tech Stack :
------------
Frontend:
-------------
React: For building the user interface.
Axios: For making HTTP requests to the backend API.
CSS: For styling the components.

Backend:
--------

Node.js (Express): The runtime environment and web framework.
PostgreSQL: Relational database for storing to-do items.
pg: Node.js driver for PostgreSQL.
dotenv: To manage environment variables.
cors: Middleware for enabling Cross-Origin Resource Sharing.
axios: For making HTTP requests to external APIs (LLM and Slack).
@google/generative-ai: Google Gemini API client library.

Database:
----------
PostgreSQL (locally or via Supabase/similar): For persistent storage of to-do items.

Integrations:
--------------
Google Gemini API: For Large Language Model capabilities.
Slack Incoming Webhooks: For sending messages to Slack channels.
 
Prerequisites:
---------------
Before you begin, ensure you have the following installed:
->Node.js & npm: (LTS version recommended) - Download from nodejs.org.
->PostgreSQL: Install PostgreSQL on your local machine or have access to a cloud-hosted instance (e.g., Supabase).
->Git: For cloning the repository.
->A Google Account: Required to get a Gemini API Key.
->A Slack Workspace: Required to create an Incoming Webhook.

Setup Instructions:
-------------------
Follow these steps to get the application up and running on your local machine.

1. Clone the Repository :
First, clone this GitHub repository to your local machine:
     -> git clone Todo-Summary
     -> cd todo-summary-assistant 

2. Database Setup :
     -> Install PostgreSQL if you don't have it.
     -> Create a new database named todosdb. You can do this via your PostgreSQL client (like psql or pgAdmin):
           -> CREATE DATABASE todosdb;
     -> The backend will automatically create the todos table when it connects to the database for the first time.
   
3. Backend Setup :
     -> Navigate into the server directory and install dependencies:
          -> cd server
          -> npm install       

4. Configure Backend Environment Variables :
     -> Create a .env file in the server directory based on the provided .env.example.

            -># server/.env
              PORT=5000
              GEMINI_API_KEY=YOUR_GEMINI_API_KEY 
              SLACK_WEBHOOK_URL=YOUR_SLACK_WEBHOOK_URL
              DB_HOST=localhost 
              DB_PORT=5432 
              DB_USER=postgres
              DB_PASSWORD=root 
              DB_NAME=todosdb
    -> Important: Replace YOUR_GEMINI_API_KEY and YOUR_SLACK_WEBHOOK_URL with your actual keys/URLs obtained from the setup guides below. Adjust DB_HOST, DB_PORT, DB_USER, DB_PASSWORD if you're using a different PostgreSQL setup (e.g., Supabase).

5. Run the Backend :
    -> From the server directory:
          -> npm start
    -> The backend server will start on http://localhost:5000. You should see Connected to PostgreSQL database! and Todos table checked/created successfully. in your console.

6. Frontend Setup :
    -> Open a new terminal, navigate into the client directory, and install dependencies:
            -> cd ../client # If you are still in the server directory
            -> npm install

7. Configure Frontend Environment Variables :
     -> Create a .env file in the client directory based on the provided .env.example.
               -> # client/.env
                  REACT_APP_API_URL=http://localhost:5000/api
     ->This tells your React app where to find the backend. If your backend runs on a different port or domain, update this accordingly.

8. Run the Frontend :
     -> From the client directory:
              -> npm start
     -> This will open the React application in your browser, usually at http://localhost:3000.

LLM (Gemini) Setup Guide :
--------------------------
1) Go to Google AI Studio: Visit https://aistudio.google.com/.

2) Get an API Key:
      -> Sign in with your Google account.
      -> On the left sidebar, click on "Get API Key".
      -> Click "Create API key in new project" (or "Create API key in existing project" if you have one).
      -> Copy the generated API key.
   
3) Add to Backend .env: Paste this key as the value for GEMINI_API_KEY in your server/.env file.
      -> GEMINI_API_KEY=YOUR_COPIED_GEMINI_API_KEY

4) Restart Backend: After updating the .env file, restart your backend server (Ctrl+C then npm start) for the changes to take effect.

Slack Integration Setup Guide :
---------------------------------
1) Go to Slack API: Visit https://api.slack.com/apps.

2)Create a New App:
     -> Click "Create New App".
     -> Choose "From scratch".
     -> Give your app a name (e.g., "Todo Summary Bot") and select your Slack Workspace.
     -> Click "Create App".
     
3)Add Incoming Webhooks:
    -> In the sidebar under "Features", click "Incoming Webhooks".
    -> Toggle "Activate Incoming Webhooks" to "On". 
    -> Scroll down and click "Add New Webhook to Workspace".
    -> Choose the channel where you want the summaries to be posted and click "Allow".
    -> Copy the "Webhook URL" that is displayed.

4) Add to Backend .env: Paste this URL as the value for SLACK_WEBHOOK_URL in your server/.env file.
   ->  SLACK_WEBHOOK_URL=YOUR_COPIED_SLACK_WEBHOOK_URL
   
5) Restart Backend: After updating the .env file, restart your backend server (Ctrl+C then npm start) for the changes to take effect.

Design and Architecture Decisions :
----------------------------------
Frontend (React) :
------------------
->  Component-Based Structure: The application is organized into reusable React components (TodoForm, TodoItem, TodoList) to enhance modularity and maintainability.
->  State Management: useState and useEffect hooks are used for managing local component state and handling side effects (like fetching data on mount).
->  API Service: While direct axios calls are used in App.js for simplicity, a dedicated API service layer would typically encapsulate API calls for better organization and error handling in larger applications.
->  User Feedback: Simple message banners are used to provide immediate feedback on operations (success/error).
->  Styling: Utilizes plain CSS files (.css) per component for encapsulated styling.

Backend (Node.js with Express):
-------------------------------
->  RESTful API Design: Follows REST principles for clear, predictable endpoints (GET /todos, POST /todos, PUT /todos/:id, DELETE /todos/:id, POST /todos/summarize).
->  Separation of Concerns:
       -> server.js: Main entry point, sets up Express app, middleware, and routes.
       -> config/db.js: Handles database connection and initial table creation, isolating database logic.
       -> controllers/todoController.js: Contains the business logic for handling HTTP requests related to todos, interacting with the database and external services.
       -> routes/todoRoutes.js: Defines the API routes and maps them to controller functions.
       -> utils/llmService.js: Encapsulates logic for interacting with the Gemini LLM API.
       -> utils/slackService.js: Encapsulates logic for sending messages to Slack.
->  Environment Variables: Uses dotenv to securely manage sensitive information (API keys, database credentials) outside of the codebase.
->  Error Handling: Basic error handling is implemented in controllers to catch common issues and return appropriate HTTP status codes and messages.
->  PostgreSQL: Chosen for its reliability, ACID compliance, and strong support for structured data, suitable for a to-do list application. The database schema is kept simple for this project (id, task, completed, created_at).

LLM Integration (Gemini) :
--------------------------
->  Dedicated Service: A llmService.js module handles all interactions with the Gemini API, making it easy to swap LLM providers if needed in the future.
->  Prompt Engineering: The prompt for the LLM is designed to be clear and concise, guiding the model to generate a meaningful summary of pending tasks. It specifically asks for a "concise and meaningful" summary focusing on "key actions and categories."
->  Handling No Pending Todos: The summarizeAndSendToSlack endpoint gracefully handles cases where there are no pending todos, sending an appropriate message to Slack instead of an empty summary.
 
Slack Integration :
-------------------
->  Incoming Webhooks: Chosen for its simplicity and effectiveness in posting messages to Slack channels without needing a full Slack App.
->  Dedicated Service: A slackService.js module centralizes Slack communication logic.
->  Clear Messaging: The Slack message is prefixed with "Todo Summary:" to provide context.

Hosting & Database Choices:
---------------------------
->  Local Development: Designed for easy local setup with local PostgreSQL.

Future Enhancements :
--------------------
User Authentication: Implement user login/registration to personalize todo lists.
Filtering/Sorting Todos: Add options to filter by completion status or sort by date/task.
More LLM Options: Allow users to select different LLMs (e.g., OpenAI, Anthropic).
Advanced Slack Formatting: Utilize Slack Blocks API for richer summary messages.
Notifications: Implement desktop notifications for task reminders or summary completion.
Testing: Add unit and integration tests for both frontend and backend.
Linter/Formatter: Integrate ESLint and Prettier for consistent code style.
