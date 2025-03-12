let flowerData = [];
let width = 150;
let height = 150;
let time = new Date();
let displayHour = time.getHours();
let timeoutDuration = 10000;
let timeoutId;




// Fetch data from json. 
fetch("flowers.json")
    .then(response => {
        if (!response.ok) {  // Check if response is OK (status 200-299)
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();  // Parse JSON if the response is successful
    })
    .then(data => {
        flowerData = data;
        createFlowerGrid();  // Call the function to create the flower grid
    })
    .catch(error => {
        console.error("There was a problem with the fetch operation:", error);
    });




// Define function to update time

function updateClock() {
    time = new Date();
    const hours = String(displayHour).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const seconds = String(time.getSeconds()).padStart(2, '0');
    document.getElementById("clock").textContent = `${hours}:${minutes}:${seconds}`;
    updateTimeFilter(); // Update the filter when time changes
}
// Update clock every second
updateClock();
setInterval(updateClock, 1000);

//change time based on button presses
function timeAdjust(){
    const backButton = document.getElementById("back");
    const forwardButton = document.getElementById("forward");
    const resetButton = document.getElementById("clock")
    
    backButton.addEventListener("click", function(){
        displayHour = (displayHour-1+24) %24; // Decrease hour, wrap around 0 to 23
        updateClock();
        restartTimeout();
        resetButton.style.color = "brown";
        
    })
    forwardButton.addEventListener("click", function(){
        displayHour = (displayHour+1) %24; // Decrease hour, wrap around 0 to 23
        updateClock();
        restartTimeout();
        resetButton.style.color = "brown";
        
    })
    resetButton.addEventListener("click", function(){
        displayHour = time.getHours();
        resetTime();
        
    })

    
}
timeAdjust();


function resetTime(){
    const resetButton = document.getElementById("clock")
    displayHour = String(time.getHours()).padStart(2, '0');
    resetButton.style.color = "beige";
    updateClock();
    
}

function restartTimeout(){
    clearTimeout(timeoutId);
    timeoutId = setTimeout(resetTime, timeoutDuration);
}

function updateTimeFilter() {
    const timeFilter = document.getElementById("timeFilter");

    // Adjust colors for morning, afternoon, and evening
    let filterColor = 'rgba(255, 255, 255, 0.5)'; // Default for midday (bright daylight)
    
    if (displayHour >= 6 && displayHour < 12) {
        // Morning (6 AM - 12 PM) - light yellow or warm tones
        filterColor = 'rgba(255, 223, 100, 0.5)'; // Soft warm color
    } else if (displayHour >= 12 && displayHour < 18) {
        // Afternoon (12 PM - 6 PM) - bright light
        filterColor = 'rgba(255, 255, 255, 0.5)'; // Bright daylight
    } else if (displayHour >= 18 || displayHour < 6) {
        // Evening/Night (6 PM - 6 AM) - darker, cool tones
        filterColor = 'rgba(0, 0, 50, 0.5)'; // Dark blue for night
    }
    
    timeFilter.style.backgroundColor = filterColor;
}



// Draws grid of flowers with information. 
function createFlowerGrid() {
   

    const garden = document.getElementById("garden");

    flowerData.forEach((flower, index) => {

        //Creates a container div, flower illustration div, and info div. 
        let flowerContainer = document.createElement("div");
        flowerContainer.classList.add("flower-container");

        flowerContainer.id = "flower" + index;
        garden.appendChild(flowerContainer);

        let flowerDiv = document.createElement("div");
        flowerDiv.classList.add("flower");
        flowerDiv.id = "flower" + index;
        flowerContainer.appendChild(flowerDiv);

        let infoDiv = document.createElement("div");
        infoDiv.classList.add("info-container")
        infoDiv.id = "info" + index;
        flowerContainer.appendChild(infoDiv);

        infoDiv.innerHTML = `
        <p>${flower.common_name}<p>
        <p><i>${flower.botanical_name}</i><p>
        <p>Opening Time: ${flower.opening_time}:00</p>
        <p>Closing Time: ${flower.closing_time}:00</p>`;

        // Draws garden plot and flower if applicable.
        new p5((p) => {
            p.setup = function () {

                let canvas = p.createCanvas(150, 150);
                canvas.parent(flowerDiv); // Attach to the div
                p.noStroke();
            };

            p.draw = function () {
                // displayHour = time.getHours();
                // displayHour = 9;

                

                p.background(135, 104, 65);
                let isOpen = displayHour >= flower.opening_time && displayHour < flower.closing_time;
                if (isOpen){
                    
                    if (displayHour >= 6 && displayHour <= 18) {
                        let sunAngle = ((displayHour - 6) / 12) * Math.PI; // Maps time (6 AM - 6 PM) to sun position
                    
                        // Shadow offset: Moves opposite to sun, shifts with elongation
                        let shadowOffsetX = Math.cos(sunAngle) * 30;
                        let shadowOffsetY = Math.sin(sunAngle) * 15 + 20;
                    
                        // Shadow size: More elongated in morning/evening
                        let elongationFactor = 1 + Math.abs(Math.cos(sunAngle)) * 0.5;
                        let shadowWidth = 60 * elongationFactor;
                        let shadowHeight = 40 * elongationFactor;
                    
                        // Shadow transparency: More diffuse at midday, sharper in morning/evening
                        let shadowAlpha = 80 + Math.abs(Math.sin(sunAngle)) * 50;
            
                        // Draw shadow
                        p.fill(0, 0, 0, shadowAlpha);
                        p.ellipse(width / 2 + shadowOffsetX, height / 2 + shadowOffsetY, shadowWidth, shadowHeight);
            
                    }
                    // Draw flower
                    p.fill(flower.color);
                    
                    p.setCenter(width/2, height/2);
                    p.polarSquares(12, 5,25);
                    p.polarSquares(12, 5,20);

                    p.ellipse(0, 0, 40, 40);
                    p.push();
                    p.fill(20,30,10);
                    p.blendMode(p.OVERLAY);
                    p.ellipse(0, 0, 40, 40);
                    p.pop();
                    
                }else{
                    p.setCenter(width/2, height/2);
                    p.fill(29, 77, 36)
                    
                    p.ellipse(0, 0, 20, 20);
                    p.push();
                    p.fill(20,30,10,10);
                    p.blendMode(p.OVERLAY);
                    p.polarTriangles(12,10,0);
                    p.pop();
                }
                
                
                
            };
        })
    }
    )
}

// Get the title and the popup
let title = document.getElementById('title');
let popup = document.getElementById('popup');
let close = document.getElementById('close');

// When the title is clicked, show the popup
title.onclick = function() {
    popup.style.display = 'flex';
}

// When the close button is clicked, hide the popup
close.onclick = function() {
    popup.style.display = 'none';
}

// Optional: Close the popup if clicking outside the popup content
window.onclick = function(event) {
    if (event.target === popup) {
        popup.style.display = 'none';
    }
}