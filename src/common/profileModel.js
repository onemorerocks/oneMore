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
    group: 'Fisting',
    rows: [{ id: 'givesFist', text: 'fisting guys' }, { id: 'getsFist', text: 'getting fisted' }]
  },
  {
    group: 'Bondage',
    rows: [{ id: 'givesTie', text: 'tying guys up' }, { id: 'getsTie', text: 'getting tied up' }]
  },
  {
    group: 'Pain',
    rows: [{ id: 'givesPain', text: 'inflicting pain' }, { id: 'getsPain', text: 'receiving pain' }]
  },
  {
    group: 'Watersports',
    rows: [{ id: 'givesWs', text: 'pissing on guys' }, { id: 'getsWs', text: 'getting pissed on' }]
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
  'discretion'
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

flattenModel(profileStarsModel, starIds);
flattenModel(profileKinksModel, starIds);

export const allIds = [];

starIds.forEach((id) => {
  allIds.push(id);
});

profileIntFields.forEach((id) => {
  allIds.push(id);
});

profileStringFields.forEach((id) => {
  allIds.push(id);
});

profileNumberFields.forEach((id) => {
  allIds.push(id);
});
