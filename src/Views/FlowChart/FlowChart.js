import React from "react";
import "./FlowChart.less";
import * as go from "gojs";
import {NavLink} from 'react-router-dom';
import { GetFlowChartNodeData,ArrayifyMatrix } from '../../Engine/storyline/storyline';
var $ = go.GraphObject.make;
var myDiagram = null;
class FlowChart extends React.Component {
	constructor() {
		super(...arguments);
		this.BindGoJs = this.BindGoJs.bind(this);
		this.NodeData = GetFlowChartNodeData();
		//ArrayifyMatrix();
	}
	componentDidMount() {
		this.BindGoJs();
	}
	componentDidUpdate() {

	}
	BindGoJs() {
		myDiagram = $(go.Diagram, "GraphContainer", {
			"animationManager.isEnabled": false,
			"undoManager.isEnabled": false,
			isReadOnly: true, // enable Ctrl-Z to undo and Ctrl-Y to redo
			layout: $(
				go.TreeLayout, // specify a Diagram.layout that arranges trees
				{ angle: 90, layerSpacing: 60 }
			)
		});
		myDiagram.nodeTemplate = $(
			go.Node,
			"Auto",
			$(go.Shape, { figure: "RoundedRectangle" }, { fill: "#66ccff" }),
			$(
				go.TextBlock,
				"Default Text",
				{ margin: 12, stroke: "white", font: "bold 20pt sans-serif" },
				new go.Binding("text", "text")
			)
		);
		myDiagram.initialContentAlignment = go.Spot.Top;
		myDiagram.addDiagramListener("ObjectSingleClicked", function (e) {
			var part = e.subject.part;
			if (!(part instanceof go.Link)) console.log("Clicked on " + part.data.text);
		});
		// define a Link template that routes orthogonally, with no arrowhead
		myDiagram.linkTemplate = $(
			go.Link,
			{
				routing: go.Link.AvoidsNodes,
				corner: 120,
				reshapable: true
			},
			$(go.Shape, { strokeWidth: 3, stroke: "#555" })
		); // the link shape
		myDiagram.model = new go.GraphLinksModel(this.NodeData.StoryLineNode, this.NodeData.StoryLineLinkData);
	}
	render() {
		return (<div className="FlowChartContainer">
			<NavLink to="/">返回标题</NavLink>
			<div id="GraphContainer" />
		</div>)
	}
}

export default FlowChart;