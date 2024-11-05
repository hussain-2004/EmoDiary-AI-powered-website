// Import Firebase modules
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyCgcZHAPfuxzyuslojrsIWpP4rqnbu4P8g",
    authDomain: "emodiary-backend-support.firebaseapp.com",
    projectId: "emodiary-backend-support",
    storageBucket: "emodiary-backend-support.firebasestorage.app",
    messagingSenderId: "1048969605282",
    appId: "1:1048969605282:web:9b26c84361983e7d4567fb",
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'en';
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// Ensure DOM is fully loaded before executing scripts
document.addEventListener("DOMContentLoaded", () => {
    
    // Check if the user is authenticated on diary.html
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // Update user profile on diary.html
            updateUserProfile(user);  
        } else {
            // If the user is not authenticated, redirect them to the login page
            // alert("Please log in! Redirecting to login page.");
            // window.location.href = "index.html";  // Redirect to login page
        }
    });

    // Function to update user profile on the diary.html page
    function updateUserProfile(user) {
        const userName = user.displayName;
        const userEmail = user.email;
        const userProfilePicture = user.photoURL;
        
        // Ensure the elements exist before updating them
        if (document.getElementById("name")) {
            document.getElementById("name").textContent = userName;
        }
        if (document.getElementById("email")) {
            document.getElementById("email").textContent = userEmail;
        }
        if (document.getElementById("img")) {
            document.getElementById("img").src = userProfilePicture;
        }
        if (document.getElementById("uid")) {
            document.getElementById("uid").textContent = user.uid;
        }
    }

    // Submit button functionality to save data to Firestore on diary.html
    const submitButton = document.getElementById("submitButton");

    if (submitButton) {
        submitButton.addEventListener("click", async () => {
            const user = auth.currentUser; // Get the current authenticated user

            if (user) {
                // Capture user data to save in Firestore
                const userName = user.displayName;
                const userEmail = user.email;
                const userUid = user.uid;
                const data = document.getElementById("submitButton").innerText;

                // Define the data structure to be saved
                const userData = {
                    UserName: userName,
                    Email: userEmail,
                    UserId: userUid,
                    Emotions: 9  // Example diary data (replace this with your actual input)
                };

                try {
                    // Save user data to Firestore in the "EmoDiary" collection
                    await addDoc(collection(db, "EmoDiary"), userData);
                    alert("Diary entry successfully saved!");
                } catch (error) {
                    console.error("Error saving document: ", error);
                    alert("Error saving diary entry: " + error.message);
                }
            } else {
                alert("User is not logged in. Please log in first.");
            }
        });
    }
});


// Google login function on index.html page
document.addEventListener("DOMContentLoaded", () => {
    // const googleLogin = document.getElementById("google-login-btn");
    // const googleLogin = document.querySelectorAll("google-login-btn");
    // const googleLogin = document.getElementsByClassName("google-login-btn")
    
    // if (googleLogin) {
    //     googleLogin.addEventListener("click", function () {
    //         signInWithPopup(auth, provider)
    //             .then((result) => {
    //                 const user = result.user;
    //                 // Redirect to diary page after successful login
    //                 window.location.href = "pages/diary.html";
    //             })
    //             .catch((error) => {
    //                 console.error("Error during login:", error.code, error.message);
    //                 alert("Login failed: " + error.message);
    //             });
    //     });
    // }

    const googleLoginButtons = document.getElementsByClassName("google-login-btn");

    for (let i = 0; i < googleLoginButtons.length; i++) {
        googleLoginButtons[i].addEventListener("click", function () {
            signInWithPopup(auth, provider)
                .then((result) => {
                    const user = result.user;
                    // Redirect to diary page after successful login
                    window.location.href = "pages/diary.html";
                })
                .catch((error) => {
                    console.error("Error during login:", error.code, error.message);
                    alert("Login failed: " + error.message);
                });
        });
    }
});





import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";



