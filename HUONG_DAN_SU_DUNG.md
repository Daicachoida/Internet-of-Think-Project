# HƯỚNG DẪN VẬN HÀNH TOÀN BỘ HỆ THỐNG IOT

Tài liệu hướng dẫn khởi động và kết nối giữa **ESP8266 Firmware**, **Mosquitto MQTT Broker**, **Backend .NET (iot-server)** và **Frontend**.

---

## 1. Thông Tin Cấu Hình Hệ Thống

| Thành phần | Thông số | Ghi chú |
| :--- | :--- | :--- |
| **IP Máy tính (Wi-Fi)** | `192.168.1.5` | Xem bằng lệnh `ipconfig` nếu đổi mạng |
| **MQTT Broker Port** | `34215` | Cổng quy định kết nối |
| **MQTT User / Pass** | `NguyenAnhTu` / `B23DCCN872` | Khớp giữa ESP và Server |
| **Topic Cảm biến** | `sensor_data` | ESP bắn nhiệt độ, độ ẩm, ánh sáng |
| **Topic Điều khiển** | `led_control` | Server gửi: `green_on`, `red_off`, ... |
| **Topic Trạng thái** | `esp_status` | ESP phản hồi trạng thái sau khi bật/tắt |

---

## 2. Thứ Tự Khởi Động Hệ Thống (3 Bước)

### BƯỚC 1: Khởi Động MQTT Broker (Mosquitto)

> ⚠️ **Lưu ý quan trọng:** Mosquitto phải chạy kèm file cấu hình `-c` để cho phép thiết bị bên ngoài (ESP8266 qua WiFi) kết nối, nếu không sẽ bị chặn ở chế độ `local only`.

Mở **Command Prompt (CMD)** với quyền **Administrator**:

```cmd
:: 1. Dừng service ngầm (nếu đang chạy)
net stop mosquitto

:: 2. Khởi chạy Mosquitto với cổng 34215 và cho phép kết nối từ xa
"C:\Program Files\Mosquitto\mosquitto.exe" -c "C:\Program Files\Mosquitto\mosquitto.conf" -v
```

*Giữ nguyên cửa sổ CMD này để xem toàn bộ log kết nối và dữ liệu bắn lên trong thời gian thực.*

---

### BƯỚC 2: Cấp Nguồn / Nạp Code ESP8266

1. File mã nguồn lưu tại: [`firmware/esp8266/esp8266.ino`](./firmware/esp8266/esp8266.ino)
2. Mở file bằng **Arduino IDE**.
3. Kiểm tra các dòng đầu file:
   ```cpp
   const char* ssid = "Van Lam";          // Sóng Wi-Fi 2.4 GHz
   const char* wifiPassword = "12345789";

   const char* mqttServer = "192.168.1.5"; // IP máy tính chạy Mosquitto
   const int mqttPort = 34215;
   const char* mqttUser = "NguyenAnhTu";
   const char* mqttPassword = "B23DCCN872";
   ```
4. Chọn đúng Board (**NodeMCU 1.0 (ESP-12E Module)**) và cổng COM (ví dụ **COM10**), bấm **Upload**.
5. Mở **Serial Monitor** (Baud rate: **115200**), kiểm tra thấy:
   ```text
   Ket noi WiFi.....
   WiFi OK
   IP ESP8266: 192.168.1.x
   Ket noi MQTT...OK
   ```
   *Đồng thời bên cửa sổ Mosquitto CMD sẽ thấy thông báo client `ESP8266` connected.*

---

### BƯỚC 3: Khởi Động Backend .NET (`iot-server`)

Mở Terminal mới tại thư mục `iot-server`:

```powershell
cd "d:\Project 2026\project for Internet of things\iot-server"
dotnet run
```

Khi server khởi động:
- Tự động kết nối tới MQTT Broker `localhost:34215` với Client ID `iot-server`.
- Lắng nghe topic `sensor_data` (lưu vào database SQL Server mỗi 10 giây).
- Lắng nghe topic `esp_status` để cập nhật trạng thái bật/tắt thiết bị vào bảng `ActionHistories`.
- Mở Swagger tại: `http://localhost:5000/swagger` (hoặc `https://localhost:5001/swagger`).

---

### BƯỚC 4: Khởi Động Frontend (Web)

Mở Terminal mới tại thư mục `iot`:

```powershell
cd "d:\Project 2026\project for Internet of things\iot"
npm run dev
```

Truy cập giao diện Web tại: `http://localhost:5173`

---

## 3. Bảng Ánh Xạ Thiết Bị (LED)

| Device ID | Code | Tên Thiết Bị | Chân ESP | Lệnh Bật | Lệnh Tắt |
| :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | `green` | Green LED | `D4` | `green_on` | `green_off` |
| **2** | `red` | Red LED | `D0` | `red_on` | `red_off` |
| **3** | `yellow` | Yellow LED | `D3` | `yellow_on` | `yellow_off` |

---

## 4. Xử Lý Các Lỗi Thường Gặp

| Hiện tượng | Nguyên nhân | Cách khắc phục |
| :--- | :--- | :--- |
| **ESP báo `Loi: -2`** | Không kết nối được tới IP hoặc Port broker | Kiểm tra lại IP máy tính (`ipconfig`), đảm bảo Mosquitto đang chạy trên cổng `34215` và không bị Firewall chặn. |
| **ESP báo `Loi: 5`** | Sai Username hoặc Password MQTT | Kiểm tra lại `mqttUser` và `mqttPassword` trong file `.ino` và `mosquitto.conf`. |
| **ESP in dấu chấm liên tục `......`** | Không kết nối được WiFi | ESP8266 chỉ bắt được WiFi **2.4 GHz**. Đảm bảo router hoặc hotspot đang phát băng tần 2.4 GHz. |
| **Mosquitto báo `Starting in local only mode`** | Chạy lệnh thiếu file cấu hình | Phải chạy: `"C:\Program Files\Mosquitto\mosquitto.exe" -c "C:\Program Files\Mosquitto\mosquitto.conf" -v` |
| **Đổi mạng WiFi hoặc phát 4G từ điện thoại** | IP máy tính thay đổi | Chạy `ipconfig`, lấy IPv4 mới và cập nhật lại biến `mqttServer` trong file `.ino` rồi nạp lại cho ESP. |
