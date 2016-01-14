const IDEAL_BODY_FAT_PERCENT = 0.225;
const IDEAL_MUSCLE_PERCENT = 0.42;

export default (bodyFatPercentage, heightInCm, weightInKg) => {

  const inchesOverFiveFeet = (heightInCm - 152.4) / 2.54;

  const idealWeight = 52 + (1.9 * inchesOverFiveFeet);

  const idealFatMass = idealWeight * IDEAL_BODY_FAT_PERCENT;

  const idealMuscleMass = idealWeight * IDEAL_MUSCLE_PERCENT;

  const idealBaseMass = idealWeight - idealFatMass - idealMuscleMass;

  const fatMass = weightInKg * bodyFatPercentage;

  const leanBodyMass = weightInKg - fatMass;

  const muscleMass = leanBodyMass - idealBaseMass;

  const muscleMassPercent = muscleMass / weightInKg;

  const comparitiveMuscleMass = Math.round(((muscleMassPercent / IDEAL_MUSCLE_PERCENT) - 1) * 100);

  return comparitiveMuscleMass;
};

/* function estimateBodyfat(waistInCm, weightInKg, heightInCm) {

  const waistInMeters = waistInCm / 100;

  const heightInMeters = heightInCm / 100;

  const bai = (100 * waistInMeters / (heightInMeters * Math.sqrt(heightInMeters))) - 18;

  // const weightInLbs = weightInKg * 2.20462;

  // const waistInInches = waistInCm / 2.54;

  //const bf = 100 * (-98.42 + 4.15 * waistInInches - 0.082 * weightInLbs) / weightInLbs;

  return bai;
}

function esitmateBodyfat2(waistInCm, wristInCm) {
  return (0.7237 * waistInCm) - (2.6087 * wristInCm) + 0.1211;
}*/
