🎥 YouTube Clone (MERN Stack) - Capstone Project

Submitted by: Ankit Shukla
Tech Stack: MongoDB, Express.js, React (Vite), Node.js, Tailwind CSS




📋 Project Overview

This is a fully functional YouTube Clone developed as a Capstone Project. It replicates the core experience of YouTube, including video playback, channel management, comment interactions, and category exploration.

The application allows users to register, upload videos to their channel, manage their content (CRUD), and interact with other creators via comments and likes.



✅ Features Checklist (Per Requirements)


1. Front-End (React + Vite)

[x] Home Page: Responsive grid layout with Sidebar and Category Filters.

[x] Authentication: Google-styled Login/Register page with JWT integration.

[x] Video Player: - Playback support.

CRUD Operations: Users can Create, Read, Update, and Delete comments.

Like/Dislike and Subscribe functionality.

[x] Channel Page (Studio Mode):

Displays Channel Banner, Avatar, and Subscriber count.

CRUD Operations: Creators can Upload, Edit, and Delete their videos.

[x] Search & Filter: Real-time filtering by video title and category (e.g., Gaming, Music).



2. Back-End (Node.js + Express)

[x] ES Modules: Project uses import/export syntax throughout (No CommonJS).

[x] Architecture: Professional MVC pattern (Models, Views, Controllers).

[x] Database: MongoDB with relational schemas (User, Video, Comment).

[x] Seeding: Includes a seed.js script to populate the app with 50+ real videos and channels.




# Installation Guide

Prerequisites

Node.js (v16+)

MongoDB (Local or Atlas)

Step 1: Backend Setup

Navigate to the backend folder:

cd backend


Install dependencies:

npm install


CRITICAL: Seed the database with test data (Users, Videos, Comments):

npm run seed


Start the server:

npm start


Server runs on port 5000.

Step 2: Frontend Setup

Open a new terminal and navigate to the root (or frontend) folder:

# If in root:
npm install


Start the React app:

npm run dev


Open the link displayed (e.g., http://localhost:5173).




Testing Instructions-

To verify all CRUD requirements, please follow these steps:

Login:

Click Sign In (Top Right).

Use the pre-seeded admin account:

Email: tech@youtube.com

Password: hashedpassword123

Or register a new account (Username is required).

Test Channel CRUD (Requirement: Manage Videos):

Go to My Channel via the Sidebar.

Click "Manage Videos" or "Create".

Create: Upload a video.

Update: Click the Edit (Pencil) icon to change title/description.

Delete: Click the Trash icon to remove the video.

Test Comment CRUD (Requirement: Video Player):

Click on any video from the Home Page.

Create: Type a comment and click "Comment".

Update: Click "Edit" on your comment, change text, and Save.

Delete: Click "Delete" to remove your comment.

Test Customization:

On your Channel page, click "Customize Channel".

You can update your Avatar, Banner URL, and Channel Name.





GITHUB link- https://github.com/Ankitshukla90/youtube-clone

GITHUB Clone- https://github.com/Ankitshukla90/youtube-clone.git
