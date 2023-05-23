<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" type="text/css" href="css/style_admin.css" />
  <title>Create Game</title>
  <script>
    function goToJSONInputForm() {
      const gameName = document.getElementById("game_name").value;
      if (gameName) {
        window.location.href =
          "addStep.php?game_name=" + encodeURIComponent(gameName);
      } else {
        alert("Please enter a game name");
      }
    }
  </script>
</head>

<body>
  <nav class="sidenav">
    <a href="#">Create Game</a>
    <br>
    <a href="addStep.php">Create Game Steps</a>
    <br>
    <a href="markers.php">AR Cloud</a>
  </nav>
  <main>
    <h2>Create a New Game</h2>
    <label for="game_name">Game Name:</label>
    <input type="text" id="game_name" name="game_name" />
    <button type="button" onclick="goToJSONInputForm()">Create</button>
    <br>
    <div id="message"></div>
    <br>
    <?php
    
    // Retrieve all JSON files from the "json/games" folder
    $gameFiles = glob("json/games/*.json");

    // List the file names below the Create button
    echo "<h3>Existing Games:</h3>";
    if (count($gameFiles) > 0) {
      echo "<ul>";
      // Display a list of games
      foreach ($gameFiles as $file) {
        $fileName = basename($file, ".json");
        $gameData = json_decode(file_get_contents($file), true);
        $gameStatus = $gameData['status'] ?? true;
        $name = explode('_', $fileName)[0];
        echo "<li>
        <span>$name</span>
        <button onclick=\"changeGameStatus('$fileName', $gameStatus)\">" .
      ($gameStatus ? "Disable" : "Enable") .
      "</button>
        <button onclick=\"deleteGame('$fileName')\">Delete</button>
      </li>";
      }

      echo "</ul>";
    } else {
      echo "No games found.";
    }

   
    ?>
  </main>

  <script>
    
    function changeGameStatus(gameName, currentStatus) {
      const messageDiv = document.getElementById("message");
      if (!confirm(`Are you sure you want to ${currentStatus ? "disable" : "enable"} the game "${gameName}"?`)) {
        return;
      }

      const xhr = new XMLHttpRequest();
      xhr.open('GET', `json/games/${gameName}.json`);
      xhr.onload = function() {
        if (xhr.status === 200) {
          const gameData = JSON.parse(xhr.responseText);
          gameData.gameName = gameName
          gameData.status = !currentStatus;
          const updatedGameData = JSON.stringify(gameData, null, 2);
          //console.log(updatedGameData);

          const xhr2 = new XMLHttpRequest();
          xhr2.open('POST', 'update_game.php');
          xhr2.setRequestHeader('Content-Type', 'application/json');
          xhr2.onload = function() {
            if (xhr2.status === 200) {
              messageDiv.innerHTML = `Game "${gameName}" has been ${currentStatus ? "disabled" : "enabled"}.`;
              //alert(`Game "${gameName}" has been ${currentStatus ? "disabled" : "enabled"}.`);
              window.location.reload();
            } else {
              //alert(`Error saving game "${gameName}"`);
            }
          };
          xhr2.send(updatedGameData);
        } else {
          alert(`Error loading game "${gameName}"`);
        }
      };
      xhr.send();
    }


   // Function to delete a game
   function deleteGame(fileName) {
    var confirmation = confirm("Are you sure you want to delete this game?");
    if (confirmation) {
      // Make an AJAX request to delete the game
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            // Game deleted successfully
            
            alert(xhr.responseText);
            window.location.reload();
          } else {
            // Error deleting the game
            alert("Error deleting the game.");
          }
        }
      };
      xhr.open("POST", "delete_game.php", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      fileName = fileName+ ".json";
      xhr.send("file=" + fileName);
    }
  }
  </script>

</body>

</html>