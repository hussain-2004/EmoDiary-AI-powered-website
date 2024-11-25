import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import config from '../config.js';
// Firebase configuration
const firebaseConfig = {
    apiKey: config.FIREBASE_AUTH_KEY,
    authDomain: "emodiary-backend-support.firebaseapp.com",
    projectId: "emodiary-backend-support",
    storageBucket: "emodiary-backend-support.firebasestorage.app",
    messagingSenderId: config.mSId,
    appId: config.aId,
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            await fetchDiaryEntry(user.uid);
        } else {
            console.error("User not authenticated.");
        }
    });
});

async function fetchDiaryEntry(userId) {
    try {
        const userDoc = doc(db, "users", userId);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
            const diaries = docSnap.data().diaries;
            const latestDiary = diaries[diaries.length - 1];
            displayMetrics(latestDiary);
        } else {
            console.error("No diary entries found.");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function displayMetrics(diary) {
    const predictions = diary.predictions;

    // Emotion Score
    if(predictions.emotion == 0 || predictions.emotion == 3 || predictions.emotion == 4){
        document.getElementById("emotionScore").textContent = "Cloudy Day";
    }
    else{
        document.getElementById("emotionScore").textContent = "Bright Day ";
    }

    // Mental Health Prediction
    document.getElementById("mentalHealth").textContent = predictions.mental_health_prediction || "Unknown";

    // Toxicity Level
    document.getElementById("toxicityLevel").textContent =
        predictions.toxic_language === "1" ? "Toxic" : "Non-toxic";

    // Tweet Emotion
    document.getElementById("tweetEmotion").textContent = predictions.tweet_emotion_prediction || "--";

    // Render Word Cloud
    renderWordCloud(diary.diary);
}

function renderWordCloud(text) {
    const wordCloudElement = document.getElementById("wordCloud");

    // Split the text into words and count their occurrences
    const words = text.split(/\s+/).reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
    }, {});

    // Create an array of objects with word and size
    const wordArray = Object.entries(words).map(([word, count]) => ({
        text: word,
        size: count * 10,  // Adjust size scaling factor as needed
    }));

    // Use the d3-cloud layout to create the word cloud
    d3.layout.cloud()
        .size([wordCloudElement.clientWidth, wordCloudElement.clientHeight])
        .words(wordArray)
        .padding(5)
        .rotate(() => (Math.random() > 0.5 ? 0 : 90))  // Random rotation
        .fontSize(d => d.size)  // Font size based on word count
        .on("end", draw)
        .start();

    // Draw the word cloud when the layout is finished
    function draw(words) {
        d3.select(wordCloudElement)
            .html("")  // Clear the previous content
            .append("svg")
            .attr("width", wordCloudElement.clientWidth)
            .attr("height", wordCloudElement.clientHeight)
            .append("g")
            .attr("transform", `translate(${wordCloudElement.clientWidth / 2}, ${wordCloudElement.clientHeight / 2})`)
            .selectAll("text")
            .data(words)
            .enter()
            .append("text")
            .style("font-size", d => `${d.size}px`)
            .style("fill", () => `hsl(${Math.random() * 360}, 70%, 50%)`)  // Random color
            .attr("text-anchor", "middle")
            .attr("transform", d => `translate(${d.x}, ${d.y})rotate(${d.rotate})`)
            .text(d => d.text);
    }
}

