# CO2-meter voor Home Assistant

ESPHome-firmware voor een CO2-meter met ronde AMOLED-display.

## Hardware
- Waveshare ESP32-S3-Touch-AMOLED-1.32 (466x466, CO5300 via QSPI, CST820 touch)
- SCD41-module (CO2, temperatuur, luchtvochtigheid; I2C, 3,3 V)
  - De module met BME280/BME680 uit de advertentie is niet nodig; de SCD41 meet alles zelf.

## Bedrading SCD41
| SCD41 | ESP32-S3 |
|-------|----------|
| VCC   | 3V3      |
| GND   | GND      |
| SDA   | `sensor_sda` (standaard GPIO17) |
| SCL   | `sensor_scl` (standaard GPIO18) |

Gebruik niet de I2C-pinnen van het touchpaneel; die hangen op een aparte bus.

## Belangrijk: pinnen controleren
Ik kon het schema van de 1.32"-variant niet inzien. De display- en touchpinnen in
`co2-meter.yaml` (sectie `substitutions`) zijn gebaseerd op verwante Waveshare-boards en
**moeten** worden gecontroleerd tegen
<https://docs.waveshare.com/ESP32-S3-Touch-AMOLED-1.32>. Heeft het bord een
I/O-expander of aparte display-voeding, dan moet die ook worden aangestuurd.

## Installeren
```bash
cd co2-meter
cp secrets.example.yaml secrets.yaml   # invullen
pip install esphome                    # >= 2025.9 (mipi_spi met CO5300)
esphome run co2-meter.yaml             # eerste keer via USB
```
Home Assistant ontdekt het apparaat automatisch (Instellingen > Apparaten > ESPHome).

## Entiteiten in Home Assistant
CO2, temperatuur, luchtvochtigheid, WiFi-signaal, schermhelderheid, knop
"Kalibreer op 420 ppm" (alleen gebruiken na 3+ min buiten) en herstartknop.

## Gebruik
- Display: grote CO2-waarde, kleurring (groen < 800, oranje < 1200, rood daarboven), temp/RV.
- Tik op het scherm voor 30 s volle helderheid, daarna 30%.
- De SCD41 heeft ~5 s opwarmtijd en kalibreert zichzelf (ASC) na enkele dagen frisse lucht.
- Plaats de sensor uit de buurt van de ESP32 en het display (warmte beïnvloedt temperatuur/RV).

## Niet getest
Dit is niet op hardware of met `esphome config` gevalideerd.
