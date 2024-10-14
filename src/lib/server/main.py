import cv2
import numpy as np
from matplotlib import pyplot as plt
import pickle
from flask import Flask, request, jsonify, render_template, send_file
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = '*'

with open("knn.pkl", "rb") as f:
    model = pickle.load(f)

def convert_to_grayscale(strokes, input_size=400, output_size=28):
    canvas = np.zeros((output_size, output_size), dtype=np.uint8)

    scale = output_size / input_size

    for stroke in strokes:
        points = np.array(stroke) * scale
        points = np.clip(points.round().astype(int), 0, output_size - 1)

        for i in range(len(points) - 1):
            cv2.line(canvas, tuple(points[i]), tuple(points[i+1]), 255, 1, cv2.LINE_AA)

    return canvas


def convert_string(input_array):
    input_list = input_array.tolist()
    output_str = ','.join(map(str, input_list))
    return '[' + output_str + ']'


@app.route('/', methods=['POST'])
def predict():
    data = request.json
    data = convert_to_grayscale(data['strokes'])
    plt.imshow(data, cmap='gray')
    plt.axis("off")
    plt.show()
    result = model.predict_proba((data.flatten().reshape(1, 784)))
    result2 = model.predict((data.flatten().reshape(1, 784)))
    class_labels = model.classes_
    return jsonify({"Prediction": str(convert_string(result[0])), "Probability": str(result2[0])})

if __name__ == '__main__':
    app.run(debug=True)