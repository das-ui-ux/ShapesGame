const canvasWidth = 800;
const canvasHeight = 600;

class CanvasApp {
    constructor() {
		this.setupUIInfo();
        this.canvas = document.createElement("canvas");
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext("2d");

        this.shapes = [];
        this.shapeFrequency = 1;
        this.gravity = 1;
        this.shapeCount = 0;
        this.shapeInterval = null;

        this.setupUI();
        this.startGeneratingShapes();
        this.setupEventListeners();
    }

	setupUIInfo() {
		const infoDiv = document.createElement("div");
        infoDiv.id = "info";
        infoDiv.innerHTML = `
            <div>
                <span>Shapes generated: </span>
                <span id="shapeCount">0</span>
            </div>
            <div>
                <span>Total area: </span>
                <span id="totalArea">0</span> px<sup>2</sup>
            </div>
        `;
        document.body.appendChild(infoDiv);
	}

    setupUI() {
        const shapeFrequencyDiv = document.createElement("div");
        shapeFrequencyDiv.innerHTML = `
            <label>Shapes generated per second:</label>
            <button id="shapeFrequencyDecrease">-</button>
            <span id="shapeFrequency">1</span>
            <button id="shapeFrequencyIncrease">+</button>
        `;
        document.body.appendChild(shapeFrequencyDiv);

        const gravityDiv = document.createElement("div");
        gravityDiv.innerHTML = `
            <label>Gravity:</label>
            <button id="gravityDecrease">-</button>
            <span id="gravity">1</span>
            <button id="gravityIncrease">+</button>
        `;
        document.body.appendChild(gravityDiv);
    }

    setupEventListeners() {
        this.canvas.addEventListener("click", this.handleClick.bind(this));

        document.getElementById("shapeFrequencyDecrease").addEventListener("click", () => this.changeShapeFrequency(-1));
        document.getElementById("shapeFrequencyIncrease").addEventListener("click", () => this.changeShapeFrequency(1));

        document.getElementById("gravityDecrease").addEventListener("click", () => this.changeGravity(-1));
        document.getElementById("gravityIncrease").addEventListener("click", () => this.changeGravity(1));
    }

    startGeneratingShapes() {
        this.shapeInterval = setInterval(this.generateRandomShape.bind(this), 1000 / this.shapeFrequency);
    }

    generateRandomShape() {
        const shapeTypes = ['triangle', 'square', 'pentagon', 'hexagon', 'circle', 'ellipse', 'star'];
        const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];

        const x = Math.random() * canvasWidth;
        const y = -50;
        const size = Math.random() * 50 + 20;
        const color = '#' + Math.floor(Math.random() * 16777215).toString(16);

