# GameShelf — Game Backlog Tracker

A small, responsive video game backlog tracker made with plain HTML, CSS, and JavaScript. Add games to a personal library, keep their status up to date, and search or filter the list.

## Features

- Add, edit, and remove games
- Track **Want to Play**, **Playing**, and **Completed** statuses
- Search by title, genre, or platform
- Filter by status
- See live library counts
- Save the list in browser `localStorage`
- Display local cover art for the four sample games, with initials as a fallback
- Edit a local player profile with a username and picture
- Responsive layout for desktop and mobile

## Run it on your computer

1. Download and unzip the project.
2. Open the `game-backlog-tracker` folder in Visual Studio Code.
3. Open `index.html` in a browser, or use the Live Server extension in VS Code.

There is no build step or package installation.

The sample cover art is stored in the `images` folder. Keep that folder beside `index.html`, `style.css`, and `script.js` when you upload the project.

The profile editor is a local demo: it saves the username and picture in the current browser. It does not create a login or sync profiles between devices. A real account system would need an authentication service and cloud storage.

## Publish with GitHub Pages

1. Create a GitHub repository for the project.
2. Upload `index.html`, `style.css`, `script.js`, and this `README.md` to the repository’s root folder.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**, choose your main branch and the `/ (root)` folder, then save.
5. After GitHub Pages finishes publishing, open the site link GitHub provides.

## Add it to a portfolio

Add a project card to your portfolio with a short description such as:

> GameShelf is a responsive game backlog tracker built with HTML, CSS, and JavaScript. It uses DOM events, array filtering, and localStorage to help players organize games by status.

Link the card to both the live GitHub Pages site and the project repository.

## What this project practices

- Selecting and updating page elements with the DOM
- Handling form submissions and button clicks
- Filtering arrays with `filter()` and `includes()`
- Creating elements safely with `createElement()` and `textContent`
- Saving and loading JSON with `localStorage`
- Reading an uploaded image with `FileReader`
- Responsive CSS and accessible labels

## Important note about saved data

The library is stored in the current browser on the current device. It does not sync between devices or browsers. Use the **Add a game** form to change the sample collection; edits are saved automatically.
