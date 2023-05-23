<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" type="text/css" href="css/style_admin.css">
    <title>Accusation Form</title>
</head>

<body>
    <form>
        <div class="sections-container">

            <div class="section">
                <label for="who_select">Who:</label>
                <select id="who_select" name="who_select">
                    <option value="">Select a character</option>
                    <?php
                    $charactersJson = file_get_contents("json/characters.json");
                    $characters = json_decode($charactersJson)->characters;
                    foreach ($characters as $character) {
                        echo "<option value=\"$character->id\">$character->name</option>";
                    }
                    ?>
                </select>
            </div>

            <div class="section">
                <label for="where_select">Where:</label>
                <select id="where_select" name="where_select">
                    <option value="">Select a location</option>
                    <?php
                    $locationsJson = file_get_contents("json/where.json");
                    $locations = json_decode($locationsJson)->where;
                    foreach ($locations as $location) {
                        echo "<option value=\"$location->id\">$location->name</option>";
                    }
                    ?>
                </select>
            </div>
            <div class="section">
                <label>Why:</label>
                <div>
                    <input type="checkbox" id="why_checkbox_0" name="why_checkbox" value="0" onchange="updateWhySelection(this)">
                    <label for="why_checkbox_0">Option 1:</label>
                    <input type="text" id="why_option_0" name="why_option">
                </div>
                <div>
                    <input type="checkbox" id="why_checkbox_1" name="why_checkbox" value="1" onchange="updateWhySelection(this)">
                    <label for="why_checkbox_1">Option 2:</label>
                    <input type="text" id="why_option_1" name="why_option">
                </div>
                <div>
                    <input type="checkbox" id="why_checkbox_2" name="why_checkbox" value="2" onchange="updateWhySelection(this)">
                    <label for="why_checkbox_2">Option 3:</label>
                    <input type="text" id="why_option_2" name="why_option">
                </div>
            </div>

            <div class="section">
                <label>What:</label>
                <div class="what_form">
                    <input type="checkbox" id="what_checkbox_0" name="what_checkbox" value="0" onchange="updateWhatSelection(this)">
                    <label for="what_name_0">Weapon 1 name:</label>
                    <input type="text" id="what_name_0" name="what_name">
                    <label for="what_image_0">Weapon 1 image:</label>
                    <input type="file" id="what_image_0" name="what_image" onchange="handleFileInputChange(this)">
                    <img id="what_image_0_preview" src="" width="200" height="200" style="display: none;">
                </div>
                <div class="what_form">
                    <input type="checkbox" id="what_checkbox_1" name="what_checkbox" value="1" onchange="updateWhatSelection(this)">
                    <label for="what_name_1">Weapon 2 name:</label>
                    <input type="text" id="what_name_1" name="what_name">
                    <label for="what_image_0">Weapon 2 image:</label>
                    <input type="file" id="what_image_1" name="what_image" onchange="handleFileInputChange(this)">
                    <img id="what_image_1_preview" src="" width="200" height="200" style="display: none;">
                </div>
                <div class="what_form">
                    <input type="checkbox" id="what_checkbox_2" name="what_checkbox" value="2" onchange="updateWhatSelection(this)">
                    <label for="what_name_2">Weapon 3 name:</label>
                    <input type="text" id="what_name_2" name="what_name">
                    <label for="what_image_2">Weapon 3 image:</label>
                    <input type="file" id="what_image_2" name="what_image" onchange="handleFileInputChange(this)">
                    <img id="what_image_2_preview" src="" width="200" height="200" style="display: none;">
                </div>
                <div class="what_form">
                    <input type="checkbox" id="what_checkbox_3" name="what_checkbox" value="3" onchange="updateWhatSelection(this)">
                    <label for="what_name_3">Weapon 4 name:</label>
                    <input type="text" id="what_name_3" name="what_name">
                    <label for="what_image_3">Weapon 4 image:</label>
                    <input type="file" id="what_image_3" name="what_image" onchange="handleFileInputChange(this)">
                    <img id="what_image_3_preview" src="" width="200" height="200" style="display: none;">
                </div>
                <div class="what_form">
                    <input type="checkbox" id="what_checkbox_4" name="what_checkbox" value="4" onchange="updateWhatSelection(this)">
                    <label for="what_name_4">Weapon 5 name:</label>
                    <input type="text" id="what_name_4" name="what_name">
                    <label for="what_image_4">Weapon 5 image:</label>
                    <input type="file" id="what_image_4" name="what_image" onchange="handleFileInputChange(this)">
                    <img id="what_image_4_preview" src="" width="200" height="200" style="display: none;">
                </div>
                <div class="what_form">
                    <input type="checkbox" id="what_checkbox_5" name="what_checkbox" value="5" onchange="updateWhatSelection(this)">
                    <label for="what_name_5">Weapon 6 name:</label>
                    <input type="text" id="what_name_5" name="what_name">
                    <label for="what_image_5">Weapon 6 image:</label>
                    <input type="file" id="what_image_5" name="what_image" onchange="handleFileInputChange(this)">
                    <img id="what_image_5_preview" src="" width="200" height="200" style="display: none;">

                    <button type="button" onclick="editFields()">Edit Accusation</button>
                    <button type="button" onclick="saveJSON()">Generate Accusation</button>
                </div>
            </div>




        </div>
    </form>
    <script>
        let accusationUrl = "";
        var whyItems = [];
        var indexWhy = "0";
        const checkboxesWhy = document.getElementsByName("why_checkbox");

        function populateWhys() {
            // Clear the whyItems array
            whyItems = [];

            // Loop over all checkboxes and add the checked ones to the whyItems array

            for (let i = 0; i < checkboxesWhy.length; i++) {
                var id = checkboxesWhy[i].value;
                var name = document.getElementById(`why_option_${id}`).value;

                var item = {
                    id: id,
                    name: name
                };

                whyItems.push(item);
            }
        }

        function updateWhySelection(checkbox) {
            indexWhy = checkbox.value;


            // Uncheck all checkboxes except for the current one
            checkboxesWhy.forEach(function(cb) {
                if (cb !== checkbox) {
                    cb.checked = false;
                }
            });
        }
        var whatItems = [{
                id: "0",
                name: "",
                url: null
            },
            {
                id: "1",
                name: "",
                url: null
            },
            {
                id: "2",
                name: "",
                url: null
            },
            {
                id: "3",
                name: "",
                url: null
            },
            {
                id: "4",
                name: "",
                url: null
            },
            {
                id: "5",
                name: "",
                url: null
            }

        ];

        var indexWhat = "0";
        let isEdit = false;
        var whyItems_imageData = [];
        const checkboxesWhat = document.getElementsByName("what_checkbox");



        function handleFileInputChange(input) {
            if (input.files && input.files.length > 0) {
                const file = input.files[0];
                const reader = new FileReader();
                reader.onload = function(e) {
                    const what_image_preview = document.getElementById(`${input.id}_preview`);
                    if (what_image_preview) {
                        what_image_preview.src = e.target.result;
                        what_image_preview.style.display = 'block';

                        // Find the corresponding item in whatItems and update its image property
                        const id = input.id.replace('what_image_', '');
                        for (let i = 0; i < whatItems.length; i++) {
                            if (whatItems[i].id === id) {
                                whatItems[i].url = e.target.result; //.split(',')[1];
                                break;
                            }
                        }
                    }
                };
                reader.readAsDataURL(file);
            }
        }



        function populateWhats() {


            // Loop over all checkboxes and add the checked ones to the whatItems array
            for (let i = 0; i < checkboxesWhat.length; i++) {
                var id = checkboxesWhat[i].value;
                var name = document.getElementById(`what_name_${id}`).value;
                whatItems[i].name = name;

            }


        }


        function updateWhatSelection(checkbox) {
            indexWhat = checkbox.value;

            // Uncheck all checkboxes except for the current one
            checkboxesWhat.forEach(function(cb) {
                if (cb !== checkbox) {
                    cb.checked = false;
                }
            });
        }

        function validateSelections() {
            // Validate the selections
            let whySelected = false;
            let whatImagesUploaded = true;

            // Validate Why field
            const checkboxesWhy = document.getElementsByName("why_checkbox");
            for (let i = 0; i < checkboxesWhy.length; i++) {
                if (checkboxesWhy[i].checked) {
                    whySelected = true;
                    break;
                }
            }

            // Validate What field
            const checkboxesWhat = document.getElementsByName("what_checkbox");
            for (let i = 0; i < checkboxesWhat.length; i++) {
                if (checkboxesWhat[i].checked && !whatItems[i].url) {
                    whatImagesUploaded = false;
                    break;
                }
            }

            // Display validation messages or take necessary actions
            if (!whySelected) {
                alert("Please select at least one option in Why field.");
            }

            if (!whatImagesUploaded) {
                alert("Please upload all images in What field.");
            }

            // Return true or false based on the overall validation status
            return whySelected && whatImagesUploaded;
        }


        function editFields(accusationUrlEdit) {

            // Make an AJAX request to retrieve the JSON data
            fetch(accusationUrlEdit)
                .then(response => response.json())
                .then(data => {

                    accusationUrl = accusationUrlEdit;
                    // Edit the fields based on the retrieved JSON data

                    // Edit Who field
                    document.getElementById("who_select").value = data.who.id;

                    // Edit Where field
                    document.getElementById("where_select").value = data.where.id;

                    // Edit Why field
                    const checkboxesWhy = document.getElementsByName("why_checkbox");
                    for (let i = 0; i < checkboxesWhy.length; i++) {
                        const checkbox = checkboxesWhy[i];
                        const whyItem = data.why.items[i];
                        checkbox.checked = (whyItem.id === data.why.id);
                        document.getElementById(`why_option_${i}`).value = whyItem.name;
                    }

                    // Edit What field
                    const checkboxesWhat = document.getElementsByName("what_checkbox");
                    for (let i = 0; i < data.what.items.length; i++) {
                        
                        if (data.what.items[i].url != null) {
                            const checkbox = checkboxesWhat[i];
                            const whatItem = data.what.items[i];
                            checkbox.checked = (whatItem.id === data.what.id);
                            document.getElementById(`what_name_${i}`).value = whatItem.name;
                            document.getElementById(`what_image_${i}_preview`).src = whatItem.url;
                            document.getElementById(`what_image_${i}_preview`).style.display = 'block';
                            whatItems[i].url = whatItem.url;
                        }


                    }
                })
                .catch(error => {
                    console.error('Error retrieving JSON data:', error);
                });
        }




        function saveJSON() {

            populateWhats();
            populateWhys();
            // Get the form data
            let who = {
                id: document.getElementById("who_select").value
            };
            let where = {
                id: document.getElementById("where_select").value
            };

            let why = {
                id: indexWhy,
                items: whyItems
            };

            let what = {
                id: indexWhat,
                items: whatItems
            };

            let jsonData = {
                who: who,
                where: where,
                what: what,
                why: why,
                edit: isEdit,
                accusationUrl: accusationUrl
            };

            // Create a new XMLHttpRequest object
            let xhr = new XMLHttpRequest();

            // Set up the request
            xhr.open("POST", "save_json_accusation.php", true);
            xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

            // Handle the response
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    let response = JSON.parse(xhr.responseText);
                    if (response.status === "success") {
                        // Clear all form inputs and uncheck all checkboxes
                        document.querySelectorAll("input[type='text'], input[type='file'], select, input[type='checkbox']").forEach(function(element) {
                            if (element.type === "checkbox") {
                                element.checked = false;
                            } else {
                                element.value = "";
                            }
                        });
                        accusationUrl = response.url;
                        // Send a message to the parent page with the accusation URL
                        parent.postMessage({
                            type: 'accusationUrl',
                            value: accusationUrl
                        }, '*');
                        //alert(accusationUrl);
                    } else {
                        //alert("Error: " + response.message);
                    }
                }
            }
            xhr.send(JSON.stringify(jsonData));
        }

        window.addEventListener('message', function(event) {
            if (event.data.action === 'edit') {
                isEdit = true;
                // Call the desired function in accusation.php
                editFields(event.data.accusationUrl);
            }
        });
    </script>

</body>

</html>