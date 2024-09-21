# auction-website

This project is an auction platform where users can create, bid on, and manage auction listings. Registered users can place bids, while unregistered users can browse through listings. The project is built using HTML, SCSS, JavaScript, and follows the guidelines specified by the project brief.

## Features

- **User Registration**: Users can register using their `stud.noroff.no` email.
- **User Login/Logout**: Registered users can login and logout of the platform.
- **Profile Management**: Users can update their profile, including uploading an avatar.
- **View and Bid on Listings**: Users can view listings and place bids on items listed by others.
- **Create Listings**: Users can create new listings with titles, descriptions, media, and deadlines.
- **View User’s Own Listings and Bids**: Users can see which listings they’ve created and which listings they’ve bid on.
- **Search Functionality**: Both unregistered and registered users can search through listings.

## Technologies

- **HTML5**: For structuring the web pages.
- **SCSS/SASS**: For styling, ensuring code maintainability and efficiency.
- **JavaScript (ES6)**: For dynamic functionality and API integration.
- **Bootstrap 5**: For responsive layout and UI components.
- **Noroff Auction API**: For managing users, listings, and bids.
- **GitHub Pages**: For static hosting.

## Setup Instructions

### Prerequisites
- **Node.js**: Ensure you have Node.js installed (v14.x or higher).
- **Git**: You'll need Git installed to clone the repository.

### Cloning the Project

1. Clone the repository using Git:

```bash
git clone: https://github.com/voidwaker/auction-website.git
cd auction-website
```
### Install dependencies:
This project uses a package manager. Ensure all dependencies are installed by running:
```bash
npm install
```
### Running the Project Locally
To run the project locally and see changes in real time, you can use Vite (or another static server if you have one).
```bash
npm run dev
```
### Build for Production
To create a production build, run:
```bash
npm run build
```
The build will be generated in the dist folder.

# Usage

### Navigation
- **Home**: Unregistered users can browse listings and search for items on the homepage.
- **Register/Login**: Users can register using their stud.noroff.no email and log in to access full functionality.
- **Profile**: After logging in, users can access their profile to update their avatar, view credits, manage listings, and see which items they’ve bid on.
- **Create Listing**: Logged-in users can create auction listings with media and deadlines.
- **Bidding**: Registered users can bid on active auctions created by other users.
### API Integration
The project uses the Noroff Auction API to manage listings, users, and bids. For full API documentation, please refer to the Noroff Auction API.

### Explanation of Key Sections:

1. **Features**: A list of functionalities offered by the project, including user registration, auction creation, bidding, and more.
   
2. **Technologies**: An overview of the technologies used in the project, such as SCSS, Bootstrap, JavaScript, and the Noroff Auction API.

3. **Setup Instructions**: This section provides clear instructions on how to set up the project locally, which dependencies need to be installed, and how to build and run the application.

4. **Usage**: A simple guide on how to use the application, including navigation and functionality for both registered and unregistered users.

5. **Known Issues / Future Improvements**: Any known issues or areas you would like to improve in the future. This is optional but useful if there are certain features that still need enhancement.



