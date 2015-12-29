export default (bodyFatPercentage, heightInCm, weightInKg) => {

  const inchesOverFiveFeet = (heightInCm - 152.4) / 2.54;

  const idealWeight = 52 + (1.9 * inchesOverFiveFeet);

  const idealFatMass = idealWeight * 0.225;

  const idealMuscleMass = idealWeight * 0.42;

  const idealBaseMass = idealWeight - idealFatMass - idealMuscleMass;

  const fatMass = weightInKg * bodyFatPercentage;

  const leanBodyMass = weightInKg - fatMass;

  const muscleMass = leanBodyMass - idealBaseMass;

  const muscleMassPercent = muscleMass / weightInKg;

  const comparitiveMuscleMass = Math.round(((muscleMassPercent / 0.42) - 1) * 100);

  return comparitiveMuscleMass;
}
