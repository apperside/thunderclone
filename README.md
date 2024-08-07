<p align="center">
  <img src="https://github.com/user-attachments/assets/db354edc-416c-4403-bc46-1511c711b3cd" width="100" />
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

- a chrome extension will inject a button to the github repository page. When clicked, it will send a message to a desktop agent app

- the electron based agent app (which must be running locally) will listen to the extension and clone the repository in a folder of your choice

- using AI, the app will try to understand the list of commands needed to run the project and return the list of commands in json format to be executed by the client electron app

- the desktop agent app will then run the commands

> 👉 **READ CAREFULLY** 👈
> This is a super early stage project, just the seed of an idea.
> In order to mitigate security risks (of running a local websocket which clones locally an arbitrary repository), the agent app at the moment requires to enter a password to run.
> This password is saved in memory and never stored anywhere, you can read more ahead about how it is used
> 
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

## 🔐 Password Protection System

Thunderclone implements a password protection system to enhance security when cloning repositories. This system ensures that only authorized users can initiate the cloning process. Here's how it works:

### Desktop App Setup

1. When you first launch the Thunderclone desktop app, you'll be prompted to set a password.
2. This password is stored securely in the app's memory and is used to authenticate clone requests.

### Chrome Extension

1. The Chrome extension adds a "Thunderclone" button to GitHub repository pages.
2. When you click this button, a small popup appears, asking for the password you set in the desktop app.

### Cloning Process

1. After entering the password in the Chrome extension popup, the extension creates a secure signature using the following information:
   - The GitHub repository URL
   - The current timestamp
   - The entered password

2. This signature, along with the repository URL and timestamp, is sent to the desktop app.

3. The desktop app receives this information and verifies the signature using the stored password.

4. If the signature is valid and the timestamp is recent, the desktop app proceeds with cloning the repository.

5. If the signature is invalid or the timestamp is too old, the cloning request is rejected.

### Security Benefits

- The password is never transmitted directly between the extension and the desktop app.
- The signature system prevents replay attacks, as each request has a unique timestamp.
- Even if someone intercepts the communication, they can't clone repositories without knowing the password.

### Important Notes

- You'll need to enter this password each time you want to clone a repository using Thunderclone.
- If you forget the password, you'll need to restart the desktop app and set a new password.
- The password is not stored persistently, so it's reset when you close and reopen the desktop app.

This system provides a balance between security and convenience, ensuring that your Thunderclone usage remains protected while still being user-friendly.

## 🛠️ Features overview

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
  - [x] Better error handling (eg: socket not connected)

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

cd thunderclone

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

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/apperside/thunderclone/issues).

## 📝 License

This project is [MIT](https://opensource.org/licenses/MIT) licensed.

---

Made with ❤️ by [Your Name](https://github.com/yourusername)
