//Selections
const colorDivs = document.querySelectorAll('.color');
const generateBtn = document.querySelector('.generate');
const slider = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll('.color h2');
let initialColors;

//Functions

    //Color Generator

        /* function generateHex() {
            const letters = '0123456789ABCDEF';
            let hash = '#';
            for (let i = 0; i < 6; i++){
                hash += letters[Math.floor(Math.random() * 16)];
            }
            return hash;
        } */

        function generateHex() {
            const hexColor = chroma.random();
            return hexColor;
        }

        function randomColors() {
            colorDivs.forEach((div, index) => {
                const hexText = div.children[0];
                const randomColor = generateHex();

                //Add the color to the background
                div.style.backgroundColor = randomColor;
                hexText.innerText = randomColor;

                //Contrast Check
                checkTextContrast(randomColor, hexText);

                //Initial Colorize Sliders
                const color = chroma(randomColor);
                const sliders = div.querySelectorAll('.sliders input');
                const hue = sliders[0];
                const brightness = sliders[1];
                const saturation = sliders[2];

                colorizeSliders(color, hue, brightness, saturation);

            });
        } 
        
        function checkTextContrast(color, text) {
            const luminance = chroma(color).luminance();
            if (luminance > 0.5) {
                text.style.color = 'black';
            } else {
                text.style.color = 'white';
            }
        }
        
        function colorizeSliders(color, hue, brightness, saturation) {
            //scale Saturation
            const noSat = color.set('hsl.s', 0);
            const fullSat = color.set('hsl.s', 1);
            const scaleSat = chroma.scale([noSat, color, fullSat]);

            //scale Brightness
            const midBright = color.set('hsl.l', 0.5);
            const scaleBright = chroma.scale(["black", midBright, "white"]);

            //Update Input Colors
            saturation.style.backgroundImage = `linear-gradient(to right,${scaleSat(0)},${scaleSat(1)})`;
            brightness.style.backgroundImage = `linear-gradient(to right,${scaleBright(0)},${scaleBright(0.5)},${scaleBright(1)})`;
            hue.style.backgroundImage = `linear-gradient(to right,rgb(204,75,75),rgb(204,204,75),rgb(75,204,75),rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`;

        }
        
        
        randomColors();
    
