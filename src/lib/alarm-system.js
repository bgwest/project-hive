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
const pir = new Gpio(17, 'in', 'both');

// -----Timeout-----------------------------------------------------------------------------------
const ARMING_SYSTEM = 30000;
const ALARM = 30000;
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
};

const turnCameraOff = () => {
  camera.stop();
};

// -----Sound Assets-----------------------------------------------------------------------------
// const armedSound = new Sound('./assets/sound-assets/vin-armed');
// const armingSound = new Sound('./assets/sound-assets/vin-arming.wav');
// const motionSound = new Sound('./assets/sound-assets/vin-motion.wav');
// const alarmSound = new Sound('./assets/sound-assets/vin-alarm.wav');
// const disarmedSound = new Sound('./assets/sound-assets/vin-disarmed.wav');

//  -----Turns ON/OFF the Red LED (DISARM INDICATOR)-----------------------------------------------
const disarmedOn = () => {
  if (disarmed.readSync() === 0) {
    disarmed.writeSync(1);
  }
  logger.log(logger.INFO, 'Disarmed successfully');
  // disarmedSound.play();
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
  logger.log(logger.INFO, 'Arming System');
  // armingSound.play();
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
  logger.log(logger.INFO, 'System Armed');
  // armedSound.play();
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
    // alarmSound.play();
    takePicture();
    setTimeout(turnCameraOff, 10000);
  }
};

const alarmOff = () => {
  if (alarm.readSync() === 1) {
    alarm.writeSync(0);
  }
};

const activatePIR = () => {
  pir.watch((error, value) => {
    if (error) {
      pir.unexport();
      process.exit();
      logger.log(logger.INFO, 'PIR Error');
    }
    if (value === 1 && disarmed.readSync() !== 1) {
      warningLightOn();
      setTimeout(alarmOn, ALARM);
      logger.log(logger.INFO, 'Villain Detected');
      pir.unexport();
      // motionSound();
    }
  });
};

const pirOff = () => {
  if (disarmed.readSync() === 0) {
    pir.unexport();
  }
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
    disarmedOff();
    warningLightOn();
    setTimeout(systemArmed, ARMING_SYSTEM);
  }

  disarmSystem() {
    if (disarmed.readSync() === 0) {
      logger.log(logger.INFO, 'Disarm System');
      warningLightOff();
      logger.log(logger.INFO, 'Warning Light Off');
      armedOff();
      logger.log(logger.INFO, 'Armed Off');
      alarmOff();
      logger.log(logger.INFO, 'Alarm Off');
      pirOff();
      logger.log(logger.INFO, 'PIR Off');
      disarmedOn();
      logger.log(logger.INFO, 'Disarm On');
    } else {
      logger.log(logger.INFO, 'System Already Disabled');
    }
  }
};
