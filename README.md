# Huroof app 📚🎉

Welcome to the Huroof app! This project is designed to help you learn some of the hardest Arabic alphabet letters in a fun and interactive way using machine learning features. The app focuses on the following letters:
**س**،
**ش**،
**ر**،
**ك**

## [Demo 📹🔉](https://i.imgur.com/iaj9uPy.mp4)

<br/>

## Prerequisites 🚀

Before you begin, make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- A compatible Operating System: Windows, macOS, or Linux
- [Python 3.12+](https://www.python.org/downloads/)

<br/>

## Installation 🛠️

Follow these steps to get the project up and running:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/3bdop/Huroof-app.git
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the client:**

   ```bash
   npx expo start
   ```

4. **Start the server:**

   For a standard start:

   ```bash
   node server.js
   ```

   For debugging and live refresh:

   ```bash
   nodemon server.js
   ```

   > **Note**: Install `nodemon` globally if you haven't already:
   >
   > ```bash
   > npm install -g nodemon
   > ```

5. **Start main.py (FastAPI):**

   For standard start

   ```bash
   python backend/app/main.py
   ```

   For debugging and live refresh

   ```bash
   uvicorn backend.app.main:app --reload
   ```

6. **Download the Expo Go app** on your mobile device.

7. **Scan the QR code** provided by Expo to run the app on your device.

<br/>

## Development Environment Setup 🛠️

During development, you need to create an `env.js` file inside the [`config/`](./config/) directory with the following content:

```javascript
export const ENV = {
  SERVER_IP: "<your_server_ip_here>",
  SERVER_PORT: "<your_server_port_here>",
};
```

<br/>

## Python Model Development 🐍

Follow these steps to set up the Python environment for model development:

1. **Create a virtual environment:**

   For Windows:

   ```bash
   python -m venv .venv
   .\.venv\Scripts\activate.bat
   ```

   For Linux/macOS:

   ```bash
   python -m venv .venv
   source .venv/bin/activate
   ```

2. **Install Python dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

3. **Run Jupyter Notebooks:**

   ```bash
   jupyter notebook
   ```

   > **Note**: You can also use Jupyter notebooks directly within VSCode. Install the [Jupyter extension for VSCode](https://marketplace.visualstudio.com/items?itemName=ms-toolsai.jupyter) and open your notebooks in the editor.

<br/>

## Dev Resources

- [Letter Sounds](https://www.arabicreadingcourse.com/learn-the-arabic-alphabet.php)
<!-- [Letter Picture with Example - Pinterest](https://in.pinterest.com/pin/626211523219298954/) -->
- [Letters Picture with Example](https://warq.net/2021/05/08/%D8%AD%D8%B1%D9%88%D9%81-%D8%A7%D9%84%D8%A3%D8%A8%D8%AC%D8%AF%D9%8A%D8%A9-%D8%A7%D9%84%D8%B9%D8%B1%D8%A8%D9%8A%D8%A9-%D9%85%D9%84%D9%88%D9%86%D8%A9/)
