// map images to their glitch.global parts
function imageMap(imageName){
  let type = imageName == "maker_compact" || imageName == "generator_compact" || imageName == "producer_compact" || imageName == "factory_compact" ? "jpg" : "png"
  return `https://cdn.glitch.global/a8bae54f-d7d3-4a51-8ee6-6fbadebe03a5/${imageName}.${type}?v=${Date.now()}`;
}