        switch (shapeType) {
            case 'triangle':
                this.generateTriangle(x, y, size, color);
                break;
            case 'square':
                this.generateSquare(x, y, size, color);
                break;
            case 'pentagon':
                this.generatePolygon(x, y, size, 5, color);
                break;
            case 'hexagon':
                this.generatePolygon(x, y, size, 6, color);
                break;
            case 'circle':
                this.generateCircle(x, y, size, color);
                break;
            case 'ellipse':
                this.generateEllipse(x, y, size, size * 0.6, color);
                break;
            case 'star':
                this.generateStar(x, y, size, color);
                break;
            default:
                break;
        }
    }

    generateTriangle(x, y, size, color) {
        this.shapes.push({ type: 'triangle', x, y, size, color });
    }

    generateSquare(x, y, size, color) {
        this.shapes.push({ type: 'square', x, y, size, color });
    }

    generatePolygon(x, y, size, sides, color) {
        this.shapes.push({ type: 'polygon', x, y, size, sides, color });
    }

    generateCircle(x, y, size, color) {
        this.shapes.push({ type: 'circle', x, y, size, color });
    }

    generateEllipse(x, y, width, height, color) {
        this.shapes.push({ type: 'ellipse', x, y, width, height, color });
    }

    generateStar(x, y, size, color) {
        this.shapes.push({ type: 'star', x, y, size, color });
    }

    drawShapes() {
        this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        this.shapes.forEach(shape => {
            this.ctx.fillStyle = shape.color;
            switch (shape.type) {
                case 'triangle':
                    this.drawTriangle(shape.x, shape.y, shape.size);
                    break;
                case 'square':
                    this.ctx.fillRect(shape.x, shape.y, shape.size, shape.size);
                    break;
                case 'polygon':
                    this.drawPolygon(shape.x, shape.y, shape.size, shape.sides);
                    break;
                case 'circle':
                    this.ctx.beginPath();
                    this.ctx.arc(shape.x + shape.size / 2, shape.y + shape.size / 2, shape.size / 2, 0, Math.PI * 2);
                    this.ctx.fill();
                    break;
                case 'ellipse':
                    this.ctx.beginPath();
                    this.ctx.ellipse(shape.x + shape.width / 2, shape.y + shape.height / 2, shape.width / 2, shape.height / 2, 0, 0, Math.PI * 2);
                    this.ctx.fill();
                    break;
                case 'star':
                    this.drawStar(shape.x + shape.size / 2, shape.y + shape.size / 2, shape.size / 2, 5, shape.size / 2 * 0.5);
                    this.ctx.fill();
                    break;
                default:
                    break;
            }
        });
    }

    drawTriangle(x, y, size) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + size / 2, y);
        this.ctx.lineTo(x, y + size);
        this.ctx.lineTo(x + size, y + size);
        this.ctx.closePath();
        this.ctx.fill();
    }

    drawPolygon(x, y, size, sides) {
        this.ctx.beginPath();
        for (let i = 0; i < sides; i++) {
            this.ctx.lineTo(x + size * Math.cos(i * 2 * Math.PI / sides), y + size * Math.sin(i * 2 * Math.PI / sides));
        }
        this.ctx.closePath();
        this.ctx.fill();
    }

    drawStar(x, y, outerRadius, spikes, innerRadius) {
        let rot = (Math.PI / 2) * 3;
        let xCenter = x;
        let yCenter = y;
        let step = Math.PI / spikes;

        this.ctx.beginPath();
        this.ctx.moveTo(xCenter, yCenter - outerRadius)
        for (let i = 0; i < spikes; i++) {
            let x = xCenter + Math.cos(rot) * outerRadius;
            let y = yCenter + Math.sin(rot) * outerRadius;
            this.ctx.lineTo(x, y);
            rot += step;

            x = xCenter + Math.cos(rot) * innerRadius;
            y = yCenter + Math.sin(rot) * innerRadius;
            this.ctx.lineTo(x, y);
            rot += step;
        }
        this.ctx.lineTo(xCenter, yCenter - outerRadius);
        this.ctx.closePath();
    }

    updateShapes() {
        this.shapes.forEach(shape => {
            shape.y += this.gravity;
            if (shape.y > canvasHeight) {
                this.shapes.splice(this.shapes.indexOf(shape), 1);
            }
        });
    }

	handleClick(event) {
		const rect = this.canvas.getBoundingClientRect();
		const mouseX = event.clientX - rect.left;
		const mouseY = event.clientY - rect.top;
	
		const clickedShapeIndex = this.shapes.findIndex(shape => {
			if (shape.type === 'circle' || shape.type === 'ellipse') {
				return Math.pow(mouseX - (shape.x + shape.size / 2), 2) + Math.pow(mouseY - (shape.y + shape.size / 2), 2) <= Math.pow(shape.size / 2, 2);
			} else if (shape.type === 'square' || shape.type === 'triangle' || shape.type === 'star') {
				return mouseX >= shape.x && mouseX <= shape.x + shape.size && mouseY >= shape.y && mouseY <= shape.y + shape.size;
			} else if (shape.type === 'pentagon' || shape.type === 'hexagon') {
				return false;
			}
		});
	
		if (clickedShapeIndex !== -1) {
			this.shapes.splice(clickedShapeIndex, 1);
			this.updateInfo();
		} else {
			this.generateRandomShapeAt(mouseX, mouseY);
		}
	}
	
    generateRandomShapeAt(x, y) {
        const size = Math.random() * 50 + 20;
        const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
        const shapeTypes = ['triangle', 'square', 'pentagon', 'hexagon', 'circle', 'ellipse', 'star'];
        const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];

        switch (shapeType) {
            case 'triangle':
                this.generateTriangle(x, y, size, color);
                break;
            case 'square':
                this.generateSquare(x, y, size, color);
                break;
            case 'pentagon':
                this.generatePolygon(x, y, size, 5, color);
                break;
            case 'hexagon':
                this.generatePolygon(x, y, size, 6, color);
                break;
            case 'circle':
                this.generateCircle(x, y, size, color);
                break;
            case 'ellipse':
                this.generateEllipse(x, y, size, size * 0.6, color);
                break;
            case 'star':
                this.generateStar(x, y, size, color);
                break;
            default:
                break;
        }
    }

    changeShapeFrequency(delta) {
        this.shapeFrequency += delta;
        if (this.shapeFrequency < 1) this.shapeFrequency = 1;
        document.getElementById('shapeFrequency').textContent = this.shapeFrequency;
        clearInterval(this.shapeInterval);
        this.shapeInterval = setInterval(this.generateRandomShape.bind(this), 1000 / this.shapeFrequency);
    }

    changeGravity(delta) {
        this.gravity += delta;
        if (this.gravity < 1) this.gravity = 1;
        document.getElementById('gravity').textContent = this.gravity;
    }

    updateInfo() {
        document.getElementById('shapeCount').textContent = this.shapes.length;
        let totalArea = 0;
        this.shapes.forEach(shape => {
            if (shape.type === 'circle') {
                totalArea += Math.PI * Math.pow(shape.size / 2, 2);
            } else if (shape.type === 'ellipse') {
                totalArea += Math.PI * (shape.width / 2) * (shape.height / 2);
            } else if (shape.type === 'square' || shape.type === 'triangle' || shape.type === 'star') {
                totalArea += Math.pow(shape.size, 2);
            } else if (shape.type === 'pentagon' || shape.type === 'hexagon') {
                totalArea += (3 * Math.sqrt(3) * Math.pow(shape.size, 2)) / 2;
            }
        });
        document.getElementById('totalArea').textContent = totalArea.toFixed(2);
    }

    loop() {
        this.updateShapes();
        this.drawShapes();
        this.updateInfo();
        requestAnimationFrame(this.loop.bind(this));
    }
}

const app = new CanvasApp();
app.loop();
