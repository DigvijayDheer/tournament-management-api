# Tournament Management API

This backend application provides an API for managing tournaments, rooms, and players. Below are the details on how to use the API and additional information about the application.

## API Endpoints:

### 1. Create a Tournament

- **Endpoint:** `POST /tournaments`
- **Request Body:**

  ```json
  {
    "name": "New Tournament"
  }
  ```

- **Response:**
  ```json
  {
    "message": "Tournament created successfully!",
    "tournament": {
      "id": "generated_tournament_id",
      "name": "New Tournament",
      "winner_name": "",
      "is_ended": false,
      "rooms": []
    }
  }
  ```

### 2. Add a Room to a Tournament

- **Endpoint:** `POST /tournaments/:tournamentId/rooms`
- **Request Body:**
  ```json
  {}
  ```
- **Response:**
  ```json
  {
    "message": "Room added successfully!",
    "room": {
      "roomId": "generated_room_id",
      "players": []
    }
  }
  ```

### 3. Add a Player to a Room

- **Endpoint:** `POST /tournaments/:tournamentId/rooms/:roomId/players`
- **Request Body:**
  ```json
  {
    "name": "New Player"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Player added successfully!",
    "player": {
      "id": "generated_player_id",
      "name": "New Player",
      "score": 0
    }
  }
  ```

### 4. End a Tournament

- **Endpoint:** `PUT /tournaments/:tournamentId/end`
- **Request Body:**
  ```json
  {}
  ```
- **Response:**
  ```json
  {
    "message": "Tournament ended successfully!",
    "winner": "Winner's Name"
  }
  ```

### 5. Get All Tournaments

- **Endpoint:** `GET /tournaments`
- **Response:** (Array of tournaments)

### 6. Get a Single Tournament

- **Endpoint:** `GET /tournaments/:tournamentId`
- **Response:** (Details of the specified tournament)

### 7. Delete a Room from a Tournament

- **Endpoint:** `DELETE /tournaments/:tournamentId/rooms/:roomId`
- **Response:**
  ```json
  {
    "message": "Room deleted successfully!"
  }
  ```

### 8. Delete a Player from a Room

- **Endpoint:** `DELETE /tournaments/:tournamentId/rooms/:roomId/players/:playerId`
- **Response:**
  ```json
  {
    "message": "Player deleted successfully!"
  }
  ```

### 9. Delete a Tournament

- **Endpoint:** `DELETE /tournaments/:tournamentId`
- **Response:**
  ```json
  {
    "message": "Tournament deleted successfully!"
  }
  ```

### 10. Update Player Score

- **Endpoint:** `PUT /tournaments/:tournamentId/rooms/:roomId/players/:playerId/score`
- **Request Body:**
  ```json
  {
    "score": 50
  }
  ```
- **Response:**
  ```json
  {
    "message": "Player score updated successfully!",
    "player": {
      "id": "player_id",
      "name": "Player Name",
      "score": 50
    }
  }
  ```

## Features:

1. **Tournament Creation:**

   - Create new tournaments with a name.

2. **Room Management:**

   - Add rooms to a tournament.

3. **Player Management:**

   - Add players to specific rooms in a tournament.

4. **Tournament Ending:**

   - End a tournament, calculate the winner, and mark it as ended.

5. **Room Deletion:**

   - Delete a room from a tournament.

6. **Player Deletion:**

   - Delete a player from a room in a tournament.

7. **Tournament Deletion:**

   - Delete an entire tournament.

8. **Player Score Update:**
   - Update the score of a player during the tournament.

---

## Postman API Tests:

### Test 1: Create a Tournament

**Request:**

- Method: POST
- URL: `http://localhost:5000/tournaments`
- Body (raw JSON):
  ```json
  {
    "name": "New Tournament"
  }
  ```

**Expected Response:**

