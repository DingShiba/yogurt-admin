
interface optionsInter {
    el: string | HTMLElement,
    width?: number | 0,
    height?: number | 0,
    data: {
        nodes: object[],
        edges: object[]
    }
}

interface nodeItemInter {
    "data": any,
    "id": string,
    "label": string,
    "shape": string,
    "size": number[],
    "x": number,
    "y": number
}

class FlowEditor {
    canvasWidth: number;
    canvasHeight: number;
    ctx: any;
    canvas: HTMLCanvasElement;
    appData: { nodes: object[]; edges: object[] };
    allNodes: object[];
    edges:object[];

    constructor(options: optionsInter) {
        this.canvasWidth = options.width || 0;
        this.canvasHeight = options.height || 0;
        this.allNodes = []
        this.edges = []
        this.appData = options.data
        this.canvas = this.createCanvas(options.el)
        this.ctx = this.canvas.getContext('2d')
        //     展示流程
        this.showFlow()

        this.addEventListenByMouse()
    }

    addEventListenByMouse() {
        this.canvas.addEventListener('mousemove', (e) => {
            this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
            // 重绘节点
            this.allNodes.forEach((item: any) => {
                item.createNewNode()
                const isIN = this.ctx.isPointInPath(e.clientX - this.canvas.getBoundingClientRect().left, e.clientY - this.canvas.getBoundingClientRect().top)
                if (isIN) {
                    console.log("item", item.label)
                    console.log("item", item)
                    item.showAnchor()
                }
            })
            // 重绘连接线
            this.edges.forEach((item:any)=>{
                item.createLine()
            })
        })
    }

    // 展示流程
    showFlow() {
        // 绘制节点
        this.appData.nodes.forEach((item: any) => {
            this.allNodes.push(new NodeTarget(item, this.ctx))
        })
        //绘制连线
        this.appData.edges.forEach((item: any) => {
            const _option=JSON.parse(JSON.stringify(item))
            _option.allNodes=this.allNodes
            this.edges.push(new Line(_option,this.ctx))
        })
    }


    createCanvas(el: string | HTMLElement): any {
        // 创建一个新的canvas元素
        const canvas = document.createElement('canvas');

        //         获取父元素 及宽高
        let parentDom: HTMLElement;
        if (typeof el === 'string') {
            parentDom = document.querySelector(el)!
        } else {
            parentDom = el
        }

        const _width: number = parentDom.offsetWidth,
            _height: number = parentDom.offsetHeight;
        // 设置canvas的宽度和高度
        canvas.width = _width;
        canvas.height = _height;
        this.canvasWidth = _width;
        this.canvasHeight = _height;
        canvas.id = new Date() + "_D_canvas"
        // 将新的canvas元素添加到文档中，例如添加到body元素中
        parentDom.appendChild(canvas);
        const canvasDom = document.getElementById(canvas.id)!
        return canvasDom
    }
}

interface nodeInter {
    id: string;
    label: string;
    shape: string;
    size: number[];
    x: number;
    y: number;

}
// 节点类
class NodeTarget {
    id: string;
    label: string;
    shape: string;
    size: number[];
    x: number;
    y: number;
    ctx: any;
    anchorPoints: number[][];
    path: any;
    anchorRadius:number;

    constructor(props: nodeInter, ctx: any) {
        this.anchorRadius=5;
        this.id = props.id
        this.label = props.label
        this.shape = props.shape
        this.size = props.size
        this.x = props.x
        this.y = props.y
        this.ctx = ctx
        this.anchorPoints = this.createAnchorPoints()
        this.createNewNode()
    }

