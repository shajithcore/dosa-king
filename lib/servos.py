from machine import Pin, PWM

class Servo:
    def __init__(self, pin_num, min_us=500, max_us=2500):
        self.pwm = PWM(Pin(pin_num), freq=50)
        self._min_us = min_us
        self._max_us = max_us
        self._min_angle = 0
        self._max_angle = 180

    def write_angle(self, angle):
        # Clamp angle
        angle = max(self._min_angle, min(self._max_angle, angle))
        # Convert angle to pulse width (microseconds)
        us = self._min_us + (angle * (self._max_us - self._min_us) / 180)
        # Convert us to 10-bit duty cycle (0-1023)
        # 50Hz = 20ms period. (us / 20000) * 1023
        duty = int((us / 20000) * 1023)
        self.pwm.duty(duty)

    def run(self, speed):
        # Map -100/100 to 0/180 degrees
        angle = ((speed + 100) * 180) / 200
        self.write_angle(angle)

    def stop(self):
        self.pwm.duty(0)