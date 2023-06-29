import { Worldoffset, canvas, controlCanvas, isMobileDevice, isScrolling, mouselocation } from "./shared.js";


if (isMobileDevice) {

    controlCanvas.style.display = "block"
    controlCanvas.style.top = `${innerHeight - 100}px`;
    controlCanvas.style.left = `${5}px`;

    var mainRect = canvas.getBoundingClientRect();
    var miniRect = controlCanvas.getBoundingClientRect();

    controlCanvas.addEventListener('touchstart', (event) => {
        isScrolling.status = true
    })

    controlCanvas.addEventListener('touchmove', (event) => {
        event.preventDefault()
        var touchX = event.touches[0].clientX;
        var touchY = event.touches[0].clientY;
        // Calculate the ratio between the canvases
        var ratioX = mainRect.width / miniRect.width;
        var ratioY = mainRect.height / miniRect.height;

        // Calculate the touch offset relative to the mini-map
        var offsetX = touchX - miniRect.left;
        var offsetY = touchY - miniRect.top;

        mouselocation.x = offsetX * ratioX
        mouselocation.y =  offsetY * ratioY

    }, { passive: false });

    controlCanvas.addEventListener('touchend', (event) => {
        mouselocation.x = window.innerWidth / 2
        mouselocation.y = window.innerHeight / 2
        isScrolling.status = false
    });

} else {
    canvas.addEventListener('mousemove', (event) => {
        mouselocation.x = event.clientX
        mouselocation.y = event.clientY
    }, { passive: false });
}


canvas.width = window.innerWidth
canvas.height = window.innerHeight

function handleMouseMovement() {
    const viewportWidth = innerWidth
    const viewportHeight = innerHeight
 
    const scrollThresholdX = 120 ; // Adjust this value to control the sensitivity of scrolling
    const scrollThresholdY = 120 ; // Adjust this value to control the sensitivity of scrolling

    const baseSpeed = 1 ; // Adjust this value to control the base scroll speed
    const maxSpeed = 8 ; // Adjust this value to control the maximum scroll speed

    const distanceFromEdgeX = Math.min(
        mouselocation.x < 0 ? 0 : mouselocation.x,
        viewportWidth - mouselocation.x
    );

    const distanceFromEdgeY = Math.min(
        mouselocation.y < 0 ? 0 : mouselocation.y,
        viewportHeight - mouselocation.y
    );

    const speedX = baseSpeed + (maxSpeed - baseSpeed) * (1 - distanceFromEdgeX / scrollThresholdX);
    const speedY = baseSpeed + (maxSpeed - baseSpeed) * (1 - distanceFromEdgeY / scrollThresholdY);

    let mouseX = mouselocation.x;
    let mouseY = mouselocation.y;

    // Check if the mouse is outside the window
    if (!isMobileDevice) {
        if (
            mouseX < 0 ||
            mouseY < 0 ||
            mouseX > viewportWidth ||
            mouseY > viewportHeight
        ) {
            isScrolling.status = false;
            return;
        }
    }
    //scroll up
    if (mouseY < scrollThresholdY && Worldoffset.offsetY < 100) {
        Worldoffset.offsetY += Math.round(speedY)
    }
    // scroll down
    else if (mouseY > viewportHeight - scrollThresholdY && Worldoffset.offsetY > -3300 + viewportHeight) {
        Worldoffset.offsetY -= Math.round(speedY)
    }

    //scroll left
    if (mouseX < scrollThresholdX && Worldoffset.offsetX < 100) {
        Worldoffset.offsetX += Math.round(speedX)
    }
    //scroll right
    else if (mouseX > viewportWidth - scrollThresholdX && Worldoffset.offsetX > -3300 + viewportWidth) {
        Worldoffset.offsetX -= Math.round(speedX)
    }

}



export { handleMouseMovement }