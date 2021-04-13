export const ledControl = {
  masterBrightness: { param: 'A=', range: [0, 255] },
  effectIndex: { param: 'FX=', range: [0, 116] },
  effectSpeed: { param: 'SX=', range: [0, 255] },
  effectIntensity: { param: 'IX=', range: [0, 255] },
  paletteIndex: { param: 'FP=', range: [0, 55] },
  receiveUDP: { param: 'RN=', range: [0, 1] },
  sendUDP: { param: 'SN=', range: [0, 1] },
};
