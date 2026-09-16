import { animateScroll } from "react-scroll";

export function scrollToBottom(id: string) {
  animateScroll.scrollToBottom({
    containerId: id,
    duration: 0,
  });
}

export function scrollToBottomAnimated(id: string) {
  animateScroll.scrollToBottom({
    containerId: id,
    duration: 100,
  });
}
