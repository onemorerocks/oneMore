export const profileStarsModel = [
  {
    group: 'oral',
    rows: [
      { id: 'givesHead', text: 'giving blowjobs' },
      { id: 'getsHead', text: 'getting blown' },
      { id: 'sixtynine', text: '69ing' }
    ]
  }, {
    group: 'anal',
    rows: [{ id: 'givesFuck', text: 'fucking guys' }, { id: 'getsFucked', text: 'getting fucked' }]
  }, {
    group: 'manual',
    rows: [
      { id: 'givesHand', text: 'giving handjobs' },
      { id: 'getsHand', text: 'getting jacked-off' },
      { id: 'mutualMast', text: 'mutual masturbation' }]
  }, {
    group: 'rimming',
    rows: [{ id: 'givesRim', text: 'rimming guys' }, { id: 'getsRim', text: 'getting rimmed' }]
  }, {
    group: 'drugs',
    rows: [
      { id: 'poppers', text: 'poppers' },
      { id: 'fourtwenty', text: '420' }
    ]
  }, {
    group: 'intimacy',
    rows: [{ id: 'nipplePlay', text: 'nipple play' }, { id: 'kissing', text: 'kissing' }, { id: 'cuddling', text: 'cuddling' }]
  }
];

export const profileKinksModel = [
  {
    group: 'D/s',
    rows: [{ id: 'dom', text: 'being dominant' }, { id: 'sub', text: 'being submissive' }]
  }
];

export const profileStringFields = [
  'nickname',
  'weightUnits',
  'heightUnits',
  'waistUnits',
  'cockUnits',
  'foreskin',
  'hiv',
  'safer',
  'ethnicity',
  'mixEthnicity',
  'eye',
  'hair',
  'bodyHair',
  'facialHair',
  'smokes',
  'discretion',
  'description'
];

export const profileIntFields = [
  'birthMonth',
  'birthYear',
  'masc',
  'voice'
];

export const profileNumberFields = [
  'weight',
  'height',
  'waist',
  'cockLength',
  'cockGirth'
];

const flattenModel = (model, array) => {
  model.forEach((groupModel) => {
    groupModel.rows.forEach((row) => {
      array.push(row.id);
    });
  });
};

export const starIds = [];
export const kinkIds = [];

flattenModel(profileStarsModel, starIds);
flattenModel(profileKinksModel, kinkIds);

export const allIds = [];
export const profileIds = [];

starIds.forEach((id) => {
  allIds.push(id);
});

kinkIds.forEach((id) => {
  allIds.push(id);
});

profileIntFields.forEach((id) => {
  allIds.push(id);
  profileIds.push(id);
});

profileStringFields.forEach((id) => {
  allIds.push(id);
  profileIds.push(id);
});

profileNumberFields.forEach((id) => {
  allIds.push(id);
  profileIds.push(id);
});
