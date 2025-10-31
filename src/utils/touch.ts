export const isTouch = (event: MouseEvent | TouchEvent): event is TouchEvent =>
    "touches" in event;

export const preventDefaultMove = (event: MouseEvent | TouchEvent): void => {
    !isTouch(event) && event.preventDefault && event.preventDefault();
};
