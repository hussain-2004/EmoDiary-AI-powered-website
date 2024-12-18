**EmoDiary: AI Powered Website**
-------------------------

EmoDiary is a unique, AI-driven web application designed to help users reflect on their daily thoughts and emotions, enabling a deeper understanding of personal mental well-being. With advanced machine learning models at its core, EmoDiary goes beyond simple journaling by providing tailored emotional insights, making it an empowering tool for self-reflection and personal growth.

**Key Features**

**1.	Personalized Emotional Insights:** EmoDiary is built with personalization in mind. Each user’s diary entries are processed individually to create custom emotional feedback and analysis. This personalized approach means your insights are unique to you, enhancing the relevance and value of each interaction.

**2.	Secure & Reliable Firebase Integration:** User data is securely managed and stored using Google Firebase, ensuring that only you have access to your personal entries. Firebase Authentication also provides seamless login support, giving you secure access to your entries across devices.

**3.	Advanced Machine Learning for Emotion & Toxicity Detection:** Using a Flask-based backend server, EmoDiary integrates pre-trained ML models to analyze the tone of your writing and identify toxic or negative language patterns. This helps users become aware of their emotional state and language patterns in a constructive way.

**4.	Interactive Data Visualization:** EmoDiary offers beautiful, interactive visualizations to track your emotional progress. These charts and graphs allow you to visualize your emotional trends over time, providing an engaging and insightful look into your personal growth journey.

**5.	User-Friendly Interface:** The interface is designed for simplicity and ease of use, ensuring that users of all backgrounds can seamlessly navigate the application. Each feature is crafted with user experience in mind, offering an inviting and intuitive journaling experience.

**EmoDiary combines the best of web technologies to deliver a powerful experience:**

**1.	Frontend:** Built with responsive design principles and interactive components for seamless user engagement.

**2.	Backend:** Powered by Flask, with robust machine learning models pre-trained to deliver accurate emotional analysis.

**3.	Database & Authentication:** Firebase is used for both secure storage of entries and Google-based authentication, ensuring data privacy and access security.

Whether you’re seeking to gain more emotional awareness, track your mental well-being, or better understand patterns in your daily life, EmoDiary is crafted to be a trustworthy companion on your journey to self-awareness and personal growth.

**Demonstration**
------------------------


https://github.com/user-attachments/assets/a2fdf4bf-af7c-43bb-894b-cb16b42f7917



**Screenshots**
------------------------

**HomePage :**

<img width="1436" alt="image" src="https://github.com/user-attachments/assets/08a2d411-f1bf-493e-afc0-a4f7826e3cd5">


**Profile Page :**

<img width="1440" alt="image" src="https://github.com/user-attachments/assets/b21b7354-7122-435f-946d-a679eabe7662">



**Latest Vibes Pages (Latest diary insights) :**

<img width="1440" alt="image" src="https://github.com/user-attachments/assets/e54a0097-8c9a-484c-a17c-fb3e5284d320">



**Performance Snapshot (Which includes Overall Performance) :**

<img width="1440" alt="image" src="https://github.com/user-attachments/assets/2fa34006-5ead-439b-a05f-4000e78b9cf7">


**Analytics Dashboard :**

<img width="1438" alt="image" src="https://github.com/user-attachments/assets/ddde956a-9599-4379-b5f3-4d0b21ab5244">
<img width="1436" alt="image" src="https://github.com/user-attachments/assets/f5a2f516-5bcb-49d9-8b3b-66941d395746">
<img width="1440" alt="image" src="https://github.com/user-attachments/assets/c32cd9a2-1f11-414a-a1c1-0bc85ddd5029">
<img width="1438" alt="image" src="https://github.com/user-attachments/assets/0302f6d8-f808-42e4-8a24-be2f6cd41699">
<img width="1438" alt="image" src="https://github.com/user-attachments/assets/288a21c6-8d3e-4746-a749-014213128ba2">



**Home Page Content :**

![image](https://github.com/user-attachments/assets/2e6e8dd5-f518-417a-bd3d-95c9f9d73664)
<img width="1440" alt="image" src="https://github.com/user-attachments/assets/04bde867-f0ec-457f-a144-7b0a6e0abb05">
<img width="1419" alt="image" src="https://github.com/user-attachments/assets/6abd310d-1094-4259-8f6e-ee59c19c5100">
<img width="1433" alt="image" src="https://github.com/user-attachments/assets/14fea4e1-f1e8-4a31-934e-9899db31a719">
<img width="1405" alt="image" src="https://github.com/user-attachments/assets/a822732f-faf1-4b7d-9cce-5f8b6f1fb606">

**Footer :** 

![image](https://github.com/user-attachments/assets/602285c8-c4d8-4bdb-96e5-2695421e71ca)

**About Us Page :** 

<img width="1432" alt="image" src="https://github.com/user-attachments/assets/a32682a8-b2fb-4790-9f5f-d1e7db5d2fa6">

**Contact Us Page :**

<img width="1381" alt="image" src="https://github.com/user-attachments/assets/33eb367a-6836-4f7c-986f-1b406ee0d1b5">

**How to run this project in your machine?**
-------------------------------------------------
Make Sure to Create and Use a config.js File for API Keys or Configuration Variables

Follow these steps to set up and use a config.js file in your project:

	1.	Rename **sample_config.js** file to **config.js**:
 
	2.	Add your configuration variables in config.js:
	            • Make sure to add your google auth configuration api keys and backend server url.
	            • Refer sample_config.js for more clarity.

 
Make sure you have pip installed in your system. Once that is done, open the project folder and also ensure that Python 3 and the venv module are installed on your system to use the python3 -m venv venv command.

**Set up a virtual environment to isolate the project’s dependencies:**

`python3 -m venv venv`

**Activate the virtual environment:**

`source venv/bin/activate`

**Install Dependencies from requirements.txt :**

`pip install -r requirements.txt`

**Make sure to run the server locally:**

`python server/app.py`

Now, You can start using the website :)






