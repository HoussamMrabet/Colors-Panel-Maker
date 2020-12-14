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
        
        
        randomColors();
    
