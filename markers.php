<?php

include_once 'Vuforia.php';
include_once 'target-details.php';

function uploadImage($image_file) {
  $target_dir = 'markers/';
  $timestamp = date("Ymd_His");
  $target_file = $target_dir . $timestamp . "_" . $image_file['name'];
  $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

  // Validate file type
  $allowedTypes = ['jpg', 'jpeg'];
  if (!in_array($imageFileType, $allowedTypes)) {
    echo "ERROR Invalid file type:" . $imageFileType . " " . $target_file;
    return null; // 
  }

  // Validate file size (2 megabytes)
  $maxFileSize = 2.1 * 1024 * 1024; // 2MB
  if ($image_file["size"] >= $maxFileSize) {
    echo "ERROR Size";
    return null; // File size exceeds the limit
  }

  // Move the uploaded file to the target directory
  if (move_uploaded_file($image_file["tmp_name"], $target_file)) {
    return array(
      'name' => basename($target_file),
      'url' => $target_file
    );
  } else {
    echo "ERROR Failed to move the file";
    return null; // Failed to move the file
  }
}


// Load existing JSON data
$jsonData = file_get_contents('json/targets.json');
$data = json_decode($jsonData, true);
$targetsJson = $data['targets'];

// Check if the form has been submitted
if (isset($_POST['submit'])) {
// Handle Vuforia target upload
$imagename = $_POST['imagename'];
$imagename = str_replace(' ', '_', $imagename); // Replace spaces with underscores
$imagename = strtolower($imagename); // Convert to lowercase

$vuforia = new Vuforia();
$targetUploaded = $vuforia->add($imagename, $_FILES['file']['tmp_name']);

// Get the target details from Vuforia API
$targetDetails = $vuforia->getTarget($targetUploaded->target_id);

// Create a new target object
$newTarget = (object) [
  'id' => count($targetsJson), // Assign a new ID based on the number of existing targets
  'target_name' => $targetDetails->target_record->name,
  'target_id' => $targetDetails->target_record->target_id
];

// Handle image file upload
$imageArray = uploadImage($_FILES['file']);

if ($imageArray) {
  $newTarget->target_url = $imageArray['url'];
} else {
  echo "Image not uplaoded";
  // Handle case when image upload fails
}

  // Add the new target to the targets array
  array_push($targetsJson, $newTarget);

  // Update the JSON data
  $data['targets'] = $targetsJson;

  $updatedJsonData = json_encode($data,JSON_PRETTY_PRINT);

  // Save the updated JSON data to the file
  file_put_contents('json/targets.json', $updatedJsonData);

  // Show target name and success message
$output = "<p>Target uploaded: " . $newTarget->target_name . " " . $newTarget->id . " " . $newTarget->target_url . "</p>";
$output .= "<p>Target created successfully.</p>";
echo $output;
}

// Get all targets from the Cloud Database
$targets = [];
$targets=setTargetsArray();


?>

<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="css/style_admin.css" />
  <title>AR Cloud</title>
</head>

<body>

<nav class="sidenav">
  <a href="createGames.php">Create Game</a>
  <br>
  <a href="addStep.php">Create Game Steps</a>
  <br>
  <a href="#">AR Cloud</a>
</nav>

<main>
  <h1>Targets in the Cloud Database</h1>

  <hr>

  <h1>Upload image target</h1>
  <p>Please upload either a .jpg or an .jpeg 2mb or lower</p><br>
  <form action="" method="post" enctype="multipart/form-data">
    <label for="imagename">Image name:</label>
    <input type="text" name="imagename" required><br><br>
    <label for="file">Image file:</label>
    <input type="file" name="file" required><br><br>
    <input type="submit" name="submit" value="Upload target">
  </form>
  <div id="output"></div>
  <hr>

  <h1>Select a target to view details</h1>

  <select onchange="showTarget(this.value)">
    <option value="">Select a target</option>
    <?php
    foreach ($targets as $target_select) {

    ?>
      <option value="<?php echo $target_select->target_record->target_id; ?>"><?php echo $target_select->target_record->name; ?></option>
    <?php } ?>
  </select>

  <div id="target-details"></div>
  <img id="image-preview" src="" width="200" height="200" style="display: none;">

  </main>
  <script type="text/javascript">
    // showTarget function
   
//
function showTarget(targetId) {
  // Check if a target has been selected
  if (targetId) {
    // Make an AJAX request to get the target details from the Vuforia API
    var vuforiaXhr = new XMLHttpRequest();
    vuforiaXhr.onreadystatechange = function() {
      if (vuforiaXhr.readyState === XMLHttpRequest.DONE) {
        if (vuforiaXhr.status === 200) {
          // Parse the Vuforia API response as JSON
          var vuforiaTarget = JSON.parse(vuforiaXhr.responseText);
          var vuforiaDetails = "Target ID: " + vuforiaTarget.target_record.target_id + "<br>" +
            "Name: " + vuforiaTarget.target_record.name + "<br>" +
            "Width: " + vuforiaTarget.target_record.width + "<br>"+
            "Tracking Rating: " + vuforiaTarget.target_record.tracking_rating + "<br>";

          // Make an AJAX request to get the target details from the JSON file
          var jsonXhr = new XMLHttpRequest();
          jsonXhr.onreadystatechange = function() {
            if (jsonXhr.readyState === XMLHttpRequest.DONE) {
              if (jsonXhr.status === 200) {
                // Parse the JSON file response as JSON
                var jsonTargets = JSON.parse(jsonXhr.responseText).targets;

                // Find the target object with the matching ID
                var jsonTarget = jsonTargets.find(function(obj) {
                  return obj.target_id === targetId;
                });

                if (jsonTarget) {
                  // Display the target details on the page
                  var targetDetails = vuforiaDetails;
                  document.getElementById('target-details').innerHTML = targetDetails;

                  // Set the image preview
                  var imagePreview = document.getElementById('image-preview');
                  imagePreview.src = jsonTarget.target_url;
                  imagePreview.style.display = 'block';
                } else {
                  alert('Target not found in the JSON file.');
                }
              } else {
                alert('There was a problem retrieving the target details from the JSON file.');
              }
            }
          };

          jsonXhr.open('GET', 'json/targets.json', true);
          jsonXhr.send();
        } else {
          alert('There was a problem retrieving the target details from the Vuforia API.');
        }
      }
    };

    vuforiaXhr.open('POST', 'target-details.php', true);
    vuforiaXhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    vuforiaXhr.send('target_id=' + targetId);
  } else {
    // Clear the target details and image preview
    document.getElementById('target-details').innerHTML = '';
    document.getElementById('image-preview').style.display = 'none';
  }
}


  </script>

</body>

</html>