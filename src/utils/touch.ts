export const isTouch = (event: MouseEvent | TouchEvent): event is TouchEvent =>
    "touches" in event;

export const preventDefaultMove = (event: MouseEvent | TouchEvent): void => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions,@typescript-eslint/no-unnecessary-condition
    !isTouch(event) && event.preventDefault && event.preventDefault();
};
