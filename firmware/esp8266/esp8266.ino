#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

const char* ssid = "Galaxy S21 5G 4093";
const char* wifiPassword = "kocodouu";

const char* mqttServer = "192.168.1.5";
const int mqttPort = 34215;
const char* mqttUser = "NguyenAnhTu";
const char* mqttPassword = "B23DCCN872";

#define DHTPIN D2
#define DHTTYPE DHT11

#define GREEN_LED D4
#define RED_LED D0
#define YELLOW_LED D3

DHT dht(DHTPIN, DHTTYPE);

WiFiClient wifiClient;
PubSubClient client(wifiClient);

unsigned long lastSend = 0;

void connectWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, wifiPassword);

  Serial.print("Ket noi WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.println("WiFi OK");

  Serial.print("IP ESP8266: ");
  Serial.println(WiFi.localIP());
}

void sendLedStatus(
  int deviceId,
  String deviceName,
  String action,
  String status,
  String state
) {
  String data =
    "{\"deviceId\":" + String(deviceId) +
    ",\"deviceName\":\"" + deviceName + "\"" +
    ",\"action\":\"" + action + "\"" +
    ",\"status\":\"" + status + "\"" +
    ",\"state\":\"" + state + "\"}";

  client.publish("esp_status", data.c_str());

  Serial.println(data);
}

void controlLed(
  int pin,
  int deviceId,
  String deviceName,
  String action
) {
  if (action == "ON") {
    digitalWrite(pin, HIGH);
  }
  else if (action == "OFF") {
    digitalWrite(pin, LOW);
  }
  else {
    sendLedStatus(
      deviceId,
      deviceName,
      action,
      "failed",
      "UNKNOWN"
    );

    return;
  }

  String state =
    digitalRead(pin) == HIGH ? "ON" : "OFF";

  String status =
    (state == action) ? "success" : "failed";

  sendLedStatus(
    deviceId,
    deviceName,
    action,
    status,
    state
  );
}

void callback(char* topic, byte* payload, unsigned int length) {
  String message = "";

  for (unsigned int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  if (String(topic) != "led_control") {
    return;
  }

  if (message == "green_on") {
    controlLed(
      GREEN_LED,
      1,
      "GREEN_LED",
      "ON"
    );
  }

  else if (message == "green_off") {
    controlLed(
      GREEN_LED,
      1,
      "GREEN_LED",
      "OFF"
    );
  }

  else if (message == "red_on") {
    controlLed(
      RED_LED,
      2,
      "RED_LED",
      "ON"
    );
  }

  else if (message == "red_off") {
    controlLed(
      RED_LED,
      2,
      "RED_LED",
      "OFF"
    );
  }

  else if (message == "yellow_on") {
    controlLed(
      YELLOW_LED,
      3,
      "YELLOW_LED",
      "ON"
    );
  }

  else if (message == "yellow_off") {
    controlLed(
      YELLOW_LED,
      3,
      "YELLOW_LED",
      "OFF"
    );
  }

  else if (message == "all_on") {
    controlLed(GREEN_LED, 1, "GREEN_LED", "ON");
    controlLed(RED_LED, 2, "RED_LED", "ON");
    controlLed(YELLOW_LED, 3, "YELLOW_LED", "ON");
  }

  else if (message == "all_off") {
    controlLed(GREEN_LED, 1, "GREEN_LED", "OFF");
    controlLed(RED_LED, 2, "RED_LED", "OFF");
    controlLed(YELLOW_LED, 3, "YELLOW_LED", "OFF");
  }

  else {
    sendLedStatus(
      0,
      "UNKNOWN",
      message,
      "failed",
      "UNKNOWN"
    );
  }
}

void connectMQTT() {
  while (!client.connected()) {

    Serial.print("Ket noi MQTT...");

    if (client.connect(
          "ESP8266",
          mqttUser,
          mqttPassword
        )) {

      Serial.println("OK");

      client.subscribe("led_control");

    } else {

      Serial.print("Loi: ");
      Serial.println(client.state());

      delay(5000);
    }
  }
}

void publishSensors() {
  float temp = dht.readTemperature();
  float humidity = dht.readHumidity();

  int light = analogRead(A0);

  light = map(light, 0, 1023, 100, 0);
  light = constrain(light, 0, 100);

  if (!isnan(temp)) {
    String tempData =
      "{\"temp\":" + String(temp, 1) + "}";

    client.publish(
      "temp_data",
      tempData.c_str()
    );
  }

  if (!isnan(humidity)) {
    String humidityData =
      "{\"humidity\":" + String(humidity, 1) + "}";

    client.publish(
      "humidity_data",
      humidityData.c_str()
    );
  }

  String lightData =
    "{\"light\":" + String(light) + "}";

  client.publish(
    "light_data",
    lightData.c_str()
  );

  if (!isnan(temp) && !isnan(humidity)) {
    String sensorData =
      "{\"temp\":" + String(temp, 1) +
      ",\"humidity\":" + String(humidity, 1) +
      ",\"light\":" + String(light) +
      "}";

    client.publish(
      "sensor_data",
      sensorData.c_str()
    );

    Serial.println(sensorData);
  }
}

void setup() {
  Serial.begin(115200);

  pinMode(GREEN_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);
  pinMode(YELLOW_LED, OUTPUT);

  digitalWrite(GREEN_LED, LOW);
  digitalWrite(RED_LED, LOW);
  digitalWrite(YELLOW_LED, LOW);

  dht.begin();

  connectWiFi();

  client.setServer(
    mqttServer,
    mqttPort
  );

  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    connectMQTT();
  }

  client.loop();

  if (millis() - lastSend >= 2000) {
    lastSend = millis();
    publishSensors();
  }
}
