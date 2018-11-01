'use strict';

// -----Alarm System Requirements-----------------------------------------------------------------
const Gpio = require('onoff').Gpio; // eslint-disable-line
const RaspiCam = require('raspicam'); // eslint-disable-line
const Sound = require('node-aplay'); // eslint-disable-line
const logger = require('./logger');

// -----GPIO Assignments--------------------------------------------------------------------------
const disarmed = new Gpio(24, 'out');
const armed = new Gpio(18, 'out');
const warning = new Gpio(23, 'out');
const alarm = new Gpio(25, 'out');
let pir = 0;

// -----Sound Assets-----------------------------------------------------------------------------
const armedSound = new Sound('./src/lib/assets/sound-assets/system-armed.wav');
const armingSound = new Sound('./src/lib/assets/sound-assets/system-arming.wav');
const armingBeep = new Sound('./src/lib/assets/sound-assets/arming-beep.wav');
const motionSound = new Sound('./src/lib/assets/sound-assets/villain-detected.wav');
const alarmSound = new Sound('./src/lib/assets/sound-assets/intruder-2.wav');
const disarmedSound = new Sound('./src/lib/assets/sound-assets/cool-beans-access-code-accepted.wav');

// -----Timeout-----------------------------------------------------------------------------------
const ARMING_SYSTEM = 10000;
const ALARM = 10000;
// -----Camera Function and Dependencies----------------------------------------------------------
// -----Timestamp Constructor------------------
const stampConstructor = () => {
  const stamp = new Date();
  return stamp;
};
const newStamp = stampConstructor();
// -----Camera Function------------------------
const camera = new RaspiCam({
  output: `./src/lib/assets/picture-storage/villain-${newStamp}.jpeg`,
  mode: 'photo',
});

const takePicture = () => {
  camera.start();
  logger.log(logger.INFO, 'Photo Taken');
};

//  -----Turns ON/OFF the Red LED (DISARM INDICATOR)-----------------------------------------------
const disarmedOn = () => {
  if (disarmed.readSync() === 0) {
    disarmed.writeSync(1);
  }
  disarmedSound.play();
};

const disarmedOff = () => {
  if (disarmed.readSync() === 1) {
    disarmed.writeSync(0);
  }
};

// -----Turns ON the Blue LED (WARNING INDICATOR)------------------------------------------------
const warningLightOn = () => {
  if (warning.readSync() === 0) {
    warning.writeSync(1);
  }
  logger.log(logger.INFO, 'Warning');
};

// -----Turns OFF the Blue LED (WARNING INDICATOR)------------------------------------------------
const warningLightOff = () => {
  if (warning.readSync() === 1) {
    warning.writeSync(0);
  }
};

// -----Turns ON/OFF the Green LED (ARMED INDICATOR)------------------------------------------------
const armedOn = () => {
  if (armed.readSync() === 0) {
    armed.writeSync(1);
  }
  armedSound.play();
};

const armedOff = () => {
  if (armed.readSync() === 1) {
    armed.writeSync(0);
  }
};
// ----- Turns ON Alarm: Red LED and Camera -----------------------------------------------------
const alarmOn = () => {
  if (warning.readSync() === 1) {
    warning.writeSync(0);
  }
  if (disarmed.readSync() === 0) {
    alarm.writeSync(1);
    logger.log(logger.INFO, 'Alarm on');
    alarmSound.play();
    takePicture();
  }
};

const alarmOff = () => {
  if (alarm.readSync() === 1) {
    alarm.writeSync(0);
  }
};

const pirOff = () => {
  if (disarmed.readSync() === 0) {
    console.log('PIR OFF');
  }
};

const activatePIR = () => {
  pir = 0;
  pir = new Gpio(17, 'in', 'both');
  pir.watch((error, value) => {
    if (error) {
      pirOff(pir);
      logger.log(logger.INFO, 'PIR Error');
    }
    if (value === 1 && disarmed.readSync() !== 1) {
      warningLightOn();
      motionSound.play();
      setTimeout(alarmOn, ALARM);
      logger.log(logger.INFO, 'Villain Detected');
      pirOff();
    }
    pir.unexport();
  });
};

const systemArmed = () => {
  if (disarmed.readSync() === 0) {
    warningLightOff();
    armedOn();
    activatePIR();
  }
};

module.exports = class AlarmControls {
  armSystem() {
    pir = 0;
    logger.log(logger.INFO, 'Arming System');
    armingSound.play();
    armingBeep.play();
    disarmedOff();
    warningLightOn();
    setTimeout(systemArmed, ARMING_SYSTEM);
    logger.log(logger.INFO, 'System Armed');
  }

  disarmSystem() {
    if (disarmed.readSync() === 0) {
      logger.log(logger.INFO, 'Disarming System');
      warningLightOff();
      armedOff();
      alarmOff();
      pirOff();
      disarmedOn();
      pir = 0;
      logger.log(logger.INFO, 'System Disarmed');
    } else {
      logger.log(logger.INFO, 'System Already Disabled');
    }
  }
};
