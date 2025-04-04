import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './CreateTournament.css';

const CreateTournament = ({ onTournamentAdded }) => {
  const [tournamentData, setTournamentData] = useState({
    name: "",
    game_id: "",
    start_date: "",
    end_date: "",
    members_per_match: "",
  });

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [logginUser, setLogginUser] = useState("");
  const [creatorId, setCreatorId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("LogginUser");
    setLogginUser(storedUsername);
    console.log(storedUsername);

    if (storedUsername) {
      axios
        .get(`http://localhost:5000/user-id/${storedUsername}`)
        .then((res) => setCreatorId(parseInt(res.data.id))
      )
        .catch((err) => console.error("Error fetching user ID:", err));
    }
  }, []);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get("http://localhost:5000/games");
        setGames(response.data);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };
    fetchGames();
  }, []);

  const handleChange = (e) => {
    setTournamentData({ ...tournamentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // creatr_id = parseInt(creater_id);

    const { name, game_id, start_date, end_date, members_per_match } = tournamentData;
    console.log("id is " , creatorId);
    if (!name || !game_id || !start_date || !end_date || !members_per_match || !creatorId) {
      alert("Please fill in all fields.");
      return;
    }

    const payload = {
      ...tournamentData,
      name: tournamentData.name.trim(),
      created_by: creatorId,
    };
    

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/tournaments/create", payload);
      alert("Tournament created successfully!");
      setTournamentData({
        name: "",
        game_id: "",
        start_date: "",
        end_date: "",
        members_per_match: "",
      });
      if (onTournamentAdded) onTournamentAdded(response.data);
    } catch (error) {
      console.error("Error creating tournament:", error);
      alert("Failed to create tournament.");
    }
    setLoading(false);
  };

  return (
    <div className="tournament-form-container">
      <h3>Create a New Tournament</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={tournamentData.name}
          onChange={handleChange}
          placeholder="Enter tournament name"
          maxLength="100"
          required
        />

        <select name="game_id" value={tournamentData.game_id} onChange={handleChange} required>
          <option value="">Select Game</option>
          {games.map((game) => (
            <option key={game.id} value={game.id}>
              {game.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="start_date"
          value={tournamentData.start_date}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="end_date"
          value={tournamentData.end_date}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="members_per_match"
          value={tournamentData.members_per_match}
          onChange={handleChange}
          placeholder="Enter members per match"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Tournament"}
        </button>
      </form>
    </div>
  );
};

export default CreateTournament;
