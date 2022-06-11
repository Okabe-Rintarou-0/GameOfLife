import React from "react";
import {roundDown} from "../utils/mathutils";
import {Row, Col, Button, Divider} from "antd"


const blockSize = 20;
const widthAdjustScale = 0.95;
const heightAdjustScale = 0.80;
const aliveRatio = 0.1;
const infiniteDrawInterval = 100;

export interface CanvasProps {
}

interface CanvasState {
    cells: Array<Array<boolean>>,
    width: number,
    height: number,
    numRows: number,
    numCols: number,
    steps: number,

}

export class Canvas extends React.Component<CanvasProps, CanvasState> {
    canvas = React.createRef<HTMLCanvasElement>();
    // @ts-ignore
    ctx: CanvasRenderingContext2D;
    // @ts-ignore
    drawTimer: NodeJS.Timer;


    readonly state: CanvasState = {
        cells: [],
        height: 0,
        numCols: 0,
        numRows: 0,
        steps: 0,
        width: 0
    };

    createRandomCells = () => {
        let numRows = this.state.numRows;
        let numCols = this.state.numCols;
        for (let i = 0; i < numCols; i++) {
            for (let j = 0; j < numRows; j++) {
                this.state.cells[i][j] = Math.random() <= aliveRatio;
            }
        }
    };

    drawCells = () => {
        let numRows = this.state.numRows;
        let numCols = this.state.numCols;
        for (let i = 0; i < numCols; i++) {
            for (let j = 0; j < numRows; j++) {
                if (this.state.cells[i][j]) {
                    this.ctx.fillRect(i * blockSize, j * blockSize, blockSize, blockSize)
                }
            }
        }
    };

    clearCanvas = () => {
        this.ctx.clearRect(0, 0, this.state.width, this.state.height);
    };

    drawRandomCells = () => {
        this.setState({
            steps: 0
        });
        this.clearTimer();
        this.clearCanvas();
        this.createRandomCells();
        this.drawCells();
    };

    inBound = (x: number, y: number): boolean => {
        return x >= 0 && x < this.state.numCols && y >= 0 && y < this.state.numRows
    };

    isAlive = (x: number, y: number): boolean => {
        return this.inBound(x, y) && this.state.cells[x][y]
    };

    checkAlive = (x: number, y: number): boolean => {
        let numAlive = 0;
        for (let i = -1; i <= 1; i++) {
            numAlive += Number(this.isAlive(x - 1, y + i));
            numAlive += Number(this.isAlive(x + 1, y + i));
        }
        numAlive += Number(this.isAlive(x, y - 1));
        numAlive += Number(this.isAlive(x, y + 1));

        if (numAlive > 0) {
            console.log(x, y, numAlive);
        }

        let alive = this.state.cells[x][y]
        if (numAlive < 2 || numAlive > 3) {
            alive = false;
        } else if (numAlive == 3) {
            alive = true;
        }
        return alive;
    };

    drawNextStep = () => {
        let numRows = this.state.numRows;
        let numCols = this.state.numCols;
        let newCells = new Array<Array<boolean>>();
        for (let i = 0; i < numCols; i++) {
            newCells.push([]);
            for (let j = 0; j < numRows; j++) {
                newCells[i].push(false);
            }
        }

        for (let i = 0; i < numCols; i++) {
            for (let j = 0; j < numRows; j++) {
                newCells[i][j] = this.checkAlive(i, j);
            }
        }

        for (let i = 0; i < numCols; i++) {
            for (let j = 0; j < numRows; j++) {
                this.state.cells[i][j] = newCells[i][j];
            }
        }

        this.setState({
            steps: this.state.steps + 1
        });
        this.clearCanvas();
        this.drawCells();
    };

    clearTimer = () => {
        if (this.drawTimer != null) {
            clearInterval(this.drawTimer)
        }
    };

    drawInfinitely = () => {
        this.clearTimer();
        this.drawTimer = setInterval(this.drawNextStep, infiniteDrawInterval)
    };

    init = () => {
        let canvas = this.canvas.current;
        if (canvas == null) return;
        let ctx = canvas.getContext("2d");
        if (ctx == null) return;
        this.ctx = ctx;

        canvas.width = roundDown(window.innerWidth * widthAdjustScale, blockSize);
        canvas.height = roundDown(window.innerHeight * heightAdjustScale, blockSize);

        let numRows = canvas.height / blockSize;
        let numCols = canvas.width / blockSize;

        let cells = new Array<Array<boolean>>();
        for (let i = 0; i < numCols; i++) {
            cells.push([]);
            for (let j = 0; j < numRows; j++) {
                cells[i].push(false);
            }
        }

        this.setState({
            cells: cells,
            width: canvas.width,
            height: canvas.height,
            numCols: numCols,
            numRows: numRows,
            steps: 0,
        });
    };

    flipCell = (x: number, y: number) => {
        if (this.inBound(x, y)) {
            this.state.cells[x][y] = !this.state.cells[x][y]
        }
    };

    setCellsManually = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        let canvas = this.canvas.current;
        if (canvas == null) return;
        let x = Math.floor((event.clientX - canvas.offsetLeft) / blockSize);
        let y = Math.floor((event.clientY - canvas.offsetTop) / blockSize);
        this.setState({
            steps: 0
        });

        this.flipCell(x, y);
        this.clearTimer();
        this.clearCanvas();
        this.drawCells();
    };

    clearAll = () => {
        let numRows = this.state.numRows;
        let numCols = this.state.numCols;
        for (let i = 0; i < numCols; i++) {
            for (let j = 0; j < numRows; j++) {
                this.state.cells[i][j] = false;
            }
        }

        this.setState({
            steps: 0
        });
        this.clearTimer();
        this.clearCanvas();
    };

    componentDidMount(): void {
        this.init();
    }

    render() {
        return (
            <div style={{marginTop: "10px"}}>
                <Row justify="center">
                    <Col><Button type="dashed" onClick={this.clearAll}>clear</Button></Col>
                    <Col><Button type="dashed" onClick={this.drawRandomCells}>random</Button></Col>
                    <Col><Button type="dashed" onClick={this.drawNextStep}>single step</Button></Col>
                    <Col><Button type="dashed" onClick={this.drawInfinitely}>infinite</Button></Col>
                </Row>
                <Divider plain>Lifegame Canvas(step: {this.state.steps})</Divider>
                <Row justify="center">
                    <canvas ref={this.canvas} style={{border: "1px solid"}} onMouseDown={this.setCellsManually}/>
                </Row>
            </div>
        )
    }
}