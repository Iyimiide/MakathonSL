import cv2
import os
import numpy as np
import tensorflow as tf

def load_videos_from_folder(folder, img_size=(64, 64)):
    videos = []
    labels = []
    for filename in os.listdir(folder):
        if filename.endswith(".mp4"):
            cap = cv2.VideoCapture(os.path.join(folder, filename))
            frames = []
            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break
                frame = cv2.resize(frame, img_size)
                frame = frame / 255.0  # Normalize
                frames.append(frame)
            cap.release()
            videos.append(np.array(frames))
            labels.append(get_label_from_filename(filename))  # Implement this function
    return np.array(videos), np.array(labels)

# Example usage
folder = 'path_to_videos'
videos, labels = load_videos_from_folder(folder)
np.save('videos.npy', videos)
np.save('labels.npy', labels)
