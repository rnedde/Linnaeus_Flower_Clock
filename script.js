let flowerData = [];
let width = 150;
let height = 150;
let time = new Date();
let currentHour;
let displayHour;


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
        console.log(flowerData);  // Log the data to the console
        createFlowerGrid();  // Call the function to create the flower grid
    })
    .catch(error => {
        console.error("There was a problem with the fetch operation:", error);
    });

// Define function to update time

function updateClock() {
    time = new Date();
    const currentHour = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const seconds = String(time.getSeconds()).padStart(2, '0');
    document.getElementById("current-time").textContent = `${currentHour}:${minutes}:${seconds}`;
}
// Update clock every second
updateClock();
setInterval(updateClock, 1000);


// Draws grid of flowers with information. 
function createFlowerGrid() {
    // console.log("creating flower grid with ", flowerData);

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
        <p><i>${flower.botanical_name}<i><p>
        <p>Opening Time: ${flower.opening_time}</p>
        <p>Closing Time: ${flower.closing_time}</p>`;

        // Draws garden plot and flower if applicable.
        new p5((p) => {
            p.setup = function () {

                let canvas = p.createCanvas(150, 150);
                canvas.parent(flowerDiv); // Attach to the div
                p.noStroke();
            };

            p.draw = function () {
                // displayHour = time.getHours();
                displayHour = 9;


                p.background(135, 104, 65);
                let isOpen = displayHour >= flower.opening_time && displayHour < flower.closing_time;

                if (isOpen) {
                    p.fill(flower.color);
                    p.ellipse(width / 2, height / 2, 40, 40); // Simple flower shape
                }

            };
        })
    }
    )
}