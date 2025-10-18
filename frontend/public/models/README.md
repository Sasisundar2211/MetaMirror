# Face-API Models

This directory should contain face-api.js model files for emotion detection:

## Required Models:
1. tiny_face_detector_model-weights_manifest.json
2. tiny_face_detector_model-shard1
3. face_expression_model-weights_manifest.json
4. face_expression_model-shard1

## How to Get Models:

You can download the models from the official face-api.js repository:
https://github.com/justadudewhohacks/face-api.js/tree/master/weights

## Note:

For this MVP demo, if models are not present, the emotion detection will use simulated emotions.
The app will still function and demonstrate all features with mock emotion data.

## Alternative:

You can also use the models from CDN by updating the MODEL_URL in EmotionDetector.js:
```javascript
const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';
```