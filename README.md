# 🎮 eSports Tournament Management System

A web-based system to manage eSports tournaments, including player registration, match scheduling, result tracking, and dynamic ranking updates.

---

## 📌 Features

### 👤 Player Features
- View upcoming tournaments
- Register for available tournaments
- See registered tournaments
- View scheduled matches and results
- Check global player rankings

### 👑 Admin Features
- Create, view, delete tournaments
- View registered players per tournament
- Schedule matches between players
- Record match results and update player ranks
- Change tournament status (Upcoming → Ongoing → Completed)

---

## 🛠️ Tech Stack

| Layer      | Technology      |
|------------|-----------------|
| Frontend   | HTML, CSS, JavaScript / React.js |
| Backend    | Node.js / Express.js |
| Database   | PostgreSQL      |

---

## 🗄️ Database Schema

### `Players`
| Column   | Type       |
|----------|------------|
| ID       | SERIAL PK  |
| Name     | VARCHAR    |
| Rank     | INTEGER    |
| TeamID   | INTEGER (optional) |

### `Tournaments`
| Column   | Type       |
|----------|------------|
| ID       | SERIAL PK  |
| Name     | VARCHAR    |
| GameID   | INTEGER FK |
| Date     | DATE       |
| Status   | ENUM('Upcoming', 'Ongoing', 'Completed') |

### `Matches`
| Column     | Type       |
|------------|------------|
| ID         | SERIAL PK  |
| TournamentID | INTEGER FK |
| Player1ID  | INTEGER FK |
| Player2ID  | INTEGER FK |
| WinnerID   | INTEGER FK |
| Score      | VARCHAR    |

### `Registrations`
| Column     | Type       |
|------------|------------|
| PlayerID   | INTEGER FK |
| TournamentID | INTEGER FK |
| Primary Key | (PlayerID, TournamentID) |

### `Games` 
| Column | Type      |
|--------|-----------|
| ID     | SERIAL PK |
| Name   | VARCHAR   |

---

## 🚀 How to Run the Project

1. **Clone the Repository**
```bash
git clone https://github.com/your-username/esports-tournament-manager.git
cd esports-tournament-manager
