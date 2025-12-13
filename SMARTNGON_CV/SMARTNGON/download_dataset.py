from roboflow import Roboflow
rf = Roboflow(api_key="JWlS1GrF9YRXwpMYEpL9")
project = rf.workspace("facedetection-xyhtm").project("smartngon-f7tgv")
version = project.version(2)
dataset = version.download("yolov8")
                