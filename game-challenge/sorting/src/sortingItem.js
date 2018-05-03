import React from "react"
import styled, { css } from "styled-components"
import { DragSource, DropTarget } from "react-dnd"
import { pulse } from "eppsa-ksm-shared"

import { ItemTypes } from "./constants"
import ItemComponent from "./components/itemComponent"


const Container = styled(ItemComponent)`
  display: flex;
  flex-direction: column;
  justify-content: center;

  background-image: ${props => `url(${props.image.src})`};

  width: 95%;

  visibility: ${props => props.isOver ? "hidden" : "visible"};

  margin-bottom: ${props => props.theme.layout.mediumSpacing}vw;

  box-sizing: border-box;

  ${props => props.isCorrect ? css`
    border: 5px solid green;
    animation: ${pulse("green", "black", { duration: 250, repeats: 3 }, "border-color")};
  ` : ""}

  ${props => props.isWrong ? css`
    border: 5px solid red;
    animation: ${pulse("red", "black", { duration: 250, repeats: 3 }, "border-color")};
  ` : ""}

  padding: ${props => props.theme.layout.mediumSpacing}vw;
`

const ItemText = styled.div`
  color: ${props => props.color};
  font-size: ${props => props.theme.font.text.size}vw;
`

const dragSource = {
  beginDrag(props) {
    return {
      item: props.item,
      onReorder: props.onReorder
    }
  },
  canDrag(props) {
    return !props.isConfirmed
  }
}

const dropTarget = {
  hover(props, monitor) {
    const dragItem = monitor.getItem()

    const dropItem = props

    dragItem.onReorder(dragItem.item, dropItem.item)
  }
}

class SortingItem extends React.Component {
  render() {
    let content =
      // `div` around a styled component is required by react-dnd
      <div style={ { display: "flex", justifyContent: "center" } }>
        <Container image={ this.props.item.image } { ...this.props }>
          <ItemText color={ this.props.item.color }>{ this.props.item.text }</ItemText>
        </Container>
      </div>

    content = this.props.connectDragSource(content)
    content = this.props.connectDropTarget(content)
    content = this.props.connectDragPreview(content)

    return content
  }
}

function collectDrag(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }
}

function collectDrop(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}

export default DragSource(ItemTypes.SORTING_ITEM, dragSource, collectDrag)(
  DropTarget(ItemTypes.SORTING_ITEM, dropTarget, collectDrop)(SortingItem)
)