<p align="center">
  <img src="https://github.com/user-attachments/assets/2dc5f9cd-1471-41af-b3fc-db916c1dff84" width="100" />

</p>
<p align="center">
    <h1 align="center">⚡ THUNDERCLONE ⚡</h1>
</p>
<p align="center">
    <em>Instantly clone and run locally any github repository!</em>
</p>
<p align="center">
	<img src="https://img.shields.io/github/license/apperside/dockerify.ai?style=flat&color=0080ff" alt="license">
	<img src="https://img.shields.io/github/last-commit/apperside/dockerify.ai?style=flat&logo=git&logoColor=white&color=0080ff" alt="last-commit">
	<img src="https://img.shields.io/github/languages/top/apperside/dockerify.ai?style=flat&color=0080ff" alt="repo-top-language">
	<img src="https://img.shields.io/github/languages/count/apperside/dockerify.ai?style=flat&color=0080ff" alt="repo-language-count">
<p>

![version 1.0.0](https://img.shields.io/badge/version-1.0.0-blue.svg) ![license MIT](https://img.shields.io/badge/license-MIT-green.svg)

Thunderclone's goal is to allow you tu run locally any github repository with just the click of a button, like if the repo was brought on your machine by a thunder! 😎

The idea is the following:

- a chrome extension will inject a button to the github repository page. When clicked, it will send a message to a local electron app

- the headless electron app (which must be running locally) will listen to the extension and clone the repository in a folder of your choice

- using AI, the app will try to understand the list of commands needed to run the project and return the list of commands in json format to be executed by the client electron app

- the electron app will then run the commands

> 👉 **READ CAREFULLY** 👈
> This is a super early stage project, just the seed of an idea. The electron desktop app will run a local socket listener **completely unprotected** at the moment, so **there are security implications** running this app
## 🛠️ Demo video


https://github.com/user-attachments/assets/c89fcf28-a140-4b51-8e57-dc2e0709782f


## 🛠️ Components

The repository, as it is now, is just a "box" for 2 distinct projects located in their own folders.
In the future it will become a monorepo.
The project is composed of:

### 1\. Electron Desktop App

The desktop application serves as the core of Thunderclone. It:

- Starts a local WebSocket server

- Manages repository cloning operations

- Allows users to specify and manage clone directories and other preferences (eg: openai api key)

### 2\. Chrome Extension

The browser extension enhances the GitHub experience by:

- Adding a "Clone" button to GitHub repository pages

- Sending clone requests to the Electron app via WebSocket

## 🌟 Features overview

This is an high level overview of the features with their current status.

- 🖥️ Electron desktop app for managing cloned repositories

  - [x] Electron app running locally and listening on socket
  - [x] Headless mode with tray icon to start and stop the server
  - [x] Handle clone message sent from extension and clone the repo
  - [ ] Configuration panel.
        Until this is is not done, the repository will be cloned in the following path: `<user-home-dir>/.thunderclone/<repo-owner>/<repo-name>`, with configuration panel it will be configurable
  - [ ] Automatically run locally the project by parsing the readme file with AI.
        Until the configuration panel is not implemented, we cannot ask AI api key
  - [ ] Start at system startup

- 🧩 Chrome extension for one-click cloning from GitHub

  - [x] Chrome extension that adds a button to a GitHub repository's home page
  - [x] Clicking the button call the extension which clones the repo
  - [ ] Customize button
  - [ ] Configuration panel
  - [ ] Better error handling (eg: socket not connected)

- 🔗 WebSocket communication between the extension and desktop app

- ⚡ Instant cloning with a single click

## 🚀 Getting Started

> For now it has been tested it only on a mac

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher)

- [Google Chrome](https://www.google.com/chrome/) browser

### Installation

For now this project is just a repository with 2 separate folders each one containing a project. I'd like to make it a monorepo when I will have time

1. Clone this repository:

git clone https://github.com/apperside/github-cloner.git

cd thunder clone

2. Install dependencies:

npm install

3. Build the Electron app:

npm start

4. Install the Chrome extension:

- Open Chrome and navigate to `chrome://extensions`

- Enable "Developer mode"

- Click "Load unpacked" and select the `browser-extension` folder from this project

### Usage

1. Launch the Electron app:

npm start

2. In the Electron app, specify your preferred clone directory

3. Navigate to any GitHub repository in Chrome

4. Click the "Thunderlone" button added by the extension

5. The repository will be instantly cloned to `<user-home-dir>/.thunderclone/<repo-owner>/<repo-name>` folder

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/github-cloner/issues).

## 📝 License

This project is [MIT](https://opensource.org/licenses/MIT) licensed.

---

Made with ❤️ by [Your Name](https://github.com/yourusername)
