// map images to their glitch.global parts
function imageMap(imageName){
  let type = imageName == "maker_compact" || imageName == "generator_compact" || imageName == "producer_compact" || imageName == "factory_compact" ? "jpg" : "png"
  return `assets/${imageName}.${type}`;
}