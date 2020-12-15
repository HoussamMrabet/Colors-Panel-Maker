//Variables
    const colorDivs = document.querySelectorAll('.color');
    const generateBtn = document.querySelector('.generate');
    const sliders = document.querySelectorAll('input[type="range"]');
    const currentHexes = document.querySelectorAll('.color h2');
    const popup = document.querySelector('.copy-container');
    const adjustButton = document.querySelectorAll('.adjust');
    const lockButton = document.querySelectorAll('.lock');
    const adjustClose = document.querySelectorAll('.close-adjustment');
    const sliderContainers = document.querySelectorAll('.sliders');
    let initialColors;

    //Local Storage
    let savedPanel = [];

//Events Listeners

    generateBtn.addEventListener('click', randomColors);

    sliders.forEach(slider => {
        slider.addEventListener('input', hslControls);
    });

    colorDivs.forEach((div, index) => {
        div.addEventListener('input', () => {
            updateTextUI(index);
        });
    });

    currentHexes.forEach(hex => {
        hex.addEventListener('click', () => {
            copyToClipboard(hex);
        });
    });

    popup.addEventListener('transitionend', () => {
        const popupBox = popup.children[0];
        popup.classList.remove('active');
        popupBox.classList.remove('active');
    });

    adjustButton.forEach((adjust, index) => {
        adjust.addEventListener('click', () => {
            sliderContainers[index].classList.toggle('active');
        });
    });

    adjustClose.forEach((closer, index) => {
        closer.addEventListener('click', () => {
            sliderContainers[index].classList.remove('active');
        });
    });

    lockButton.forEach((button, index) => {
        button.addEventListener("click", e => {
          lockLayer(e, index);
        });
    });
      
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
            initialColors = [];
            colorDivs.forEach((div, index) => {
                const hexText = div.children[0];
                const randomColor = generateHex();

                //Keeping the preview value while it is locked
                if (div.classList.contains('locked')) {
                    initialColors.push(hexText.innerText);
                    return;
                } else {
                    initialColors.push(chroma(randomColor).hex());
                }

                //Add the color to the background
                div.style.backgroundColor = randomColor;
                hexText.innerText = randomColor;

                //Check Text Contrast
                checkTextContrast(randomColor, hexText);


                //Initial Colorize Sliders
                const color = chroma(randomColor);
                const sliders = div.querySelectorAll('.sliders input');
                const hue = sliders[0];
                const brightness = sliders[1];
                const saturation = sliders[2];

                colorizeSliders(color, hue, brightness, saturation);

            });

            //reset Inputs
            resetInputs();

            //Check Buttons Contrast
            adjustButton.forEach((button,index) => {
                checkTextContrast(initialColors[index], button);
                checkTextContrast(initialColors[index], lockButton[index]);
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
            hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75),rgb(204,204,75),rgb(75,204,75),rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`;

        }
        
        function hslControls(e){
            const index =
                e.target.getAttribute('data-bright') ||
                e.target.getAttribute('data-sat') ||
                e.target.getAttribute('data-hue');
            
            let sliders = e.target.parentElement.querySelectorAll('input[type="range"]');
            const hue = sliders[0];
            const brightness = sliders[1];
            const saturation = sliders[2];

            const bgColor = initialColors[index];

            let color = chroma(bgColor)
                .set('hsl.s', saturation.value)
                .set('hsl.l', brightness.value)
                .set('hsl.h', hue.value);
            
            colorDivs[index].style.backgroundColor = color;

            //Update Inputs
            colorizeSliders(color, hue, brightness, saturation);

        }
        
        function updateTextUI(index) {
            const activeDiv = colorDivs[index];
            const color = chroma(activeDiv.style.backgroundColor);
            const textHex = activeDiv.querySelector('h2');
            const icons = activeDiv.querySelectorAll('.controls button');
            textHex.innerText = color.hex();

            //Contrast
            checkTextContrast(color, textHex);
            for(icon of icons) {
                checkTextContrast(color, icon);
            }

        }
        
        function resetInputs() {
            const sliders = document.querySelectorAll('.sliders input');
            sliders.forEach(slider => {
                if (slider.name === 'hue') {
                    const hueColor = initialColors[slider.getAttribute('data-hue')];
                    const hueValue = chroma(hueColor).hsl()[0];
                    slider.value = Math.floor(hueValue);
                }
                if (slider.name === 'brightness') {
                    const brightColor = initialColors[slider.getAttribute('data-bright')];
                    const brightValue = chroma(brightColor).hsl()[2];
                    slider.value = Math.floor(brightValue * 100) / 100;
                }
                if (slider.name === 'saturation') {
                    const satColor = initialColors[slider.getAttribute('data-sat')];
                    const satValue = chroma(satColor).hsl()[1];
                    slider.value = Math.floor(satValue * 100) / 100;
                }
            });
        }
        
        function copyToClipboard(hex) {
            
            //Copy the Hex Value
            const el = document.createElement('textarea');
            el.value = hex.innerText;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);

            //Pop Up Animation
            const popupBox = popup.children[0];
            popup.classList.add('active');
            popupBox.classList.add('active');

        }
        
        function lockLayer(e, index) {
            const lockSVG = e.target.children[0];
            const activeBg = colorDivs[index];
            activeBg.classList.toggle("locked");
        
            if (lockSVG.classList.contains("fa-lock-open")) {
                e.target.innerHTML = '<i class="fas fa-lock"></i>';
            } else {
                e.target.innerHTML = '<i class="fas fa-lock-open"></i>';
            }
        }
        
        //Implement Save to panel and Local Storage Stuff
        const saveBtn = document.querySelector('.save');
        const submitSave = document.querySelector('.submit-save');
        const closeSave = document.querySelector('.close-save');
        const saveContainer = document.querySelector('.save-container');
        const saveInput = document.querySelector('.save-container input');
        const libraryContainer = document.querySelector('.library-container');
        const libraryBtn = document.querySelector('.library');
        const closeLibraryBtn = document.querySelector('.close-library');
        
        //Local Storage Event Listeners
        saveBtn.addEventListener('click', openPanel);
        closeSave.addEventListener('click', closePanel);
        submitSave.addEventListener("click", savePanel);
        libraryBtn.addEventListener('click', openLibrary);
        closeLibraryBtn.addEventListener('click', closeLibrary);

                
        function openPanel(e) {
            const popup = saveContainer.children[0];
            saveContainer.classList.add('active');
            popup.classList.add('active');
        }
        
        
        function closePanel(e) {
            const popup = saveContainer.children[0];
            saveContainer.classList.remove('active');
            popup.classList.remove('active');
        }   
        
        function savePanel(e) {
            saveContainer.classList.remove('active');
            popup.classList.remove('active');
            const name = saveInput.value;
            const colors = [];
            currentHexes.forEach(hex => {
                colors.push(hex.innerText);
            });
            //Generate Object
            let panelNbr = savedPanel.length;
            const panelObj = { name, colors, nbr: panelNbr };
            savedPanel.push(panelObj);

            //Save to Local Storage
            savetoLocal(panelObj);
            saveInput.value = "";

            //Generate the panel for Library
            const panel = document.createElement('div');
            panel.classList.add('custom-panel');
            const title = document.createElement('h4');
            title.innerText = panelObj.name;
            const preview = document.createElement('div');
            preview.classList.add('small-preview');
            panelObj.colors.forEach(smallColor => {
                const smallDiv = document.createElement('div');
                smallDiv.style.backgroundColor = smallColor;
                preview.appendChild(smallDiv);
            });
            const panelBtn = document.createElement('button');
            panelBtn.classList.add('pick-panel-btn');
            panelBtn.classList.add(panelObj.nbr);
            panelBtn.innerText = 'Select';

            //Button event
            panelBtn.addEventListener('click', e => {
                closeLibrary();
                const panelIndex = e.target.classList[1];
                initialColors = [];
                savedPanel[panelIndex].colors.forEach((color, index) => {
                    initialColors.push(color);
                    colorDivs[index].style.backgroundColor = color;
                    const text = colorDivs[index].children[0];
                    checkTextContrast(color, text);
                    updateTextUI(index);
                });
                libraryInputUpdate();
            })

            //Append to the Library
            panel.appendChild(title);
            panel.appendChild(preview);
            panel.appendChild(panelBtn);
            libraryContainer.children[0].appendChild(panel);

        }
        
        function savetoLocal(panelObj) {
            let localPanel;
            if (localStorage.getItem('panel') === null) {
                localPanel = [];
            } else {
                localPanel = JSON.parse(localStorage.getItem('panel'));
            }
            localPanel.push(panelObj);
            localStorage.setItem('panel', JSON.stringify(localPanel));
        }
        
        function openLibrary(){
            const popup = libraryContainer.children[0];
            libraryContainer.classList.add('active');
            popup.classList.add('active');
        }
            
        function closeLibrary(){
            const popup = libraryContainer.children[0];
            libraryContainer.classList.remove('active');
            popup.classList.remove('active');
        }
            

        randomColors();
    
