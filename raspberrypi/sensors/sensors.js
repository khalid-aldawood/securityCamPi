const cv = require('opencv4nodejs');
const fs = require('fs');
const axios = require('axios');
var io = require('socket.io-client');
var tempSensor = require('node-dht-sensor');
console.log("hello world");

let prevpeople = [];
let prevtemp = -1;
const wCap = new cv.VideoCapture(0)

wCap.set(cv.CAP_PROP_FRAME_WIDTH,466);
wCap.set(cv.CAP_PROP_FRAME_HEIGHT,466);




const cfgFile = "yolov3-tiny.cfg";
const weightsFile = "yolov3-tiny.weights";
const labelsFile = "coco.names";
const minConfidence = 0.5;
const nmsThreshold = 0.3;
const labels = fs
  .readFileSync(labelsFile)
  .toString()
  .split("\n");


// initialize tensorflow darknet model from modelFile
const net = cv.readNetFromDarknet(cfgFile, weightsFile);
const allLayerNames = net.getLayerNames();
const unconnectedOutLayers = net.getUnconnectedOutLayers();

// determine only the *output* layer names that we need from YOLO
const layerNames = unconnectedOutLayers.map(layerIndex => {
  return allLayerNames[layerIndex - 1];
});

const classifyImg = img => {
  // object detection model works with 416 x 416 images
  const size = new cv.Size(416, 416);
  const vec3 = new cv.Vec(0, 0, 0);
  const [imgHeight, imgWidth] = img.sizes;

  // network accepts blobs as input
  const inputBlob = cv.blobFromImage(img, 1 / 255.0, size, vec3, true, false);
  net.setInput(inputBlob);

  //console.time("net.forward");
  // forward pass input through entire network
  const layerOutputs = net.forward(layerNames);
  //console.timeEnd("net.forward");

  let boxes = [];
  let confidences = [];
  let classIDs = [];
  let people = [];

  layerOutputs.forEach(mat => {
    const output = mat.getDataAsArray();
    output.forEach(detection => {
      const scores = detection.slice(5);
      const classId = scores.indexOf(Math.max(...scores));
      const confidence = scores[classId];

      if (confidence > minConfidence) {
        const box = detection.slice(0, 4);

        const centerX = parseInt(box[0] * imgWidth);
        const centerY = parseInt(box[1] * imgHeight);
        const width = parseInt(box[2] * imgWidth);
        const height = parseInt(box[3] * imgHeight);

        const x = parseInt(centerX - width / 2);
        const y = parseInt(centerY - height / 2);

        boxes.push(new cv.Rect(x, y, width, height));
        confidences.push(confidence);
        classIDs.push(classId);

        const indices = cv.NMSBoxes(
          boxes,
          confidences,
          minConfidence,
          nmsThreshold
        );

        indices.forEach(i => {
          const rect = boxes[i];

          const pt1 = new cv.Point(rect.x, rect.y);
          const pt2 = new cv.Point(rect.x + rect.width, rect.y + rect.height);
          const rectColor = new cv.Vec(255, 0, 0);
          const rectThickness = 2;
          const rectLineType = cv.LINE_8;

          // draw the rect for the object
          img.drawRectangle(pt1, pt2, rectColor, rectThickness, rectLineType);
          if(labels[classIDs[i]] == "person"){people.push(labels[classIDs[i]]);}

          const text = labels[classIDs[i]];
          const org = new cv.Point(rect.x, rect.y + 15);
          const fontFace = cv.FONT_HERSHEY_SIMPLEX;
          const fontScale = 0.5;
          const textColor = new cv.Vec(123, 123, 255);
          const thickness = 2;

          // put text on the object
          img.putText(text, org, fontFace, fontScale, textColor, thickness);
        });
      }
    });
  });

  cv.imshow("Darknet YOLO Object Detection", img);
  return people;
};

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let objectdetection = false;
socket = io('http://192.168.1.33:5000');
socket.on('connect', ()=>{console.log("connected")});
socket.on('trigger', async(cb)=>{

if(cb =="on"){objectdetection = true;}
else{objectdetection = false;}

});


setInterval(()=>{

tempSensor.read(11,14,function(err,temp,humidity){
if(!err){

//send temperatue to the server
socket.emit('temp',temp);
if(temp > 40 && prevtemp < 40){
//save the sensor reading
axios.post('http://192.168.1.33:5000/api/storedinfo',{type:"temperature",value:`${temp}c`,alert:true});
prevtemp = temp;
}

else if(temp < 40){prevtemp = temp;}

if(getRandomInt(1,1000) == 5 && temp < 40){axios.post('http://192.168.1.33:5000/api/storedinfo',{type:"temperature",value:`${temp}c`,alert:false});}

}

});


},5000);


let pred = [];
let fps = 17;
setInterval(()=>{
const frame =  wCap.read()
if(objectdetection){
pred = classifyImg(frame);
fps = 1;
}
else{fps = 17;}
//save the webcam reading

if(pred.length > prevpeople.length){
axios.post('http://192.168.1.33:5000/api/storedinfo',{type:"people",value:`${pred.length}`,alert:true});
prevpeople = pred;
}

else if(pred.length < prevpeople.length){
prevpeople = pred;
}

else if(getRandomInt(1,2400) == 5 && pred.length == 0){
axios.post('http://192.168.1.33:5000/api/storedinfo',{type:"people",value:`${pred.length}`,alert:false});
}
//send webcame images to the server
const image = cv.imencode('.jpg',frame).toString('base64');
socket.emit('videocam',image);

},1250/fps);





