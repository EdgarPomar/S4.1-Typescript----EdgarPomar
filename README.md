## Start editing…Weather Jokes App
This project is an interactive web application that combines weather
information and jokes from different APIs. It features a scoring system
for the jokes, the ability to switch between cities to get weather
updates, and a fun way to enjoy both weather forecasts and humor.

### Features

Weather Information: Display current weather data for a selected city.

1. Jokes API: Get random jokes from various APIs (Chuck Norris jokes, Dad
Jokes, and more).

2. Score System: Users can rate jokes with a simple upvote/downvote system.

3. Dynamic City Selection: Switch between different cities to get updated
weather data.

4. Responsive Design: The app adjusts to different screen sizes for both
desktop and mobile users.


### Technologies Used

- HTML5: Structure of the webpage.

- CSS3: Styling with Flexbox and custom styling for buttons, backgrounds,
etc.

- TypeScript: Logic for handling API requests, joke rating system, and
user interaction.

- Weather API: The app fetches weather data from
https://www.el-tiempo.net/api/json/v2/home for displaying real-time
weather information.

- Jokes APIs: The app integrates multiple joke APIs to fetch and display
jokes. These include:

1. Chuck Norris Jokes API

2. Dad Jokes API

3. JokeAPI

## Getting Started 
### Prerequisites

- Web browser (Chrome, Firefox, etc.)

- An internet connection to fetch the weather and jokes data.

### Installation

1. Clone the repository:
  ```bash
  git clone https://github.com/EdgarPomar/S4.1-Typescript----EdgarPomar.git
  ```
2. Open index.html in your browser to view the app.

### API Integration T

The app uses the following APIs:
1. Weather API: To get the weather data by city.
   
- Endpoint: https://www.el-tiempo.net/api/json/v2/home
- Example: https://www.el-tiempo.net/api/json/v2/home?city=NewYork

2. Jokes APIs:

- Chuck Norris Jokes: Provides random Chuck Norris jokes.

- Dad Jokes API: Provides a collection of dad jokes.

- JokeAPI: A general joke API that fetches various types of jokes.

### How to Contribute

1. Fork this repository.

2. Create a new branch for your feature or bug fix.

3. Make your changes and commit them.

4. Push to your forked repository.

5. Open a pull request to the original repository.

### Future Improvements

- Add more APIs for jokes and weather data.

- Implement user authentication and a custom dashboard.

- Enhance the scoring system for better joke interaction.

- Improve mobile responsiveness for a smoother user experience.