    createNewNode() {
        this.ctx.beginPath();
        this.ctx.textAlign = "center" // 设置文本居中
        switch (this.shape) {
            case "ellipse":
                this.ctx.ellipse(this.x, this.y, this.size[0] / 2, this.size[1] / 2, 0, 0, 2 * Math.PI)
                break;
            case "rect":
                this.ctx.rect(this.x - this.size[0] / 2, this.y - this.size[1] / 2, this.size[0], this.size[1]);
                break;
            case "diamond":
                this.ctx.moveTo(this.x - this.size[0] / 2, this.y)
                this.ctx.lineTo(this.x, this.y - this.size[1] / 2)
                this.ctx.lineTo(this.x + this.size[0] / 2, this.y)
                this.ctx.lineTo(this.x, this.y + this.size[1] / 2)
                this.ctx.lineTo(this.x - this.size[0] / 2, this.y)
                this.ctx.closePath()
                break;
        }
        this.ctx.fillStyle = "#e8f1ff"
        this.ctx.strokeStyle = "#e8f1ff"
        this.ctx.fill()
        // 写字
        this.ctx.textBaseline = 'middle'
        this.ctx.font = '16px sans-serif'
        this.ctx.fillStyle = "#3582ff"
        this.ctx.fillText(this.label, this.x, this.y, this.size[0])
        this.ctx.stroke();
    }

    createAnchorPoints(): number[][] {
        return [
            [this.x, this.y - this.size[1] / 2- this.anchorRadius/2],
            [this.x + this.size[0] / 2 +this.anchorRadius/2, this.y],
            [this.x, this.y + this.size[1] / 2+this.anchorRadius/2],
            [this.x - this.size[0] / 2-this.anchorRadius/2, this.y],
        ]
    }


    // 显示锚点
    showAnchor() {
        this.anchorPoints.forEach((item: any) => {
            this.ctx.beginPath()
            this.ctx.arc(item[0], item[1], 5, 0, 2 * Math.PI)
            this.ctx.strokeStyle='#00B42A'
            this.ctx.stroke();
        })
    }

}
interface edageInter{
    allNodes:object[];
    shape:string;
    source:string;
    sourceAnchor:number;
    target:string;
    targetAnchor:number;

}
// 连接线类
class Line{
    ctx:any;
    allNodes:object[];
    points:number[][];
    shape:string;
    source:string;
    sourceAnchor:number;
    target:string;
    targetAnchor:number;
    constructor(option:edageInter,ctx:any) {
        this.ctx=ctx
        this.shape=option.shape;
        this.source=option.source;
        this.sourceAnchor=option.sourceAnchor;
        this.target=option.target;
        this.targetAnchor=option.targetAnchor;
        this.points=[]
        this.allNodes=option.allNodes
        this.hanldePoints()
        this.createLine()
    }
    // 处理线路的点位
    hanldePoints(){
        const sourceNode: any = this.allNodes.filter((item: any) => item.id == this.source)[0]
        const targetNode: any = this.allNodes.filter((item: any) => item.id == this.target)[0]
        const startPoint = sourceNode.anchorPoints[this.sourceAnchor]
        const endPoint = targetNode.anchorPoints[this.targetAnchor]
        this.points=[startPoint,endPoint]
    }
    createLine(){
        this.ctx.beginPath()
        this.ctx.moveTo(this.points[0][0], this.points[0][1])
        const _surplus=this.points.slice(1)
        _surplus.forEach((item:any)=>{
            this.ctx.lineTo(item[0], item[1])
        })
        // 最后的两个点位
        const lastPoints=this.points.slice(this.points.length-2)
        this.drawArrow(this.ctx,lastPoints[0][0],lastPoints[0][1],lastPoints[1][0],lastPoints[1][1],30,10,2)
        this.ctx.lineWidth = 2
        this.ctx.strokeStyle = 'black'
        this.ctx.stroke();
    }
     drawArrow(ctx:any, fromX:number, fromY:number, toX:number, toY:number,theta:number,headlen:number,width:number) {
        let color =  '#000',
            angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
            angle1 = (angle + theta) * Math.PI / 180,
            angle2 = (angle - theta) * Math.PI / 180,
            topX = headlen * Math.cos(angle1),
            topY = headlen * Math.sin(angle1),
            botX = headlen * Math.cos(angle2),
            botY = headlen * Math.sin(angle2);
        ctx.save();
        ctx.beginPath();
        let arrowX = fromX - topX,
            arrowY = fromY - topY;
        ctx.moveTo(arrowX, arrowY);
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        arrowX = toX + topX;
        arrowY = toY + topY;
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(toX, toY);
        arrowX = toX + botX;
        arrowY = toY + botY;
        ctx.lineTo(arrowX, arrowY);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.stroke();
        ctx.restore();
    }
}

export default FlowEditor