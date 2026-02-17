function clamp(min: number, value: number, max: number) {
    return Math.min(max, Math.max(value, min));
}

export class ViewportController {
    x = $state(0);
    y = $state(0);
    zoom = $state(3.0);

    viewportWidth = $state(0);
    viewportHeight = $state(0);

    private viewBoxMinX = $derived(this.x - this.viewportWidth / (2 * this.zoom));
    private viewBoxMinY = $derived(this.y - this.viewportHeight / (2 * this.zoom));
    private viewBoxWidth = $derived(this.viewportWidth / this.zoom);
    private viewBoxHeight = $derived(this.viewportHeight / this.zoom);

    viewBox = $derived(
        `${this.viewBoxMinX} ${this.viewBoxMinY} ${this.viewBoxWidth} ${this.viewBoxHeight}`,
    );

    public pan(dx: number, dy: number): void {
        this.x -= dx / this.zoom;
        this.y -= dy / this.zoom;
    }

    public convertViewportPositionToSvgPosition(x: number, y: number) {
        let ratX = x / this.viewportWidth;
        let ratY = y / this.viewportHeight;

        return {
            x: this.viewBoxMinX + ratX * this.viewBoxWidth,
            y: this.viewBoxMinY + ratY * this.viewBoxHeight,
        }
    }

    public zoomAtViewportPosition(x: number, y: number, dz: number) {
        let {
            x: xWithinSvgBefore,
            y: yWithinSvgBefore,
        } = this.convertViewportPositionToSvgPosition(x, y);

        this.zoom = clamp(1, this.zoom + dz, 20);

        let {
            x: xWithinSvgAfter,
            y: yWithinSvgAfter,
        } = this.convertViewportPositionToSvgPosition(x, y);

        this.x += xWithinSvgBefore - xWithinSvgAfter;
        this.y += yWithinSvgBefore - yWithinSvgAfter;
    }
}

export function mouseViewportController(viewportController: ViewportController) {
    return function (node: HTMLElement) {
        const LEFT_MOUSE_BUTTON_ID = 0;

        node.addEventListener("mousedown", onmousedown)
        node.addEventListener("mouseup", onmouseup)
        node.addEventListener("wheel", onwheel)

        function onmousedown(event: MouseEvent) {
            if (event.button === LEFT_MOUSE_BUTTON_ID) {
                console.info("Start dragging motion");
                window.addEventListener("mousemove", onmousemove);
            }
        }

        function onmouseup(e: MouseEvent) {
            if (e.button === LEFT_MOUSE_BUTTON_ID) {
                console.info("End dragging motion");
                window.removeEventListener("mousemove", onmousemove);
            }
        };

        function onmousemove(event: MouseEvent) {
            event.preventDefault();
            viewportController.pan(event.movementX, event.movementY);
        }

        function onwheel(event: WheelEvent) {
            let factor = -Math.sign(event.deltaY);
            viewportController.zoomAtViewportPosition(
                event.offsetX,
                event.offsetY,
                factor,
            );
        }

        return () => {
            node.removeEventListener("mousedown", onmousedown);
            node.removeEventListener("mouseup", onmouseup);
            node.removeEventListener("wheel", onwheel);
            window.removeEventListener("mousemove", onmousemove);
        }
    }
}


export function touchViewportController(viewportController: ViewportController) {
    return function (node: HTMLElement) {
        let oldTouches: { [key: number]: Touch } = {};

        node.addEventListener("touchstart", ontouchstart, { passive: false });
        node.addEventListener("touchmove", ontouchmove, { passive: false });
        node.addEventListener("touchend", ontouchend, { passive: false });

        function ontouchstart(event: TouchEvent) {
            event.preventDefault();
            for (let touch of event.changedTouches) {
                oldTouches[touch.identifier] = touch;
            }
        }

        function ontouchend(event: TouchEvent) {
            event.preventDefault();
            for (let touch of event.changedTouches) {
                delete oldTouches[touch.identifier];
            }
        }

        function ontouchmove(event: TouchEvent) {
            event.preventDefault();
            if (event.touches.length === 1) {
                let current = event.touches[0];
                let previous = oldTouches[current.identifier] ?? null;
                if (previous) {
                    viewportController.pan(current.clientX - previous.clientX, current.clientY - previous.clientY);
                }
            } else if (event.touches.length === 2) {
                let t0 = event.touches[0];
                let t1 = event.touches[1];
                let pt0 = oldTouches[t0.identifier] ?? null;
                let pt1 = oldTouches[t1.identifier] ?? null;
                if (pt0 && pt1) {
                    let pt0vw = viewportController.convertViewportPositionToSvgPosition(pt0.clientX, pt0.clientY);
                    let pt1vw = viewportController.convertViewportPositionToSvgPosition(pt1.clientX, pt1.clientY);
                    let t0vw = viewportController.convertViewportPositionToSvgPosition(t0.clientX, t0.clientY);
                    let t1vw = viewportController.convertViewportPositionToSvgPosition(t1.clientX, t1.clientY);
                    let distBefore = Math.sqrt(Math.pow(pt0vw.x - pt1vw.x, 2) + Math.pow(pt0vw.y - pt1vw.y, 2));
                    let distAfter = Math.sqrt(Math.pow(t0vw.x - t1vw.x, 2) + Math.pow(t0vw.y - t1vw.y, 2));

                    let dz = 0;
                    if (distBefore != 0) {
                        dz = distBefore / distAfter - 1;
                        dz *= -1;
                    }

                    viewportController.pan(
                        (t0.clientX + t1.clientX) / 2 - (pt0.clientX + pt1.clientX) / 2,
                        (t0.clientY + t1.clientY) / 2 - (pt0.clientY + pt1.clientY) / 2
                    );
                    viewportController.zoomAtViewportPosition((t0.clientX + t1.clientX) / 2, (t0.clientY + t1.clientY) / 2, dz);
                }
            }

            for (let touch of event.changedTouches) {
                oldTouches[touch.identifier] = touch;
            }
        }

        return () => {
            node.removeEventListener("touchstart", ontouchstart);
            node.removeEventListener("touchmove", ontouchmove);
            node.removeEventListener("touchend", ontouchend);
        }
    }
}