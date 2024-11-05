import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, doc, getDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

// Firebase configuration for your web app
// const firebaseConfig = {
//     apiKey: "AIzaSyAvagTzmvVNr-HMkayDybbDxG19AMPSBPE",
//     authDomain: "login-authentication-37d3f.firebaseapp.com",
//     projectId: "login-authentication-37d3f",
//     storageBucket: "login-authentication-37d3f.appspot.com",
//     messagingSenderId: "869768879061",
//     appId: "1:869768879061:web:7262933af3a682debf7b5c"
// };
const firebaseConfig = {
    apiKey: "AIzaSyCgcZHAPfuxzyuslojrsIWpP4rqnbu4P8g",
    authDomain: "emodiary-backend-support.firebaseapp.com",
    projectId: "emodiary-backend-support",
    storageBucket: "emodiary-backend-support.firebasestorage.app",
    messagingSenderId: "1048969605282",
    appId: "1:1048969605282:web:9b26c84361983e7d4567fb",
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'en';
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
    // Check if user is authenticated
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            await fetchProgressData(user.uid);
        } else {
            // alert("Please log in to view your progress.");
            // window.location.href = "index.html";
        }
    });
});

// Fetch diary data for visualization on the Progress page
async function fetchProgressData(userId) {
    try {
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const diaries = userDoc.data().diaries;

            // Prepare and render data for each chart
            renderOverallProgressChart(diaries);
            renderFinancialEmotionChart(diaries);
            renderMentalHealthChart(diaries);
            renderToxicityChart(diaries);
            renderTweetEmotionBubbleChart(diaries);
        } else {
            console.log("No diary entries found for this user.");
        }
    } catch (error) {
        console.error("Error fetching diary data:", error);
    }
}


// Render overall progress chart
function renderOverallProgressChart(diaries) {
    const ctx = document.getElementById("progressChart").getContext("2d");

    // Prepare data series for each parameter
    const emotionData = diaries.map(entry => ({ x: new Date(entry.date), y: entry.predictions.emotion }));
    const mentalHealthData = diaries.map(entry => ({
        x: new Date(entry.date),
        y: mentalHealthMapping(entry.predictions.mental_health_prediction)
    }));

    // Function to map mental health categories to numeric values
    function mentalHealthMapping(prediction) {
        const mapping = {
            "Normal": 1, "Depression": 2, "Suicidal": 3, "Anxiety": 4, 
            "Bipolar": 5, "Stress": 6, "Personality disorder": 7
        };
        return mapping[prediction] || 0;
    }

    // Create a chart with the remaining data series
    new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 'Emotion Score',
                    data: emotionData,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    fill: false
                },
                {
                    label: 'Mental Health Prediction',
                    data: mentalHealthData,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    },
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Score'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        }
    });
}