document.addEventListener("DOMContentLoaded", () => {
    const submitButton = document.getElementById("submitButton");
    const textArea = document.getElementById("textArea");

    if (submitButton && textArea) {
        submitButton.addEventListener("click", async () => {
            const user = auth.currentUser; // Get the current authenticated user

            if (user) {
                const userName = user.displayName;
                const userEmail = user.email;
                const userUid = user.uid;
                const diaryText = textArea.value.trim(); // Get the diary text

                if (!diaryText) {
                    alert("Please enter some text in the diary.");
                    return;
                }

                // Prepare the URL for the POST request
                // const url = `http://127.0.0.1:5001/predict`;
                const url = `http://54.227.154.169:5001/predict`;

                try {
                    // Send request to server using POST method with JSON body
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json' // Set the content type to JSON
                        },
                        body: JSON.stringify({ text: diaryText }) // Send the diary text as JSON
                    });

                    if (!response.ok) throw new Error("Server error");

                    const predictionData = await response.json();
                    const timestamp = new Date().toISOString();

                    // Create diary entry with extracted insights
                    const diaryEntry = {
                        date: timestamp,
                        diary: diaryText,
                        predictions: predictionData
                    };

                    // Reference to the user's document
                    const userDocRef = doc(db, "users", userUid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        // Document exists: update the diaries array
                        await updateDoc(userDocRef, {
                            diaries: arrayUnion(diaryEntry)
                        });
                    } else {
                        // Document doesn't exist: create a new one
                        await setDoc(userDocRef, {
                            userName: userName,
                            userEmail: userEmail,
                            diaries: [diaryEntry]
                        });
                    }

                    alert("Diary entry successfully saved!");
                } catch (error) {
                    console.error("Error:", error);
                    alert("Failed to save diary entry: " + error.message);
                }
            } else {
                alert("User is not logged in. Please log in first.");
            }
        });
    }
});



// Fetch diary data for visualization
async function fetchDiaryData() {
    const user = auth.currentUser;
    if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const diaries = userDoc.data().diaries;
            renderFinancialEmotionChart(diaries);

            // Count occurrences of each mental health prediction
            const mentalHealthCounts = diaries.reduce((acc, entry) => {
                const emotion = entry.predictions.mental_health_prediction;
                acc[emotion] = (acc[emotion] || 0) + 1;
                return acc;
            }, {});

            // Render the charts with the dynamically fetched data
            renderMentalHealthChart(mentalHealthCounts);
            
            //word cloud
            let lastEntryText = getLastDiaryText(diaries, 10000); // Get the last 500 words
            renderWordCloudFromText(lastEntryText); 

            // Inside fetchDiaryData function after fetching diaries
            fetchTweetEmotionData(); // Call this function to fetch and visualize tweet emotions

            //toxic lang.
            const toxicCounts = diaries.reduce((acc, entry) => {
                const isToxic = entry.predictions.toxic_language; // Assuming this is the correct path
                acc[isToxic] = (acc[isToxic] || 0) + 1; // Increment the count based on toxic (1) or normal (0)
                return acc;
            }, { 0: 0, 1: 0 }); // Initialize with 0 counts for both categories

            // Now you can use toxicCounts to render your chart
            renderToxicityChart(toxicCounts);

            // Calculate financial emotion counts
            const financialCounts = diaries.reduce((acc, entry) => {
                const emotion = entry.predictions.financial_emotion_prediction;
                acc[emotion] = (acc[emotion] || 0) + 1;
                return acc;
            }, { positive: 0, negative: 0, neutral: 0 });

            // Render the financial emotion radar chart
            renderFinancialEmotionBarChart(financialCounts)

            // Count emotions from diary entries
            const emotionCounts = countEmotions(diaries);
            renderEmotionRadialChart(emotionCounts);


            // Render the charts with the dynamically fetched data
            renderTweetEmotionBarChart(tweetEmotionCounts);
            renderTweetEmotionPieChart(tweetEmotionCounts);
            renderTweetEmotionRadarChart(tweetEmotionCounts);



            renderEmotionsTrendChart(trendCounts);
            
        } else {
            console.log("No diary entries found for the user.");
            
            // Generate dummy entries
            const dummyDiaries = Array.from({ length: 5 }, (_, i) => ({
                date: new Date(Date.now() - i * 86400000).toISOString(), // Create dates for the past 5 days
                diary: `This is a sample diary entry number ${i + 1} for visualization purposes.`,
                predictions: {
                    emotion:[0,1,2,3,4,5][Math.floor(Math.random()*6)],
                    financial_emotion_prediction: ["positive", "negative", "neutral"][Math.floor(Math.random() * 3)],
                    mental_health_prediction: ["Normal", "Depression", "Anxiety"][Math.floor(Math.random() * 3)],
                    toxic_language: Math.random() > 0.7 ? "1" : "0",
                    tweet_emotion_prediction : ["neutral","love","happiness","worry","sadness","surprise","fun","enthusiasm"][Math.floor(Math.random()*8)]
                }
            }));

            // Save dummy entries to Firestore
            await setDoc(userDocRef, {
                userName: user.displayName,
                userEmail: user.email,
                diaries: dummyDiaries
            });

            // Render visualizations with dummy data
            renderFinancialEmotionChart(dummyDiaries);
            const mentalHealthCounts = dummyDiaries.reduce((acc, entry) => {
                const emotion = entry.predictions.mental_health_prediction;
                acc[emotion] = (acc[emotion] || 0) + 1;
                return acc;
            }, {});
            renderMentalHealthChart(mentalHealthCounts);

            // Toxic language chart
            const toxicCounts = dummyDiaries.reduce((acc, entry) => {
                const isToxic = entry.predictions.toxic_language;
                acc[isToxic] = (acc[isToxic] || 0) + 1;
                return acc;
            }, { 0: 0, 1: 0 });
            renderToxicityChart(toxicCounts);

            // Financial emotion chart
            const financialCounts = dummyDiaries.reduce((acc, entry) => {
                const emotion = entry.predictions.financial_emotion_prediction;
                acc[emotion] = (acc[emotion] || 0) + 1;
                return acc;
            }, { positive: 0, negative: 0, neutral: 0 });
            renderFinancialEmotionBarChart(financialCounts);

            // Emotion radial chart
            const emotionCounts = countEmotions(dummyDiaries);
            renderEmotionRadialChart(emotionCounts);

            // Word cloud
            let lastEntryText = getLastDiaryText(dummyDiaries, 10000); // Use the dummy text
            renderWordCloudFromText(lastEntryText);


        }
    } else {
        alert("User is not logged in.");
    }
}

    // Counting occurrences of each emotion
