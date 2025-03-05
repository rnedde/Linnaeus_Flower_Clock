let flowers = [];
let flowerData;
let borderMargin = 50;

function preload() {

}

function setup() {
    createCanvas(windowWidth, windowHeight);

    textAlign(CENTER);

    flowerData = loadJSON("flowers.json",
        (data) => {
            flowerData = data;

            // Convert Json to an array. 
            for (let i = 0; i < flowerData.length; i++) {
                let data = flowerData[i];
                console.log(data);
                flowers.push(new Flower(data.botanical_name, data.opening_time, data.closing_time, data.color, data.botanical_name, data.common_name, random(0, width-borderMargin), random(0, height-borderMargin)));
            }
            console.log(flowers);
        },
        (error) => {
            console.error("Error loading JSON:", error);
        }
    );
}

function draw() {
    background(30);

    let t = new Date();
    // let currentHour = t.getHours(); 
    let currentHour = 8;


    // Display open flowers
    flowers.forEach(flower => {
        if (flower.isOpen(currentHour)) {
            flower.display();
            if (flower.isHovered(mouseX, mouseY)) {
                flower.onHover();  // Perform actions when hovered (e.g., highlight or show info)
            }
        }
    });
}

class Flower {
    constructor(name, openTime, closeTime, color, botanicalName, commonName, x, y,) {
        this.name = name;
        this.openTime = openTime; // Stored as a number (e.g., 5 for 5 AM)
        this.closeTime = closeTime;
        this.x = x;
        this.y = y;
        this.color = color;
        this.diameter = 20;
        this.botanicalName = botanicalName;
        this.commonName = commonName;
        this.textMoveY = 30;
    }

    isOpen(currentHour) {

        return currentHour >= this.openTime && currentHour < this.closeTime;
    }



    display() {
        fill(this.color);
        
        ellipse(this.x, this.y, 20, 20); // Simple circle for now
    }


    isHovered(mx, my) {
        // Check if mouse is inside the flower's circle (using distance formula)
        let distance = dist(mx, my, this.x, this.y);
        return distance < this.diameter / 2;
    }

    onHover() {
        fill(255, 255, 255);
        text(this.commonName, this.x, this.y + this.textMoveY);
        textStyle(ITALIC);
        text(this.botanicalName, this.x, this.y + this.textMoveY+20)
        text("Opening Time: " + this.openTime + ":00" + "\nClosing Time: " + this.closeTime + ":00", this.x, this.y + this.textMoveY+40);


    }

}
