from ultralytics import YOLO

# 1) Pilih base model
# Bisa ganti:
# 'yolov8n.pt' (nano, ringan)
# 'yolov8s.pt' (small, lebih akurat tapi lebih berat)
model = YOLO("yolov8n.pt")

# 2) Train
results = model.train(
    data="SmartNgon-2/data.yaml",
    epochs=100,
    imgsz=640,
    batch=4,
    device="cpu",     # GANTI KE CPU
    workers=2
)


print("Training selesai!")