function renderTweetEmotionBubbleChart(diaries) {
    const ctx = document.getElementById("tweetEmotionChart").getContext("2d");

    // Prepare data for the bubble chart
    const emotionFrequency = {};
    const emotionIntensity = {};

    diaries.forEach(entry => {
        const emotion = entry.predictions.tweet_emotion_prediction;
        const intensity = tweetEmotionMapping(emotion);

        // Update frequency and intensity totals
        if (!emotionFrequency[emotion]) {
            emotionFrequency[emotion] = 0;
            emotionIntensity[emotion] = 0;
        }
        emotionFrequency[emotion]++;
        emotionIntensity[emotion] += intensity;
    });

    // Prepare data for each emotion to be used in the bubble chart
    const bubbleData = Object.keys(emotionFrequency).map(emotion => {
        return {
            x: emotionFrequency[emotion],                             // Frequency of emotion
            y: emotionIntensity[emotion] / emotionFrequency[emotion], // Average intensity
            r: emotionFrequency[emotion] * 2                          // Bubble size
        };
    });

    // Map emotions to colors
    const emotionColors = {
        "neutral": 'rgba(100, 100, 100, 0.6)',
        "worry": 'rgba(255, 99, 132, 0.6)',
        "happiness": 'rgba(75, 192, 192, 0.6)',
        "sadness": 'rgba(54, 162, 235, 0.6)',
        "love": 'rgba(255, 159, 64, 0.6)',
        "surprise": 'rgba(153, 102, 255, 0.6)',
        "fun": 'rgba(255, 206, 86, 0.6)',
        "relief": 'rgba(75, 192, 192, 0.6)',
        "hate": 'rgba(201, 203, 207, 0.6)',
        "empty": 'rgba(255, 159, 64, 0.6)',
        "enthusiasm": 'rgba(153, 102, 255, 0.6)',
        "boredom": 'rgba(54, 162, 235, 0.6)',
        "anger": 'rgba(255, 99, 132, 0.6)'
    };

    // Function to map tweet emotions to numeric values
    function tweetEmotionMapping(emotion) {
        const mapping = {
            "neutral": 0, "worry": 1, "happiness": 2, "sadness": 3, "love": 4,
            "surprise": 5, "fun": 6, "relief": 7, "hate": 8, "empty": 9, 
            "enthusiasm": 10, "boredom": 11, "anger": 12
        };
        return mapping[emotion] || 0;
    }

    // Create the bubble chart
    new Chart(ctx, {
        type: 'bubble',
        data: {
            datasets: Object.keys(emotionFrequency).map(emotion => ({
                label: emotion,
                data: [bubbleData.find(d => tweetEmotionMapping(emotion) === tweetEmotionMapping(emotion))],
                backgroundColor: emotionColors[emotion] || 'rgba(0, 0, 0, 0.5)',
            }))
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Frequency of Emotion'
                    },
                    beginAtZero: true
                },
                y: {
                    title: {
                        display: true,
                        text: 'Average Intensity'
                    },
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const x = context.raw.x;
                            const y = context.raw.y;
                            return `${label}: Frequency = ${x}, Avg Intensity = ${y.toFixed(2)}`;
                        }
                    }
                }
            }
        }
    });
}

// Render financial emotion chart
function renderFinancialEmotionChart(diaries) {
    const ctx = document.getElementById("financialEmotionChart").getContext("2d");
    const financialCounts = diaries.reduce((acc, entry) => {
        const emotion = entry.predictions.financial_emotion_prediction;
        acc[emotion] = (acc[emotion] || 0) + 1;
        return acc;
    }, { positive: 0, negative: 0, neutral: 0 });

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Positive', 'Negative', 'Neutral'],
            datasets: [{
                label: 'Financial Emotions',
                data: [financialCounts.positive, financialCounts.negative, financialCounts.neutral],
                backgroundColor: ['#4CAF50', '#F44336', '#FFC107']
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Render mental health chart
function renderMentalHealthChart(diaries) {
    const ctx = document.getElementById("mentalHealthChart").getContext("2d");
    const mentalHealthCounts = diaries.reduce((acc, entry) => {
        const emotion = entry.predictions.mental_health_prediction;
        acc[emotion] = (acc[emotion] || 0) + 1;
        return acc;
    }, {});

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(mentalHealthCounts),
            datasets: [{
                data: Object.values(mentalHealthCounts),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
            }]
        },
        options: {
            responsive: true
        }
    });
}

// Render toxicity chart
function renderToxicityChart(diaries) {
    const ctx = document.getElementById("toxicityChart").getContext("2d");
    const toxicCounts = diaries.reduce((acc, entry) => {
        const isToxic = entry.predictions.toxic_language;
        acc[isToxic] = (acc[isToxic] || 0) + 1;
        return acc;
    }, { 0: 0, 1: 0 });

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Non-Toxic', 'Toxic'],
            datasets: [{
                data: [toxicCounts[0], toxicCounts[1]],
                backgroundColor: ['#4CAF50', '#F44336']
            }]
        },
        options: {
            responsive: true
        }
    });
}
