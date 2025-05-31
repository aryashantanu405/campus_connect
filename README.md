# UNIFY – Campus Community & Utility Platform 🚀

**UNIFY** is a full-stack web application designed to unify and streamline all major student interactions across a college campus — from posting lost/found items, engaging with communities, viewing leaderboards, to connecting with seniors and participating in fun campus challenges.

---

## 🔥 Key Features

### 🧩 Lost & Found Section
- Floating button to create new Lost/Found posts
- Upload image, enter description, location, and date
- Toggle between "Lost" and "Found"
- Dynamic cards (Red for Lost, Green for Found)
- Claim button for each item
- Posts stored with user reference in MongoDB

### 🧑‍🤝‍🧑 Community Page
- Open social-like feed for students to share posts
- Floating post button for new image/text-based posts
- Like, comment, and interact with peer posts
- Posts saved with likes, comments, timestamp, and media

### 🧓 Senior Connect
- Dedicated section to reach out to seniors
- Ask questions about courses, placements, internships
- Seniors can respond publicly or via private replies
- Builds mentorship and collaborative culture across batches

### 🎯 Fun Challenges
- Weekly/monthly interactive campus-wide challenges
- Users can post entries, vote, and comment
- Top voted entries are highlighted on Leaderboard
- Categories like photography, meme-making, hacks, quizzes, etc.

### 🏆 Leaderboard
- Ranked user list based on contribution points
- Dynamic highlighting of Top 3 users with badges 🥇🥈🥉
- Avatars, usernames, departments, and points displayed
- Clean, responsive UI for all devices

### 📅 Event & Club System (Planned)
- Discover clubs, join communities
- RSVP and view event updates
- Participate and track activity

---

## 🧰 Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** Clerk/Auth provider (planned)
- **Image Handling:** Upload/Cloud Links
- **Deployment:** Vercel / Render (TBD)

---

## 📁 Folder Structure

```bash
/unify
  ├── app/
  │   ├── lost-found/
  │   ├── community/
  │   ├── leaderboards/
  │   ├── senior-connect/
  │   ├── fun-challenges/
  │   └── ...
  ├── lib/
  │   ├── connectDb.js
  │   ├── items.model.js
  │   ├── posts.model.js
  │   └── ...
  ├── public/
  └── ...
