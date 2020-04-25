## External Events

The external events component renders the actual sidebar with external events.

This is a block component and yields the external events header and empty events message component that can be called as inline component or block component based on the need. This will give the user with full control on the content rendered in the respective placeholder.

This component expects two arguments **isLoading** and **isLoadedAll**. It will render the shimmer loader whenever the isLoading is set to true, there by making it flexible to show the loader during the lazyloading of events. Once all the events are loaded set the isLoadedAll flag to true to show the loaded message at the bottom of the events list.

### Header
Wrapper for displaying the events heading

### Empty
Wrapper for displaying the empty message when there are no events to display.

## **As inline element**

### Header
It will display the text that is given in the name property. This text is both vertically and horizontally centered inside the cell by default which can be changed by overwriting the styles.

### Empty

It will display the text that is given in the message property. This text is both vertically and horizontally centered covering the entire calendar.

## Usage

{{demo-external-events}}

## **As block element**

### Resource Header
Rendering it as a block element will give more control over the content that is displayed in the cell to the user.
Let's say you want to filter the events based on a group or type. Then you can add a dropdown in this header and use that to filter the resources.

### Empty

Rendering it as a block element will give more control over the content that is displayed in the cell to the user.
This content is both vertically and horizontally centered covering the entire calendar.
Let's say you want to add a link below the empty message to direct the user to the events create page. You can render this as shown in the below demo.

## Usage

{{demo-external-events-block}}
