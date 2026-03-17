# Startup Ideas Dashboard - Backend

## System Design

### Tech Stack
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** SQLite3 (persistent file-based storage)
- **Auth:** JWT tokens + bcryptjs password hashing

### Database Schema

**`users` table**
| Column | Type | Notes |
|---|---|---|
| id | TEXT | UUID primary key |
| username | TEXT | Unique |
| password | TEXT | bcrypt hashed |
| createdAt | TEXT | ISO timestamp |

**`ideas` table**
| Column | Type | Notes |
|---|---|---|
| id | TEXT | UUID primary key |
| title | TEXT | Required |
| description | TEXT | Required |
| problem | TEXT | Required |
| category | TEXT | Required |
| difficulty | INTEGER | 1-5 |
| market | TEXT | Very Low / Low / Medium / High / Very High |
| votes | INTEGER | Upvote count |
| userId | TEXT | Foreign key → users.id |
| visibility | TEXT | `active` or `hidden` |
| expiryDate | TEXT | Optional ISO timestamp |
| viewCount | INTEGER | Auto-incremented on view |
| createdAt | TEXT | ISO timestamp |
| updatedAt | TEXT | ISO timestamp |

### API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | No | Register user |
| POST | /api/auth/login | No | Login, returns JWT |
| POST | /api/auth/logout | Yes | Invalidates token |
| GET | /api/ideas | Optional | List active ideas (ranked) |
| GET | /api/ideas/archived | Optional | List expired ideas |
| GET | /api/ideas/:id | No | View idea (increments viewCount) |
| POST | /api/ideas | Yes | Create idea |
| PUT | /api/ideas/:id | Yes | Edit idea (owner only) |
| DELETE | /api/ideas/:id | Yes | Delete idea (owner only) |
| PATCH | /api/ideas/:id/vote | No | Upvote idea |

### Ranking Formula
```
Score = (Market Potential × 2) + Difficulty Score + Upvotes
```
Market is mapped: Very High=5, High=4, Medium=3, Low=2, Very Low=1.

### Feature Summary
1. **Visibility:** Active/Hidden status per idea
2. **Edit:** Owner-only editing of title, problem, category, difficulty, market
3. **Expiry:** Optional review duration; expired ideas move to Archived
4. **Popularity:** viewCount incremented on each view
5. **Timestamps:** createdAt and updatedAt tracked and displayed
6. **Upvotes:** Public upvoting with vote count display
7. **Ranking:** Score-based trending with the formula above
8. **Persistence:** SQLite database survives restarts
9. **Auth:** Register, Login, Logout with JWT protection

### Default Test Account
- **Username:** `admin`
- **Password:** `password123`
