# Chef Clam - A vanilla JavaScript web-game

In this game, you play a Chef Clam who makes a living feeding the snail population in Maple Island. Spend your day working, and your nights running errands and upgrading your Food Stand. 
Use the Arrow Keys to move, and Space key to perform actions/throw food. 

An exercise in Object Oriented Programming, DOM manipulation, and JavaScript programming. 
**With the power of Javascript, you can play the latest deployment of this game easily in your browser by visiting: https://clamgamebeta.netlify.app/**

GAME ARCHITECTURE BASICS:
- Built with Object-Oriented Programming architecture; game objects are represented by unique classes
- Used DOM manipulation; implemented Event Listeners to handle user input 
- Obects drawn to screen with HTML canvas
- Implemented a simple gamestate design pattern to manage & initiate/terminate functions depending on the current phase of the game. 
- Implemented Day/Night cycles, different 'locations', upgrade functionality, and more.

TECHNICAL ACHIEVEMENTS:
- Created gameloop with a stabilized frame rate of 100fps on all computers/browsers. Did this by implementing a recursive gameloop which ingests the current timestamp, and checks the difference between the last timestamp. If the change in time is >= 10 milliseconds, the next frame is updated. This means a new frame is loaded 100 times a second, so the game framerate is cemented at 100 frames per second regardless of the user's browser speed.
- Simulated randomness in object generation & movement by using a random integer function, and performing actions according to the random integer generated
