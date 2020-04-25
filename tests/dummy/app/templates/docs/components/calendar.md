# Calendar

The calendar component renders the actual calendar.

This is a block component and yields the resource header, grid header and empty resource message component that can be called as inline component or block component based on the need. This will give the user with full control on the content rendered in the respective placeholder.

The only required argument for this component is **isLoading**. It will render the shimmer loader row whenever this is set to true, there by making it flexible to show the loader during the lazyloading of resources and events.

### Resource Header
Wrapper for displaying the resource heading on the first cell of the calendar.

### Grid Header
Wrapper for displaying the slot headers on the calendar.

### Resource Header
Wrapper for displaying the resource heading on the first cell of the calendar.

### Empty
Wrapper for displaying the empty message when there are no resources to display.


## **As inline element**

### Resource Header
It will display the text that is given in the name property. This text is both vertically and horizontally centered inside the cell by default which can be changed by overwriting the styles.

### Grid Header

For day view: Displays the odd slots spanning 2 columns formatted based on the selected view slot format provided in the options except for the first and last slot in a single row.

For week/month view: Displays each slot interval with day and date as individual elements in a single row. The date is displayed as icon button and on clicking it, will trigger the **onDateView** hook with the selectedDate as the clicked date button and selectedView as day view.

### Empty

It will display the text that is given in the message property. This text is both vertically and horizontally centered covering the entire calendar.

## Usage

{{demo-calendar}}

## **As block element**

### Resource Header
Rendering it as a block element will give more control over the content that is displayed in the cell to the user.
Let's say you want to filter the resources based on a group or type. Then you can add a dropdown in this header and use that to filter the resources.

### Grid Header
The calendar timelines are framed using css grids. CSS grids places the grid cells based on the position defined and the scheduler calendar instance returns a slots property which has all the slots framed as moment objects.
This is an advanced case and let's hope it doesn't come to this.
Let's say you don't want to display the date as a button in week and month view, this is a rare case and we can't use config to satisfy all the possible use cases out there. You can format the slots info as shown in the below demo.

### Empty

Rendering it as a block element will give more control over the content that is displayed in the cell to the user.
This content is both vertically and horizontally centered covering the entire calendar.
Let's say you want to add a link below the empty message to direct the user to the resources addition page. You can render this as shown in the below demo.

## Usage

{{demo-calendar-block}}

