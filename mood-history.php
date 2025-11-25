<?php
require_once "db.php";

try {
    $db = getDB();
    $stmt = $db->query("SELECT * FROM mood_logs ORDER BY created_at DESC");
    $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch(Exception $e) {
    die("DB Error: " . $e->getMessage());
}

function moodText($m) {
    switch($m) {
        case 1: return "😢 Sad";
        case 2: return "😟 Stressed";
        case 3: return "😐 Neutral";
        case 4: return "😊 Happy";
        case 5: return "🤩 Excited";
        default: return "Unknown";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Mood History</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #eef2f7;
            padding: 20px;
        }
        h2 {
            text-align: center;
            color: #333;
        }
        .log-container {
            width: 90%;
            margin: auto;
            max-width: 800px;
        }
        .card {
            background: white;
            padding: 15px;
            margin: 15px 0;
            border-radius: 10px;
            box-shadow: 0 2px 6px #0001;
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .card img {
            width: 80px;
            height: 80px;
            border-radius: 8px;
            object-fit: cover;
        }
        .details {
            flex: 1;
        }
        .date {
            color: #777;
            font-size: 14px;
        }
        .mood-tag {
            padding: 5px 10px;
            background: #6C63FF;
            color: white;
            border-radius: 6px;
            display: inline-block;
            margin-bottom: 5px;
        }
    </style>
</head>

<body>

<h2>Your Mood Tracking History</h2>

<div class="log-container">

<?php if (empty($logs)): ?>
    <p style="text-align:center;color:#666;">No mood logs yet.</p>
<?php else: ?>

    <?php foreach ($logs as $row): ?>
        <div class="card">
            <?php if (!empty($row['image_path'])): ?>
                <img src="<?= $row['image_path'] ?>" alt="mood-image">
            <?php else: ?>
                <img src="https://via.placeholder.com/80" alt="no image">
            <?php endif; ?>

            <div class="details">
                <div class="mood-tag"><?= moodText($row['mood']) ?></div>
                <p><?= htmlspecialchars($row['note'] ?: "No note") ?></p>
                <p class="date"><?= $row['created_at'] ?></p>
            </div>
        </div>
    <?php endforeach; ?>

<?php endif; ?>

</div>

</body>
</html>
