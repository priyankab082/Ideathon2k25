import cv2
import numpy as np
import math
from face_detector import get_face_detector, find_faces
from face_landmarks import get_landmark_model, detect_marks

# Load models
face_model = get_face_detector()
landmark_model = get_landmark_model()

font = cv2.FONT_HERSHEY_SIMPLEX

# 3D model points (nose tip, chin, eyes, mouth corners)
model_points = np.array([
    (0.0, 0.0, 0.0),             # Nose tip
    (0.0, -330.0, -65.0),        # Chin
    (-225.0, 170.0, -135.0),     # Left eye left corner
    (225.0, 170.0, -135.0),      # Right eye right corner
    (-150.0, -150.0, -125.0),    # Left mouth corner
    (150.0, -150.0, -125.0)      # Right mouth corner
])

def get_camera_matrix(size):
    focal_length = size[1]
    center = (size[1] / 2, size[0] / 2)
    return np.array([
        [focal_length, 0, center[0]],
        [0, focal_length, center[1]],
        [0, 0, 1]
    ], dtype="double")

def get_2d_points(img, rotation_vector, translation_vector, camera_matrix):
    rear_size = 1
    rear_depth = 0
    front_size = img.shape[1]
    front_depth = front_size * 2

    point_3d = np.array([
        (-rear_size, -rear_size, rear_depth),
        (-rear_size, rear_size, rear_depth),
        (rear_size, rear_size, rear_depth),
        (rear_size, -rear_size, rear_depth),
        (-rear_size, -rear_size, rear_depth),
        (-front_size, -front_size, front_depth),
        (-front_size, front_size, front_depth),
        (front_size, front_size, front_depth),
        (front_size, -front_size, front_depth),
        (-front_size, -front_size, front_depth)
    ], dtype=np.float64).reshape(-1, 3)

    dist_coeffs = np.zeros((4,1))
    (point_2d, _) = cv2.projectPoints(point_3d,
                                      rotation_vector,
                                      translation_vector,
                                      camera_matrix,
                                      dist_coeffs)
    return np.int32(point_2d.reshape(-1, 2))

def head_pose_points(img, rotation_vector, translation_vector, camera_matrix):
    points = get_2d_points(img, rotation_vector, translation_vector, camera_matrix)
    y = (points[5] + points[8]) // 2
    x = points[2]
    return (x, y)

# Open webcam
cap = cv2.VideoCapture(0)

while True:
    ret, img = cap.read()
    if not ret:
        break

    size = img.shape
    camera_matrix = get_camera_matrix(size)

    faces = find_faces(img, face_model)
    for face in faces:
        marks = detect_marks(img, landmark_model, face)

        image_points = np.array([
            marks[30],  # Nose tip
            marks[8],   # Chin
            marks[36],  # Left eye left corner
            marks[45],  # Right eye right corner
            marks[48],  # Left mouth corner
            marks[54]   # Right mouth corner
        ], dtype="double")

        dist_coeffs = np.zeros((4,1))
        success, rotation_vector, translation_vector = cv2.solvePnP(
            model_points, image_points, camera_matrix, dist_coeffs, flags=cv2.SOLVEPNP_UPNP)

        (nose_end_point2D, _) = cv2.projectPoints(
            np.array([(0.0, 0.0, 1000.0)]),
            rotation_vector, translation_vector,
            camera_matrix, dist_coeffs)

        p1 = (int(image_points[0][0]), int(image_points[0][1]))
        p2 = (int(nose_end_point2D[0][0][0]), int(nose_end_point2D[0][0][1]))

        x1, x2 = head_pose_points(img, rotation_vector, translation_vector, camera_matrix)

        # Draw nose line and side line
        cv2.line(img, p1, p2, (0, 255, 255), 2)
        cv2.line(img, tuple(x1), tuple(x2), (255, 0, 0), 2)

        try:
            ang1 = int(math.degrees(math.atan2(p2[1] - p1[1], p2[0] - p1[0])))
        except:
            ang1 = 90
        try:
            m = (x2[1] - x1[1]) / (x2[0] - x1[0])
            ang2 = int(math.degrees(math.atan(-1 / m)))
        except:
            ang2 = 90

        if ang1 >= 48:
            cv2.putText(img, 'Head down', (30, 30), font, 1, (0, 0, 255), 2)
        elif ang1 <= -48:
            cv2.putText(img, 'Head up', (30, 30), font, 1, (0, 0, 255), 2)

        if ang2 >= 48:
            cv2.putText(img, 'Head right', (30, 60), font, 1, (255, 0, 0), 2)
        elif ang2 <= -48:
            cv2.putText(img, 'Head left', (30, 60), font, 1, (255, 0, 0), 2)

    # Show frame
    cv2.imshow('Head Pose Estimation', img)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release resources
cap.release()
cv2.destroyAllWindows()
