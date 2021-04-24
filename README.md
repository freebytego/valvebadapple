# valvebadapple
Bad Apple for Source Engine

Tested in Portal 1 and Counter-Strike: Source

Not possible in Counter-Strike: Global Offensive, because "wait" command was removed.

## Usage:
You need to install Jimp
```
npm install jimp
```
After, get an image sequence of Bad Apple(You can make it yourself or get it from my other repo).
Create a folder "frames" where your index.js is located and move all frames there. 
Make sure that they are named like this: "frame0.jpg", "frame1.jpg" or just edit code.
Next, check **index.js** for some settings and paths. I really recommend you checking the code to see how it works

Run this app using command
```
node index.js
```
Move everything from ./badapple to cfg/ folder in your game files.
Open Console and type "exec start.cfg"
Enjoy!