- Status: 200 OK
- Body:
  ```json
  {
    "message": "Tournament created successfully!",
    "tournament": {
      "id": "generated_tournament_id",
      "name": "New Tournament",
      "winner_name": "",
      "is_ended": false,
      "rooms": []
    }
  }
  ```

### Test 2: Add a Room to a Tournament

**Request:**

- Method: POST
- URL: `http://localhost:5000/tournaments/:tournamentId/rooms`
- Replace `:tournamentId` with the actual tournament ID
- Body (raw JSON):
  ```json
  {}
  ```

**Expected Response:**

- Status: 200 OK
- Body:
  ```json
  {
    "message": "Room added successfully!",
    "room": {
      "roomId": "generated_room_id",
      "players": []
    }
  }
  ```

### Test 3: Add a Player to a Room

**Request:**

- Method: POST
- URL: `http://localhost:5000/tournaments/:tournamentId/rooms/:roomId/players`
- Replace `:tournamentId` and `:roomId` with the actual tournament ID and room ID
- Body (raw JSON):
  ```json
  {
    "name": "New Player"
  }
  ```

**Expected Response:**

- Status: 200 OK
- Body:
  ```json
  {
    "message": "Player added successfully!",
    "player": {
      "id": "generated_player_id",
      "name": "New Player",
      "score": 0
    }
  }
  ```

### Test 4: End a Tournament

**Request:**

- Method: PUT
- URL: `http://localhost:5000/tournaments/:tournamentId/end`
- Replace `:tournamentId` with the actual tournament ID
- Body (raw JSON):
  ```json
  {}
  ```

**Expected Response:**

- Status: 200 OK
- Body:
  ```json
  {
    "message": "Tournament ended successfully!",
    "winner": "Winner's Name"
  }
  ```

### Test 5: Get All Tournaments

**Request:**

- Method: GET
- URL: `http://localhost:5000/tournaments`

**Expected Response:**

- Status: 200 OK
- Body: (Array of tournaments)

### Test 6: Get a Single Tournament

**Request:**

- Method: GET
- URL: `http://localhost:5000/tournaments/:tournamentId`
- Replace `:tournamentId` with the actual tournament ID

**Expected Response:**

- Status: 200 OK
- Body: (Details of the specified tournament)

### Test 7: Delete a Room from a Tournament

**Request:**

- Method: DELETE
- URL: `http://localhost:5000/tournaments/:tournamentId/rooms/:roomId`
- Replace `:tournamentId` and `:roomId` with the actual tournament ID and room ID

**Expected Response:**

- Status: 200 OK
- Body:
  ```json
  {
    "message": "Room deleted successfully!"
  }
  ```

### Test 8: Delete a Player from a Room

**Request:**

- Method: DELETE
- URL: `http://localhost:5000/tournaments/:tournamentId/rooms/:roomId/players/:playerId`
- Replace `:tournamentId`, `:roomId`, and `:playerId` with the actual tournament ID, room ID, and player ID

**Expected Response:**

- Status: 200 OK
- Body:
  ```json
  {
    "message": "Player deleted successfully!"
  }
  ```

### Test 9: Delete a Tournament

**Request:**

- Method: DELETE
- URL: `http://localhost:5000/tournaments/:tournamentId`
- Replace `:tournamentId` with the actual tournament ID

**Expected Response:**

- Status: 200 OK
- Body:
  ```json
  {
    "message": "Tournament deleted successfully!"
  }
  ```

### Test 10: Update Player Score

**Request:**

- Method: PUT
- URL: `http://localhost:5000/tournaments/:tournamentId/rooms/:roomId/players/:playerId/score`
- Replace `:tournamentId`, `:roomId`, and `:playerId` with the actual tournament ID, room ID, and player ID
- Body (raw JSON):
  ```json
  {
    "score": 50
  }
  ```

**Expected Response:**

- Status: 200 OK
- Body:
  ```json
  {
    "message": "Player score updated successfully!",
    "player": {
      "id": "player_id",
      "name": "Player Name",
      "score": 50
    }
  }
  ```
