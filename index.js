// minimal dimensions of an image for it to be taken into account
var sizeLimit = 200;

// cache of images positions
var positions = [];

document.addEventListener('keypress', keypressHandler, false);

function keypressHandler(event){
  // ignore keypresses with modifiers
  if (event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) return;
  
  // ignore keypresses in inputs
  var target = event.target;
  if (/input|select|textarea/i.test(target.tagName) || target.hasAttribute('contenteditable')) return;

  // ignore all keys except for R and F
  var key = event.code;
  if (key != 'KeyR' && key != 'KeyF') return;

  // check if cache update is needed
  if (positions.length < document.images.length) {
    // find the top offsets of all images larger than the limit
    positions = [...document.images]
      .filter(image => Math.min(image.width, image.height) > sizeLimit)
      .map(getYOffset)
      .map(parseFloat)
  }
  
  // sort increasing by default (for button F)
  // need to provide own numbers comparator instead of default strings comparator
  positions = positions.sort((a, b) => a - b);
  var next = true;

  if (key == 'KeyR') {
    // sort decreasing for button R
    positions = positions.reverse();
    next = false;
  }

  var scroll = document.scrollingElement.scrollTop;
  // Find the first position larger than current scroll (when looking for next image)
  // or smaller than current scroll (when looking for previous image).
  // When found, scroll to it and exit.
  for (var offset of positions) {
    if ((next && offset <= scroll) || (!next && offset >= scroll)) continue;
    document.scrollingElement.scrollTop = offset;
    return;
  }
}

function getYOffset(node) {
  for (var offset = 0; node; offset += node.offsetTop, node = node.offsetParent);
  return offset;
}