function countEmotions(diaries) {
    const emotionCounts = {
        0: 0, // Sadness
        1: 0, // Joy
        2: 0, // Love
        3: 0, // Anger
        4: 0, // Fear
        5: 0  // Surprise
    };

    diaries.forEach(entry => {
        const emotion = entry.predictions.emotion;
        if (emotionCounts.hasOwnProperty(emotion)) {
            emotionCounts[emotion]++;
        }
    });

    return emotionCounts;
}
//emotion
function renderEmotionRadialChart(emotionCounts) {
    const ctx = document.getElementById("emotionRadialChart").getContext("2d");

    new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: ['Sadness', 'Joy', 'Love', 'Anger', 'Fear', 'Surprise'],
            datasets: [{
                label: 'Emotion Distribution',
                data: [
                    emotionCounts[0],
                    emotionCounts[1],
                    emotionCounts[2],
                    emotionCounts[3],
                    emotionCounts[4],
                    emotionCounts[5]
                ],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)'
                ]
            }]
        },
        options: {
            responsive: true,
            scales: {
                r: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Radial Plot of Emotions'
                }
            }
        }
    });
}






// Rendering Financial Emotion Radar Chart
// Render financial emotion bar chart
function renderFinancialEmotionBarChart(financialCounts) {
    const ctx = document.getElementById("financialEmotionBarChart").getContext("2d");

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Financially Happy', 'Financially Worried', 'Financially Neutral'], // Creative names for financial emotions
            datasets: [{
                label: 'Financial Emotion Distribution',
                data: [
                    financialCounts.positive || 0,
                    financialCounts.negative || 0,
                    financialCounts.neutral || 0
                ],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)', // Positive
                    'rgba(255, 99, 132, 0.6)', // Negative
                    'rgba(255, 206, 86, 0.6)' // Neutral
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Financial Emotion Distribution'
                }
            }
        }
    });
}



// Example of how to call the render function
// Rendering Toxicity Chart
function renderToxicityChart(toxicCounts) {
    const ctx = document.getElementById("toxicityChart").getContext("2d");

    const data = {
        labels: ['Normal (0)', 'Toxic (1)'],
        datasets: [{
            data: [toxicCounts[0], toxicCounts[1]],
            backgroundColor: [
                '#36A2EB', // Color for Normal
                '#FF6384'  // Color for Toxic
            ],
            hoverBackgroundColor: [
                '#0d6efd', // Darker blue on hover
                '#ff6384'  // Darker red on hover
            ]
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.label || '';
                        if (label) {
                            label += ': ';
                        }
                        label += context.raw; // Display count in tooltip
                        return label;
                    }
                }
            },
            title: {
                display: true,
                text: 'Toxic Language Analysis'
            }
        }
    };

    new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: options
    });
}


// Function to fetch diary data for tweet emotions visualization
async function fetchTweetEmotionData() {
    const user = auth.currentUser;
    if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const diaries = userDoc.data().diaries;

            // Count occurrences of each tweet emotion prediction
            const tweetEmotionCounts = diaries.reduce((acc, entry) => {
                const emotion = entry.predictions.tweet_emotion_prediction;
                acc[emotion] = (acc[emotion] || 0) + 1;
                return acc;
            }, {});

            // Render the charts with the dynamically fetched data
            renderTweetEmotionBarChart(tweetEmotionCounts);
            renderTweetEmotionPieChart(tweetEmotionCounts);
            renderTweetEmotionRadarChart(tweetEmotionCounts);
            
        } else {
            console.log("No diary entries found for the user.");
        }
    } else {
        alert("User is not logged in.");
    }
}

