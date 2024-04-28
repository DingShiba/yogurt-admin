const AppData = {
    "nodes": [
        {
            "data": {},
            "id": "start-node",
            "label": "开始",
            "shape": "ellipse",
            "size": [120, 40],
            "x": 380,
            "y": 100
        },
        {
            "data": {},
            "id": "1588848310120",
            "label": "主管审批",
            "shape": "rect",
            "size": [120, 40],
            "x": 380, "y": 180
        },
        {
            "data": {},
            "id": "1588848322179",
            "label": "经理审批",
            "shape": "rect",
            "size": [120, 40],
            "x": 380, "y": 260
        },
        {
            "data": {},
            "id": "1588848338211",
            "label": "金额>2万",
            "shape": "diamond",
            "size": [120, 40],
            "x": 380,
            "y": 340
        },
        {
            "data": {},
            "id": "1588848351476", "label": "财务打款", "shape": "rect", "size": [120, 40], "x": 380, "y": 460
        }, {"data": {}, "id": "end-node", "label": "结束", "shape": "ellipse", "size": [120, 40], "x": 380, "y": 540},
        {
            "data": {},
            "id": "1588848397511",
            "label": "VIP审批",
            "shape": "rect",
            "size": [120, 40],
            "x": 620,
            "y": 340
        },
        {
            "data": {},
            "id": "1588848436694",
            "label": "金额>10万",
            "shape": "diamond",
            "size": [120, 40],
            "x": 780,
            "y": 340
        }, {
            "data": {},
            "id": "1588848449431",
            "label": "CEO审批",
            "shape": "rect",
            "size": [120, 40],
            "x": 980,
            "y": 460
        }],
    "edges": [
        {
            "shape": "flow-polyline-round",
            "source": "start-node",
            "sourceAnchor": 2,
            "target": "1588848310120",
            "targetAnchor": 0
        },
        {
            "shape": "flow-polyline-round",
            "source": "1588848310120",
            "sourceAnchor": 2,
            "target": "1588848322179",
            "targetAnchor": 0
        }, {
            "shape": "flow-polyline-round",
            "source": "1588848322179",
            "sourceAnchor": 2,
            "target": "1588848338211",
            "targetAnchor": 0
        },
        {
            "shape": "flow-polyline-round",
            "source": "1588848338211",
            "sourceAnchor": 2,
            "target": "1588848351476",
            "targetAnchor": 0,
            "label": "否"
        },
        {
            "shape": "flow-polyline-round",
            "source": "1588848351476",
            "sourceAnchor": 2,
            "target": "end-node",
            "targetAnchor": 0
        }, {
            "shape": "flow-polyline-round",
            "source": "1588848338211",
            "sourceAnchor": 1,
            "target": "1588848397511",
            "targetAnchor": 3,
            "label": "是"
        }, {
            "shape": "flow-polyline-round",
            "source": "1588848436694",
            "sourceAnchor": 1,
            "target": "1588848449431",
            "targetAnchor": 0,
            "label": "是"
        }, {
            "shape": "flow-polyline-round",
            "source": "1588848449431",
            "sourceAnchor": 1,
            "target": "1588848351476",
            "targetAnchor": 3
        }, {
            "shape": "flow-polyline-round",
            "source": "1588848436694",
            "sourceAnchor": 2,
            "target": "1588848351476",
            "targetAnchor": 3,
            "label": "否"
        }, {
            "shape": "flow-polyline-round", "source": "1588848397511",
            "sourceAnchor": 1, "target": "1588848436694", "targetAnchor": 3
        }]
}
export default AppData
