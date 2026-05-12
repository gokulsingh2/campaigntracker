# Campaign Tracker

A full-stack marketing campaign tracker built with Node.js, Express, MySQL, and vanilla HTML/CSS/JS. Deployed on Railway.

## Live Demo
https://web-production-ef9b1.up.railway.app/campaigntracker/login.html

## Features
- User registration and login with JWT authentication
- Create, edit, and delete marketing campaigns
- Campaign status (Active / Paused / Ended)
- Campaign date range (start and end dates)
- Click and conversion tracking
- Analytics dashboard with charts
- Protected routes — users only see their own data

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MySQL (hosted on Railway)
- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Auth:** JWT + bcrypt
- **Deployment:** Railway

## Environment Variables
Create these in your Railway project variables:

| Variable | Description |
|----------|-------------|
| `JWT_SECRET` | Secret key for JWT tokens |
| `MYSQLHOST` | MySQL host |
| `MYSQLUSER` | MySQL username |
| `MYSQLPASSWORD` | MySQL password |
| `MYSQLDATABASE` | Database name |
| `MYSQLPORT` | MySQL port |

## Database Schema
See `schema.sql` for the full database setup.

## Project Structure