// Function to render a bar chart for tweet emotions
function renderTweetEmotionBarChart(tweetEmotionCounts) {
    const ctx = document.getElementById("tweetEmotionBarChart").getContext("2d");

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(tweetEmotionCounts),
            datasets: [{
                label: 'Feelings Frequency',
                data: Object.values(tweetEmotionCounts),
                backgroundColor: 'rgba(153, 102, 255, 0.5)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Feelings Frequency'
                }
            }
        }
    });
}

// Function to render a pie chart for tweet emotions
function renderTweetEmotionPieChart(tweetEmotionCounts) {
    const ctx = document.getElementById("tweetEmotionPieChart").getContext("2d");

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(tweetEmotionCounts),
            datasets: [{
                label : 'Sentiment Snapshot',
                data: Object.values(tweetEmotionCounts),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#FF6384', '#36A2EB', 
                    '#FFCE56', '#FF6384', '#36A2EB', '#FFCE56', '#FF6384', 
                    '#36A2EB', '#FFCE56'
                ],
            }]
        },
        options: {
            responsive: true,
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Feelings Frequency'
            }
        }
    });
}

// Function to render a radar chart for tweet emotions
function renderTweetEmotionRadarChart(tweetEmotionCounts) {
    const ctx = document.getElementById("tweetEmotionRadarChart").getContext("2d");

    const labels = Object.keys(tweetEmotionCounts);
    const dataValues = Object.values(tweetEmotionCounts);

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Feelings Palette',
                data: dataValues,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scale: {
                ticks: { beginAtZero: true }
            },
            elements: {
                line: {
                    tension: 0.2
                }
            }
        }
    });
}

// Function to get the last diary text up to a specified word limit
function getLastDiaryText(diaries, wordLimit = 10000) {
    let combinedText = '';
    let wordsCount = 0;

    for (let i = diaries.length - 1; i >= 0; i--) {
        const diaryText = diaries[i].diary; // Assuming the diary text is stored in 'diary'
        const diaryWords = diaryText.split(' ');

        if (wordsCount + diaryWords.length <= wordLimit) {
            combinedText += ' ' + diaryText; // Append the entire entry if within limit
            wordsCount += diaryWords.length; // Update word count
        } else {
            // Only take the remaining words needed to reach the limit
            const remainingWords = wordLimit - wordsCount;
            combinedText += ' ' + diaryWords.slice(0, remainingWords).join(' ');
            break; // Exit after reaching the limit
        }
    }

    return combinedText.trim(); // Return the combined text
}

// Function to render the word cloud from the diary text
function renderWordCloudFromText(diaryText) {
    const wordsArray = diaryText.split(' ').map(word => [word, 1]); // Each word gets a weight of 1
    renderWordCloud(wordsArray); // Call your existing word cloud rendering function
}

// Example word cloud rendering function using WordCloud library
function renderWordCloud(words) {
    const canvas = document.getElementById("wordCloudCanvas");
    
    // Clear the canvas before rendering a new word cloud
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    WordCloud(canvas, {
        list: words, // Array of [word, weight] pairs
        gridSize: 10,
        weightFactor: 10,
        color: () => `hsl(${Math.random() * 360}, 100%, 50%)`,
        rotateRatio: 0.5,
        rotationSteps: 2,
        backgroundColor: '#fff',
    });
}



// Ensure DOM is fully loaded before executing scripts
document.addEventListener("DOMContentLoaded", () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            fetchDiaryData();  // Fetch and display diary data
        } else {
            // alert("Please log in! Redirecting to login page.");
            // window.location.href = "index.html";  // Redirect to login page if not authenticated
        }
    });
});



// donut chart for financial emotions
function renderFinancialEmotionChart(data) {
    const ctx = document.getElementById("financialEmotionChart").getContext("2d");

    const emotionCounts = data.reduce((acc, entry) => {
        const emotion = entry.predictions.financial_emotion_prediction;
        acc[emotion] = (acc[emotion] || 0) + 1;
        return acc;
    }, {});

    new Chart(ctx, {
        type: 'pie', // or 'doughnut'
        data: {
            labels: Object.keys(emotionCounts),
            datasets: [{
                data: Object.values(emotionCounts),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // customize colors
            }]
        },
        options: {
            responsive: true,
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Financial Emotion Distribution'
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });
}


//distribution of mental health predictions
function renderMentalHealthChart(mentalHealthCounts) {
    const ctx = document.getElementById("mentalHealthChart").getContext("2d");

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(mentalHealthCounts),
            datasets: [{
                label: 'Count of Diary Entries',
                data: Object.values(mentalHealthCounts),
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Distribution of Mental Health Predictions'
                }
            }
        }
    });
}


