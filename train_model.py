import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv3D, MaxPooling3D, Flatten, Dense
import numpy as np

def create_model(input_shape):
    model = Sequential([
        Conv3D(32, (3, 3, 3), activation='relu', input_shape=input_shape),
        MaxPooling3D((2, 2, 2)),
        Conv3D(64, (3, 3, 3), activation='relu'),
        MaxPooling3D((2, 2, 2)),
        Flatten(),
        Dense(128, activation='relu'),
        Dense(10, activation='softmax')  # Adjust according to the number of classes
    ])
    model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
    return model

videos = np.load('videos.npy')
labels = np.load('labels.npy')
input_shape = (None, 64, 64, 3)  # Adjust based on your data

model = create_model(input_shape)
model.fit(videos, labels, epochs=10, batch_size=2, validation_split=0.2)
model.save('sign_language_model.h5')
