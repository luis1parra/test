<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="css/style_admin.css">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://unpkg.com/@popperjs/core@2.11.6/dist/umd/popper.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.2/dist/js/bootstrap.bundle.min.js"></script>



    <script>
        $(document).ready(function() {
            $('[data-toggle="tooltip"]').tooltip();
        });
    </script>

    <title>Add Steps</title>

</head>

<body>
    <nav class="sidenav">
        <a href="createGames.php">Create Game</a>
        <br>
        <a href="#">Create Game Steps</a>
        <br>
        <a href="markers.php">AR Cloud</a>
    </nav>
    <main>
        <label for="json_select" class="label-with-icon" data-toggle="tooltip" data-placement="top" title="Select a game to edit from the ones previously created">Select Game:
            <i class="fas fa-info-circle"></i>
        </label>
        <select id="json_select" name="json_select">

            <?php
            $jsonFiles = glob('json/games/*.json');
            foreach ($jsonFiles as $file) {
                $fileName = basename($file);
                $gameName = explode('_', $fileName)[0];
                $fileNameWithoutExtension = pathinfo($fileName, PATHINFO_FILENAME);
                echo '<option value="' . $fileName . '" data-game="' . $gameName . '">' . $fileNameWithoutExtension . '</option>';
            }
            ?>
        </select>
        <br>
        <h1 id="game_name_display"></h1>
        <script>
            const urlParams = new URLSearchParams(window.location.search);
            let gameName = "";
            gameName = urlParams.get('game_name');
            document.getElementById('game_name_display').innerText = gameName;
        </script>

        <label for="accusation" class="label-with-icon" data-toggle="tooltip" data-placement="top" title="If you have previously uploaded an accusation, please provide the URL, if not, leave it empty">Accusation URL:
            <i class="fas fa-info-circle"></i>
        </label>
        <input type="text" id="accusation_url" name="accusation"><br><br>

        <button type="button" id="accusation_button" onclick="addAccusation(this, false)" class="label-with-icon" data-toggle="tooltip" data-placement="top" title="Open the accusation form to enter the Who, Where, Why and What of the murder">Show Accusation Form
            <i class="fas fa-info-circle"></i>
        </button><br>
        <div id="message_confirmation"></div>

        <hr>

        <button type="button" id="create_step_button" onclick="createStep()">New Step</button>

        <div class="container">

            <form id="json_input_form" style="display: none;">

                <fieldset id="intro_popup_fieldset">
                    <legend>Step Intro Popup</legend>

                    <label for="title" class="label-with-icon" data-toggle="tooltip" data-placement="top" title="Enter the title for the step">Title of the step:
                        <i class="fas fa-info-circle"></i>
                    </label>
                    <input type="text" id="title" name="title"><br>
                    <label for="has_popup" class="label-with-icon" title="Enable/disable intro popup" data-toggle="tooltip" data-placement="top">Has Popup:
                        <i class="fas fa-info-circle"></i>
                    </label>
                    <input type="checkbox" id="has_popup" name="has_popup"><br>

                    <label for="message" class="label-with-icon" data-toggle="tooltip" data-placement="top" title="Enter the message for the popup">Message:
                        <i class="fas fa-info-circle"></i>
                    </label>
                    <textarea type="text" id="message" name="message"></textarea><br>
                    <label for="time_to_delete" class="label-with-icon" data-toggle="tooltip" data-placement="top" title="Enter the time in seconds for the popup to disappear">Time to Disappear:
                        <i class="fas fa-info-circle"></i>
                    </label>
                    <input type="number" id="time_to_delete" name="time_to_delete"><br>

                </fieldset>


                <fieldset id="narrative_text_fieldset">
                    <legend>Narrative Text</legend>

                    <label for="has_narrative_text" class="label-with-icon" data-toggle="tooltip" data-placement="top" title="Enable/disable narrative text">Has Narrative Text:
                        <i class="fas fa-info-circle"></i>
                    </label>
                    <input type="checkbox" id="has_narrative_text" name="has_narrative_text"><br>
                    <label for="text" class="label-with-icon" data-toggle="tooltip" data-placement="top" title="Enter the message for the narrative text">Text:
                        <i class="fas fa-info-circle"></i>
                    </label>
                    <textarea id="text" name="text"></textarea><br>
                </fieldset>

                <fieldset id="characters_fieldset">
                    <legend>Character Conversation</legend>

                    <label for="has_character" class="label-with-icon" data-toggle="tooltip" data-placement="top" title="Enable/disable character conversation">Has Character:
                        <i class="fas fa-info-circle"></i>
                    </label>
                    <input type="checkbox" id="has_character" name="has_character"><br>
                    <label for="character_id" class="label-with-icon" data-toggle="tooltip" data-placement="top" title="Select the character to have the conversation with">Character:
                        <i class="fas fa-info-circle"></i>
                    </label>
                    <select id="character_select" name="character">
                    </select>
                    <br>
                    <label for="conversation_url" class="label-with-icon" data-toggle="tooltip" data-placement="top" title="If you have previously uploaded a conversation, please provide the URL, if not, leave it empty">Conversation URL:
                        <i class="fas fa-info-circle"></i>
                    </label>
                    <input type="url" id="conversation_url" name="conversation_url"><br>
                    <label for="conversation_json" class="label-with-icon" data-toggle="tooltip" data-placement="top" title="Please upload the conversation in the indicated JSON format">Upload conversation in JSON format:
                        <i class="fas fa-info-circle"></i>
                    </label>
                    <input type="file" id="conversation_json" name="conversation_json"><br>
                    <button type="button" onclick="saveConversation()">Save Conversation</button><br>
                    <button type="button" class="label-with-icon" data-toggle="tooltip" data-placement="top" title="You will be redirected to a new window where you can visualize the conversation, in it you will be able to move around each segment and see where each option leads to" id="preview_button">Preview Conversation
                        <i class="fas fa-info-circle"></i>
                    </button>

                </fieldset>

                <fieldset id="ar_interaction_fieldset">
                    <legend>AR Interaction</legend>

                    <label for="has_ar_interaction" class="label-with-icon" data-toggle="tooltip" data-placement="top" title="Enable/disable AR interaction">Has AR Interaction:
                        <i class="fas fa-info-circle"></i>
                    </label>
                    <input type="checkbox" id="has_ar_interaction" name="has_ar_interaction"><br>
                    <label for="id_ar" class="label-with-icon" data-toggle="tooltip" data-placement="left" title="Select the type of AR interaction: 1) Image recognition: The app will read an image and display the one you upload. 2) Combine: you can read two images at the same time to make a new one appear when they are close to each other. 3) I/R Button: same as the first but the player has to tap on the image that appears on the AR to move forward. 4) Count Down Clock: Will show a clock ticking down to zero when the AR marker is read. 5) Digital Puzzle: Will activate the cable puzzle when the AR marker is read.">AR Type:
                        <i class="fas fa-info-circle"></i>
                    </label>
                    <select id="id_ar" name="id_ar"></select><br>

                    <div id="markers_container">
                        <fieldset id="marker_fieldset">
                            <legend>Markers</legend>
                            <div id="markerDiv1">


                                <label for="marker_name" class="label-with-icon" data-toggle="tooltip" data-placement="top" title="Select the image from the AR cloud you want the AR to recognize">Marker 1 Name:
                                    <i class="fas fa-info-circle"></i>
                                </label>

                                <select id="marker_name" name="marker_name">

                                    <?php
                                    include_once 'target-details.php';
                                    // Get all targets from the Cloud Database
                                    $targets = [];
                                    $targets = setTargetsArray();
                                    ?>


                                    <option value="">Select a target</option>
                                    <?php
                                    // Populate the "Marker Name" dropdown with the target names
                                    foreach ($targets as $target_select) {

                                    ?>
                                        <option value="<?php echo $target_select->target_record->target_id; ?>"><?php echo $target_select->target_record->name; ?></option>
                                    <?php } ?>
                                </select>


                                <br>
                                <label for="marker_image" class="label-with-icon" data-toggle="tooltip" data-placement="left" title="When the app recognizes the AR Marker it will show this image on top of it, the image has to be square, you can position the art elements to show within the image space and you can upload either .png of .jpg">Image to show with AR:
                                    <i class="fas fa-info-circle"></i>
                                </label>
                                <input type="file" id="marker_image" name="marker_image" onchange="handleFileInputChange(this)">

                                <img id="image_marker_preview" src="" width="200" height="200" style="display: none;">
                                <br>


                            </div>

                            <div id="markerDiv2">


                                <label for="marker_name2" class="label-with-icon" data-toggle="tooltip" data-placement="top" title="Select the image from the AR cloud you want the AR to recognize">Marker 2 Name:
                                    <i class="fas fa-info-circle"></i>
                                </label>

                                <select id="marker_name2" name="marker_name2">

                                    <?php
                                    include_once 'target-details.php';
                                    // Get all targets from the Cloud Database
                                    $targets = [];
                                    $targets = setTargetsArray();
                                    ?>


                                    <option value="">Select a target</option>
                                    <?php
                                    // Populate the "Marker Name" dropdown with the target names
                                    foreach ($targets as $target_select) {

                                    ?>
                                        <option value="<?php echo $target_select->target_record->target_id; ?>"><?php echo $target_select->target_record->name; ?></option>
                                    <?php } ?>
                                </select>


                                <br>
                                <label for="marker_image2" class="label-with-icon" data-toggle="tooltip" data-placement="left" title="When the app recognizes the AR Marker it will show this image on top of it, the image has to be square, you can position the art elements to show within the image space and you can upload either .png of .jpg. This image combine/put next to the previous one will trigger the action of the two markers combined">Image to show with AR:
                                    <i class="fas fa-info-circle"></i>
                                </label>
                                <input type="file" id="marker_image2" name="marker_image2" onchange="handleFileInputChange(this)">

                                <img id="image_marker_preview2" src="" width="200" height="200" style="display: none;">
                                <br>


                            </div>



                            <label for="ar_hint_image" class="label-with-icon" data-toggle="tooltip" data-placement="top" title="This image will appear on screen to help player know what marker to look for to trigger the AR, you can upload either .png of .jpg">AR Hint URL:
                                <i class="fas fa-info-circle"></i>
                            </label>
                            <input type="file" id="ar_hint_image" name="ar_hint_image" onchange="handleFileInputChange(this)">
                            <img id="image_hint_preview" src="" width="200" height="200" style="display: none;">
                        </fieldset>

                    </div>

                    <br>
                    <label for="sound_id" class="label-with-icon" data-toggle="tooltip" data-placement="top" title="The app will play this sounds effect when the AR is triggered, you can listen to the selected sound effect with the buttons below the dropdown menu">Sound Effect AR Reading:
                        <i class="fas fa-info-circle"></i>
                    </label>
                    <select id="sound_id" name="sound_id"></select><br>
                    <button id="play_button" type="button">Play Sound</button>
                    <button id="stop_button" onclick="stopCurrentAudio()" type="button">Stop Sound</button><br>
                </fieldset>

                <fieldset id="popup_next_fieldset">
                    <legend>Popup Next Step</legend>

                    <label for="delayed_time" class="label-with-icon" data-toggle="tooltip" data-placement="top" title="This popup will display a final message for the player and a button to proceed. It can be triggered by time or an action based on the AR interaction:

                        1) Image Recognition: Message appears after reading the image; timer starts.
                        2) I/R Button: Message appears when player taps the AR image.
                        3) Combine: Message appears after combining images; timer starts.
                        4) Digital Puzzle: Popup appears after completing the puzzle.
                        5) Countdown Clock: Timer counts down based on specified time.
                        6) No AR: Timer starts after closing the narrative text UI for the first time.">Time for poopup to appear (seconds):
                        <i class="fas fa-info-circle"></i>
                    </label>
                    <input type="number" id="delayed_time" name="delayed_time"><br>
                    <label for="progress_action" class="label-with-icon" data-toggle="tooltip" data-placement="top" title="Enter a final message for the player before moving to the next step or indicate if a conversation or accusation needs or could happen before moving on.">Popup text:
                        <i class="fas fa-info-circle"></i>
                    </label>
                    <textarea type="text" id="progress_action" name="progress_action"></textarea><br>

                </fieldset>
                <br>


                <button type="button" id="save_button">Save Step</button>
            </form>

            <div>
                <button type="button" id="save_json" class="label-with-icon" data-toggle="tooltip" data-placement="top" title="After creating all the game steps and making an accusation in the form above this area, you can save your game here.">Save Game
                    <i class="fas fa-info-circle"></i>
                </button>
                <div id="output"></div>

                <fieldset id="steps_fieldset">
                    <legend>Game Steps List</legend>
                    <div class="steps-list" id="steps_list">


                    </div>
                </fieldset>
            </div>
        </div>
    </main>
    <script>
        let stepsData = {
            accusation: "",
            steps: []
        };
        let editingStepIndex = null;

        function validateGameCreated() {

            if (gameName === "" || gameName === null) {

                document.getElementById('create_step_button').style.display = "none";
            }

            document.getElementById('save_json').style.display = "none";
        }
        validateGameCreated();

        function loadSteps() {
            var selectElement = document.getElementById('json_select');
            var selectedFile = selectElement.value;
            var selectedGame = selectElement.options[selectElement.selectedIndex].getAttribute('data-game');

            // Make an AJAX request to retrieve the JSON file
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        clearSteps();
                        stepsData = JSON.parse(xhr.responseText);
                        stepsData.edit = true;
                        gameName = selectedFile;
                        displaySteps(stepsData.steps);
                    } else {
                        console.error('Error loading JSON file:', xhr.status);
                    }
                }
            };
            xhr.open('GET', 'json/games/' + selectedFile, true);
            xhr.send();
        }

        function displaySteps(steps) {


            createStep();
            steps.forEach(function(stepData, index) {

                //stepsData.steps.push(JSON.parse(JSON.stringify(stepData)));
                addStepItem(stepData, index);

            });

        }

        var jsonFileSelect = document.getElementById('json_select');
        jsonFileSelect.addEventListener('change', loadSteps);

        function clearSteps() {
            const stepsList = document.getElementById('steps_list');
            while (stepsList.firstChild) {
                if (stepsList.firstChild.id !== 'output' && stepsList.firstChild.id !== 'save_json') {
                    //&& stepsList.firstChild.id !== 'steps_fieldset'
                    stepsList.removeChild(stepsList.firstChild);
                }
            }

        }

        function clearFormFields() {
            document.getElementById('output').innerHTML = "";
            const form = document.getElementById("json_input_form");
            form.reset();

            fileData = {
                marker_image: null,
                marker_image2: null,
                ar_hint_image: null
            };

            removeMarkerFields();

            const imgElementMarker = document.getElementById('image_marker_preview');
            imgElementMarker.setAttribute('src', '');
            imgElementMarker.setAttribute('style', 'display: none;');

            const imgElementMarker2 = document.getElementById('image_marker_preview2');
            imgElementMarker2.setAttribute('src', '');
            imgElementMarker2.setAttribute('style', 'display: none;');

            const imgElementHint = document.getElementById('image_hint_preview');
            imgElementHint.setAttribute('src', '');
            imgElementHint.setAttribute('style', 'display: none;');


        }

        function createStep() {
            // Create a step and display the form
            document.getElementById('create_step_button').style.display = "block";

            const form = document.getElementById("json_input_form");
            form.style.display = "block";
            editingStepIndex = null;
            clearFormFields();
        }



        const charactersUrl = 'json/characters.json';
        let charactersData = [];

        function loadCharacters() {
            fetch(charactersUrl)
                .then(response => response.json())
                .then(data => {
                    charactersData = data.characters;
                    const characterSelect = document.getElementById('character_select');
                    charactersData.forEach(character => {
                        const option = document.createElement('option');
                        option.value = character.id;
                        option.text = character.name;
                        characterSelect.appendChild(option);
                    });
                })
                .catch(error => console.error('Error loading characters:', error));
        }

        loadCharacters();

        const interactionsUrl = 'json/ar_interactions.json';
        let interactionsData;


        function loadInteractions() {
            document.getElementById('markerDiv2').style.display = "none";

            fetch(interactionsUrl)
                .then(response => response.json())
                .then(data => {

                    interactionsData = data.interactions;
                    const idArSelect = document.getElementById('id_ar');
                    interactionsData.forEach(interaction => {

                        const option = document.createElement('option');
                        option.value = interaction.id;
                        option.text = interaction.name;
                        if (interaction.id === 3) option.style.display = "none";
                        idArSelect.appendChild(option);


                    });
                })
                .catch(error => console.error('Error loading interactions:', error));
        }

        loadInteractions();


        function saveConversation() {
            // Get the conversation JSON file input
            const conversationJsonInput = document.getElementById("conversation_json");

            // Check if a file was selected
            if (conversationJsonInput.files.length > 0) {
                const file = conversationJsonInput.files[0];
                const reader = new FileReader();

                // Read the selected file
                reader.readAsText(file);

                // When the file is loaded, send the JSON to the server
                reader.onload = function(event) {
                    const jsonData = event.target.result;

                    // Create a new XMLHttpRequest object
                    const xhr = new XMLHttpRequest();
                    xhr.open("POST", "save_conversation.php", true);
                    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

                    // When the server response is received, update the conversation URL input
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                            const response = JSON.parse(xhr.responseText);
                            if (response.status === "success") {
                                const conversationUrlInput = document.getElementById("conversation_url");
                                conversationUrlInput.value = response.url;
                            } else {
                                alert("Error saving conversation JSON.");
                            }
                        }
                    };

                    // Send the JSON data to the server
                    xhr.send(jsonData);
                };
            } else {
                alert("Please select a conversation JSON file.");
            }
        }

        function openVisualizationWindow() {
            // Get the conversation URL value
            const conversationUrl = document.getElementById('conversation_url').value;

            // Construct the URL for the visualization page
            const visualizationUrl = `https://www.pressstartevolution.com/hasbro/clue_live/admin/conversation_visualization.html?url=${encodeURIComponent(conversationUrl)}`;

            // Open the visualization page in a new window
            window.open(visualizationUrl);
        }

        // Get the preview button element
        const previewButton = document.getElementById('preview_button');

        // Add event listener to the button
        previewButton.addEventListener('click', openVisualizationWindow);



        const idArSelect = document.getElementById('id_ar');
        const markerFieldset = document.getElementById('marker_fieldset');
        const markersContainer = document.getElementById('markers_container');

        idArSelect.addEventListener('change', (event) => {
            const selectedIdAr = parseInt(event.target.value);

            if (selectedIdAr === 2) {
                addMarkerFields();
            } else {

                removeMarkerFields();
            }
        });

        function addMarkerFields() {

            isCombined = true;
            document.getElementById('markerDiv2').style.display = "block";
        }


        function removeMarkerFields() {
            isCombined = false;
            const markerDiv2 = document.getElementById('markerDiv2');
            markerDiv2.style.display = "none";

        }

        document.getElementById('marker_image').addEventListener('change', handleFileInputChange);
        document.getElementById('marker_image2').addEventListener('change', handleFileInputChange);
        document.getElementById('ar_hint_image').addEventListener('change', handleFileInputChange);

        let isCombined = false;
        let fileData = {
            marker_image: null,
            marker_image2: null,
            ar_hint_image: null
        };

        function handleFileInputChange(input) {

            if (input.files && input.files.length > 0) {
                const file = input.files[0];
                const reader = new FileReader();
                reader.onload = function(e) {
                    const imageMarkerPreview = document.getElementById('image_marker_preview');
                    const imageMarkerPreview2 = document.getElementById('image_marker_preview2');
                    const imageHintPreview = document.getElementById('image_hint_preview');

                    // Update fileData object with new file
                    if (input.id === 'marker_image') {
                        imageMarkerPreview.src = e.target.result;
                        imageMarkerPreview.style.display = 'block';

                        fileData.marker_image = {
                            name: file.name,
                            data: e.target.result,
                        };
                    } else if (input.id === 'marker_image2') {
                        imageMarkerPreview2.src = e.target.result;
                        imageMarkerPreview2.style.display = 'block';

                        fileData.marker_image2 = {
                            name: file.name,
                            data: e.target.result,
                        };
                    } else if (input.id === 'ar_hint_image') {
                        imageHintPreview.src = e.target.result;
                        imageHintPreview.style.display = 'block';

                        fileData.ar_hint_image = {
                            name: file.name,
                            data: e.target.result,
                        };
                    }
                };
                reader.readAsDataURL(file);
            }
        }


        const soundsUrl = 'json/sounds.json';
        let soundsData = [];

        let currentAudio = null;

        function stopCurrentAudio() {
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }
        }

        function setupSoundPlayer() {
            // Get the elements
            const soundDropdown = document.getElementById('sound_id');
            const playButton = document.getElementById('play_button');

            // Add event listener to the play button
            playButton.addEventListener('click', function() {
                const selectedOption = soundDropdown.options[soundDropdown.selectedIndex];
                const selectedSound = "music/sound_effects/" + selectedOption.text + ".mp3";

                stopCurrentAudio(); // Stop the current audio before playing a new one

                if (selectedSound) {
                    const audio = new Audio(selectedSound);
                    audio.play();
                    currentAudio = audio; // Update the current audio reference
                }
            });
        }

        window.addEventListener('DOMContentLoaded', setupSoundPlayer);

        function loadSounds() {
            fetch(soundsUrl)
                .then(response => response.json())
                .then(data => {
                    soundsData = data.sounds;
                    const soundSelect = document.getElementById('sound_id');
                    soundsData.forEach(sound => {
                        const option = document.createElement('option');
                        option.value = sound.id;
                        option.text = sound.name;
                        soundSelect.appendChild(option);
                    });
                })
                .catch(error => console.error('Error loading sounds:', error));
        }


        loadSounds();


        function addStepItem(stepData, index) {



            const stepsList = document.getElementById('steps_list');
            const stepItem = document.createElement('div');
            stepItem.setAttribute('data-index', index);
            stepItem.innerText = `Step ${index + 1}: ${stepData.popup.title || ''}`;

            const editButton = document.createElement('button');
            editButton.innerText = 'Edit';
            editButton.onclick = (function(i) {
                return function() {
                    editStep(i);
                };
            })(index);

            stepItem.appendChild(editButton);
            stepsList.appendChild(stepItem);

            if (stepsData.steps.length > 0) document.getElementById('save_json').style.display = "block";
        }

        function addAccusation(buttonAccusation, isEdit) {

            const accusationUrl_input = document.getElementById("accusation_url");
            const messageDiv = document.getElementById("message_confirmation");

            if (isEdit && buttonAccusation.innerHTML == "Hide Accusation Form") buttonAccusation.innerHTML = "Show Accusation Form";

            if (buttonAccusation.innerHTML === "Hide Accusation Form") {
                document.getElementById("accusation-content").style.display = "none";
                buttonAccusation.innerHTML = "Show Accusation Form";
            } else {

                buttonAccusation.innerHTML = "Hide Accusation Form";

                // Hide accusation URL input field
                //document.getElementById("accusation_url").style.display = "none";

                if (document.getElementById("accusation-content") === null) {
                    // Create a new div for accusation
                    const accusationDiv = document.createElement("div");
                    accusationDiv.innerHTML = `
      <h2>Accusation Form</h2>
      <div id="accusation-content"></div>
    `;

                    // Insert the new div after the accusation URL input element
                    //const accusationUrlElement = document.getElementById("accusation_url");
                    accusationUrl_input.insertAdjacentElement("afterend", accusationDiv);

                    // Load the accusation.php file inside the accusation-content div
                    const accusationContentDiv = document.getElementById("accusation-content");
                    accusationContentDiv.innerHTML = '<object type="text/html" data="accusation.php"></object>';

                    // get the parent width and height
                    const parentWidth = accusationContentDiv.clientWidth;
                    const parentHeight = accusationContentDiv.clientHeight;

                    // set the width and height of the object element to the parent width and height
                    const objectElement = accusationContentDiv.querySelector("object");
                    objectElement.style.width = `${parentWidth}px`;
                    objectElement.style.height = `${parentHeight}px`;

                } else document.getElementById("accusation-content").style.display = "block";


                messageDiv.innerHTML = "Waiting for accusation details!";
                //Send accusation Url to accusation form
                if (isEdit) {
                    const accusationFrame = document.querySelector('#accusation-content object');
                    const messageData = {
                        action: 'edit',
                        accusationUrl: stepsData.accusation,
                    };
                    accusationFrame.contentWindow.postMessage(messageData, '*');
                }
                // Add message listener to the window
                window.addEventListener('message', function(event) {
                    // Check if the message type is 'accusationUrl'
                    alert("Accusation received", event.data.value);
                    if (event.data.type === 'accusationUrl') {
                        // Set the stepsData.accusation variable to the accusationUrl value
                        stepsData.accusation = event.data.value;
                        accusationUrl_input.value = stepsData.accusation;
                        // Display a confirmation message to the user
                        messageDiv.innerHTML = "Accusation received";


                    }
                }, false);
            }
        }

        function validateImages(stepData) {
            let has_images = true;

            if (stepData.ar_interaction.has_ar_interaction) {

                if (stepData.ar_interaction.id_ar == "0") {
                    alert("Please select an AR interaction.");
                    has_images = false;
                } else if (stepData.ar_interaction.markers[0].name == "Select a target") {
                    alert("Please select an AR Target for Marker 1.");
                    has_images = false;

                } else if (stepData.ar_interaction.markers[0].url.toLowerCase().endsWith('.php')) {
                    alert("Please upload an image for marker 1.");
                    has_images = false;
                } else if (isCombined && stepData.ar_interaction.markers[1].name == "Select a target") {
                    alert("Please select an AR Target for Marker 2.");
                    has_images = false;

                } else if (isCombined && stepData.ar_interaction.markers[1].url.toLowerCase().endsWith('.php')) {
                    alert("Please upload an image for marker 2.");
                    has_images = false;
                } else if (stepData.ar_interaction.ar_hint_url.toLowerCase().endsWith('.php')) {
                    alert("Please upload an image for AR Hint.");
                    has_images = false;
                }

            }

            return has_images;
        }

        function validateConversation(stepData) {
            let has_conversation = true;
            if (stepData.character.has_character && stepData.character.conversation_url === "") {
                alert("Please upload an conversation.");
                has_conversation = false;
            }

            return has_conversation;
        }

        function addStepToList() {


            const stepData = {
                popup: {
                    has_popup: document.getElementById("has_popup").checked,
                    title: document.getElementById("title").value,
                    message: document.getElementById("message").value,
                    time_to_delete: document.getElementById("time_to_delete").value,
                },
                narrative_text: {
                    has_narrative_text: document.getElementById("has_narrative_text").checked,
                    text: document.getElementById("text").value,
                },
                character: {
                    character_id: document.getElementById('character_select').value,
                    has_character: document.getElementById("has_character").checked,
                    conversation_url: document.getElementById("conversation_url").value,
                },
                ar_interaction: {
                    id_ar: parseInt(document.getElementById('id_ar').value),
                    has_ar_interaction: document.getElementById("has_ar_interaction").checked,
                    markers: [{
                        name: document.getElementById("marker_name").options[document.getElementById("marker_name").selectedIndex].text,
                        url: fileData.marker_image ? fileData.marker_image.name : document.getElementById("image_marker_preview").src,
                        file_data: fileData.marker_image ? fileData.marker_image.data : undefined,
                    }, {
                        name: document.getElementById("marker_name2").options[document.getElementById("marker_name2").selectedIndex].text,
                        url: fileData.marker_image2 ? fileData.marker_image2.name : document.getElementById("image_marker_preview2").src,
                        file_data: fileData.marker_image2 ? fileData.marker_image2.data : undefined,
                    }, ],
                    sound_id: document.getElementById("sound_id").value,
                    delayed_time: document.getElementById("delayed_time").value,
                    progress_action: document.getElementById("progress_action").value,
                    ar_hint_url: fileData.ar_hint_image ? fileData.ar_hint_image.name : document.getElementById("image_hint_preview").src,
                    ar_hint_file_data: fileData.ar_hint_image ? fileData.ar_hint_image.data : undefined,
                },
            };



            if (!validateImages(stepData)) return;
            else if (!validateConversation(stepData)) return;

            if (!isCombined) stepData.ar_interaction.markers.splice(1, 1);

            if (editingStepIndex !== null) {
                // Update the existing stepData
                stepsData.steps[editingStepIndex] = stepData;

                // Remove the existing step item from the list
                const stepItem = document.querySelector(`#steps_list div[data-index="${editingStepIndex}"]`);
                stepItem.remove();

                // Add the updated step item to the list
                addStepItem(stepData, editingStepIndex);

                // Reset editingStepIndex
                editingStepIndex = null;
                clearFormFields();
            } else {
                // Add the new stepData to the "steps" array
                stepsData.steps.push(JSON.parse(JSON.stringify(stepData)));

                // Add the new step item to the list
                addStepItem(stepData, stepsData.steps.length - 1);
                clearFormFields();
            }


        }

        function editStep(index) {
            editingStepIndex = index;

            clearFormFields();
            const step = JSON.parse(JSON.stringify(stepsData.steps[index]));
            document.getElementById("accusation_url").value = stepsData.accusation;
            addAccusation(document.getElementById("accusation_button"), true);

            document.getElementById("has_popup").checked = step.popup.has_popup;
            document.getElementById("title").value = step.popup.title;
            document.getElementById("message").value = step.popup.message;
            document.getElementById("time_to_delete").value = step.popup.time_to_delete;

            document.getElementById("has_narrative_text").checked = step.narrative_text.has_narrative_text;
            document.getElementById("text").value = step.narrative_text.text;

            document.getElementById("character_select").selectedIndex = step.character.character_id;
            document.getElementById("has_character").checked = step.character.has_character;
            document.getElementById("conversation_url").value = step.character.conversation_url;

            document.getElementById("id_ar").selectedIndex = step.ar_interaction.id_ar;
            document.getElementById("has_ar_interaction").checked = step.ar_interaction.has_ar_interaction;


            const selectElement = document.getElementById('marker_name');
            const desiredOptionText = step.ar_interaction.markers[0].name;

            for (let i = 0; i < selectElement.options.length; i++) {
                if (selectElement.options[i].text === desiredOptionText) {
                    selectElement.selectedIndex = i;
                    break;
                }
            }

            let base64ImageMarker;
            if (typeof step.ar_interaction.markers[0].file_data !== 'undefined') {
                base64ImageMarker = step.ar_interaction.markers[0].file_data;
            } else {
                base64ImageMarker = step.ar_interaction.markers[0].url;
            }

            const markerImg = document.getElementById("image_marker_preview");
            markerImg.src = base64ImageMarker;
            markerImg.style.display = "block";

            if (step.ar_interaction.markers.length > 1) {

                addMarkerFields();

                const selectElement2 = document.getElementById('marker_name2');
                const desiredOptionText2 = step.ar_interaction.markers[1].name;

                for (let i = 0; i < selectElement2.options.length; i++) {
                    if (selectElement2.options[i].text === desiredOptionText2) {
                        selectElement2.selectedIndex = i;
                        break;
                    }
                }

                let base64ImageMarker2;
                if (typeof step.ar_interaction.markers[1].file_data !== 'undefined') {
                    base64ImageMarker2 = step.ar_interaction.markers[1].file_data;
                } else {
                    base64ImageMarker2 = step.ar_interaction.markers[1].url;
                }

                const markerImg2 = document.getElementById("image_marker_preview2");
                markerImg2.style.display = "block";
                markerImg2.src = base64ImageMarker2;

            } else removeMarkerFields();

            document.getElementById("sound_id").value = step.ar_interaction.sound_id;
            document.getElementById("delayed_time").value = step.ar_interaction.delayed_time;
            document.getElementById("progress_action").value = step.ar_interaction.progress_action;

            let base64ImageImg;
            if (typeof step.ar_interaction.ar_hint_file_data !== 'undefined') {
                base64ImageImg = step.ar_interaction.ar_hint_file_data;
            } else {
                base64ImageImg = step.ar_interaction.ar_hint_url;
            }



            const hintImg = document.getElementById("image_hint_preview");
            hintImg.style.display = "block";
            hintImg.src = base64ImageImg;


        }




        function saveJSON() {
            stepsData.gameName = gameName;
            stepsData.status = true;
            if (document.getElementById("accusation_url").value === "") {
                alert("Please create the accusation");
                return;
            } else if (stepsData.accusation == "") stepsData.accusation = document.getElementById("accusation_url").value;

            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'save_json.php', true);
            xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
            xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        document.getElementById('output').innerHTML += xhr.responseText + '<br>';
                    } else {
                        document.getElementById('output').innerHTML += 'Error saving JSON file.<br>';
                    }
                }
            };
            xhr.send(JSON.stringify(stepsData));
        }

        window.saveJSON = saveJSON;


        window.onload = function() {
            // Your other functions for displaying the game name and form
            document.getElementById("save_button").addEventListener("click", addStepToList);
            document.getElementById("save_json").addEventListener("click", saveJSON);

        }

        window.createStep = createStep;
        window.addStepToList = addStepToList;
    </script>
</body>

</html>