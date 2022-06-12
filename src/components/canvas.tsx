import React from "react";
import {roundDown} from "../utils/mathutils";
import {Row, Col, Button, Divider, Menu, Dropdown, Space} from "antd"
import {DownOutlined} from '@ant-design/icons';
import {saveAs} from "../utils/fileutils";
import {Glider, Puffer} from "./examples";


const defaultBlockSize = 20;
const widthAdjustScale = 0.95;
const heightAdjustScale = 0.80;
const aliveRatio = 0.1;
const infiniteDrawInterval = 100;
const blockBorderWidthRatio = 0.05;
const scaleRatio = 0.80;

export interface CanvasProps {
}

interface CanvasState {
    cells: Array<Array<boolean>>,
    width: number,
    height: number,
    numRows: number,
    numCols: number,
    steps: number,
    scale: number,
    blockSize: number,
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
        width: 0,
        scale: 1,
        blockSize: defaultBlockSize,
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

    drawBlock = (x: number, y: number, alive: boolean) => {
        let blockSize = this.state.blockSize;
        this.ctx.fillStyle = "#bfbfbf";
        this.ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
        this.ctx.fillStyle = alive ? "black" : "white";
        let blockBorderWidth = Math.floor(blockSize * blockBorderWidthRatio);
        this.ctx.fillRect(x * blockSize + blockBorderWidth, y * blockSize + blockBorderWidth, blockSize - 2 * blockBorderWidth, blockSize - 2 * blockBorderWidth);
    };

    drawCells = () => {
        let numRows = this.state.numRows;
        let numCols = this.state.numCols;
        for (let i = 0; i < numCols; i++) {
            for (let j = 0; j < numRows; j++) {
                this.drawBlock(i, j, this.state.cells[i][j])
            }
        }
    };

    clearCanvas = () => {
        let canvas = this.canvas.current;
        if (canvas == null) return;
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    drawRandomCells = () => {
        this.clearSteps();
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

    cellsToStr = (): string => {
        let cellStr = "[\n";
        let numRows = this.state.numRows;
        let numCols = this.state.numCols;
        for (let i = 0; i < numCols; i++) {
            cellStr += "[" + Number(this.state.cells[i][0]);
            for (let j = 1; j < numRows; j++) {
                cellStr += ", " + Number(this.state.cells[i][j]);
            }
            cellStr += "],\n";
        }
        cellStr += "]\n";
        return cellStr;
    };

    saveCells = () => {
        let now = new Date().getTime();
        let filename = `cell-${now}`;
        saveAs(this.cellsToStr(), "txt", filename)
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

        let alive = this.state.cells[x][y];
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

    copyCells = (another: Array<Array<number>>) => {
        let numRows = this.state.numRows;
        let numCols = this.state.numCols;
        for (let i = 0; i < numCols; i++) {
            for (let j = 0; j < numRows; j++) {
                this.state.cells[i][j] = Boolean(another[i][j]);
            }
        }
    };

    init = () => {
        let canvas = this.canvas.current;
        if (canvas == null) return;
        let ctx = canvas.getContext("2d");
        if (ctx == null) return;
        this.ctx = ctx;

        let blockSize = this.state.blockSize;

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
        let blockSize = this.state.blockSize;
        let x = Math.floor((event.clientX - canvas.offsetLeft) / blockSize);
        let y = Math.floor((event.clientY - canvas.offsetTop) / blockSize);
        this.clearSteps();

        // console.log(event.clientY, canvas.offsetTop);
        // console.log(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop, x, y);

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

        this.clearSteps();
        this.clearTimer();
        this.clearCanvas();
    };

    scaleCanvas = (event: React.WheelEvent) => {
        let scale = this.state.scale * Math.pow(scaleRatio, Math.sign(event.deltaY));
        scale = Math.min(Math.max(0.2, scale), 8);
        let blockSize = Math.floor(defaultBlockSize * scale);
        this.setState({
            scale: scale,
            blockSize: blockSize,
        }, () => {
            let canvas = this.canvas.current;
            if (canvas == null) return;
            canvas.width = this.state.numCols * blockSize;
            canvas.height = this.state.numRows * blockSize;
            this.clearCanvas();
            this.drawCells();
        });
    };

    componentDidMount(): void {
        this.init();
    }

    clearSteps = () => {
        this.setState({
            steps: 0
        });
    };

    drawGlider = () => {
        this.copyCells(Glider);
        this.clearSteps();
        this.clearCanvas();
        this.drawInfinitely();
    };

    drawPuffer = () => {
        this.copyCells(Puffer);
        this.clearSteps();
        this.clearCanvas();
        this.drawInfinitely();
    };

    examplesMenu = (): React.ReactElement => {
        const menu = <Menu
            items={[
                {
                    key: '1',
                    label: (
                        <a onClick={this.drawGlider}>
                            Glider
                        </a>
                    ),
                },
                {
                    key: '2',
                    label: (
                        <a onClick={this.drawPuffer}>
                            Puffer
                        </a>
                    ),
                },
            ]}
        />;

        return <Dropdown overlay={menu} placement="bottom" arrow>
            <Button type={"dashed"}>examples</Button>
        </Dropdown>
    };

    render() {
        return (
            <div style={{marginTop: "10px"}}>
                <Row justify="center">
                    <Col><Button type="dashed" onClick={this.clearAll}>clear</Button></Col>
                    <Col><Button type="dashed" onClick={this.drawRandomCells}>random</Button></Col>
                    <Col><Button type="dashed" onClick={this.drawNextStep}>single step</Button></Col>
                    <Col><Button type="dashed" onClick={this.drawInfinitely}>infinite</Button></Col>
                    <Col><Button type="dashed" onClick={this.saveCells}>save</Button></Col>
                    <Col>{this.examplesMenu()}</Col>
                </Row>
                <Row><Divider plain>Lifegame Canvas(step: {this.state.steps})</Divider></Row>
                <Row justify="center">
                    <canvas ref={this.canvas} style={{border: "1px solid"}} onMouseDown={this.setCellsManually}
                            onWheel={this.scaleCanvas}/>
                </Row>
            </div>
        )
    }
}