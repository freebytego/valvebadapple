const Jimp = require('jimp');
const fs = require('fs');

const ASCII_CHARS = [".", ".", ".", ".", "-", "=", "+", "*", "#", "%", "@"];
const INPUT_FRAMES_DIR = "./frames/";
const INPUT_FRAME_BASENAME = "frame"
const INPUT_FRAME_EXTENSION = "jpg";
const WORKING_DIR = "./badapple/"
const START_CFG_NAME = "start.cfg";

const GAME = "portal" //Tested games: Portal 1("portal"), Counter-Strike: Source("css"). Feel free to test different games

let files = fs.readdirSync(INPUT_FRAMES_DIR);
let countedFiles = -1;

function generateStartCFG() {
    fs.mkdir(WORKING_DIR + `/frames`, {recursive: true}, (err) => {
        if (err) throw err;
        console.log(`Working folder has been created! ${WORKING_DIR}`)
    })
    let cfg = "";
    if (GAME == "portal") {
        cfg = `
        exec frames/frame0.cfg
        `;
    } else if (GAME == "css") {
        cfg = `
        //fps_max 36                       //Running at 36 fps, because of how 'wait' command works in CSS
        //alias framewait "wait;wait;wait" //3 wait commands at 36 fps = 1/24 sec.
        exec frames/frame0.cfg
        `
    }
    fs.writeFile(WORKING_DIR + START_CFG_NAME, cfg, (err) => {
        if (err) throw err;
        console.log(`Start Config has been created! Saved as ${WORKING_DIR + START_CFG_NAME}`)
    });
    console.log("The app is not frozen. It's just doing some magic! (It can take a while)")
}

function resizeGrayImage(image, new_width = 100) {
    const new_height = 30;
    const resizedImage = image.resize(new_width, new_height).grayscale();
    return resizedImage;
}

function pixelsToChar(image) {
    const pixels = image.bitmap.data;
    let chars = "";
    for (let index = 0; index < pixels.length; index += 4) {
        const grayscaleAverage = (pixels[index] + pixels[index + 1] + pixels[index + 2]) / 3;
        chars += ASCII_CHARS[~~(grayscaleAverage / 25)];
    }
    return chars;
}

function createFrame(image, new_width = 100, frameNumber) {
    const resizedImage = resizeGrayImage(image, new_width);
    const newImage = pixelsToChar(resizedImage);
    const totalPixels = newImage.length;
    let frame = "clear;";
    for (let i = 0; i < totalPixels; i += new_width) {
        frame += "\n echo " + `"${newImage.slice(i, i + new_width)}";`;
    }
    if (frameNumber != countedFiles) {
        frame += `wait 15; exec frames/frame${frameNumber+1}.cfg;`
    }
    return frame;
}
//
// Main Code here
//
generateStartCFG()
for(let i = 0; i < files.length; i++) {
    if (files[i].includes(`.${INPUT_FRAME_EXTENSION}`)) countedFiles += 1;
}

for (let i = 0; i <= countedFiles; i++) {
    const frame = Jimp.read(`${INPUT_FRAMES_DIR}${INPUT_FRAME_BASENAME}${i}.${INPUT_FRAME_EXTENSION}`, (err, im) => {
        console.log(`Creating config file for frame ${i}`)
        fs.writeFile(WORKING_DIR + `/frames/frame${i}.cfg`, createFrame(im, 100, i), (err) => {
            if (err) throw err;
        })
    })
}

