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

export const profileKinksCheckboxModel = [
  {
    label: 'AB / DL',
    value: 'baby'
  },
  {
    label: 'Bondage',
    value: 'bondage'
  }, {
    label: 'Boots',
    value: 'boots'
  }, {
    label: 'Bukakke',
    value: 'bukakke'
  }, {
    label: 'Businessmen / suits',
    value: 'suits'
  }, {
    label: 'Circle jerks',
    value: 'circlejerk'
  }, {
    label: 'Cross-dressing',
    value: 'cd'
  }, {
    label: 'Cumpetition',
    value: 'cumpetition'
  }, {
    label: 'Daddy / son',
    value: 'daddy'
  }, {
    label: 'Docking',
    value: 'docking'
  }, {
    label: 'Doctor / medical play',
    value: 'medical'
  }, {
    label: 'Edging',
    value: 'edging'
  }, {
    label: 'Feet',
    value: 'feet'
  }, {
    label: 'Frottage / cock2cock',
    value: 'frot'
  }, {
    label: 'Fisting',
    value: 'fisting'
  }, {
    label: 'Furries',
    value: 'furries'
  }, {
    label: 'Gaining / encouraging',
    value: 'gaining'
  }, {
    label: 'Kilts',
    value: 'kilts'
  }, {
    label: 'Latex',
    value: 'latex'
  }, {
    label: 'Leather',
    value: 'leather'
  }, {
    label: 'Macro / micro fantasies',
    value: 'macro'
  }, {
    label: 'Man-smell',
    value: 'smell'
  }, {
    label: 'Pig play',
    value: 'pig'
  }, {
    label: 'Pnp',
    value: 'pnp'
  }, {
    label: 'Public sex / exhibitionism',
    value: 'public'
  }, {
    label: 'Pup play',
    value: 'pup'
  }, {
    label: 'Role playing',
    value: 'roleplaying'
  }, {
    label: 'Rubber',
    value: 'rubber'
  }, {
    label: 'S&M (sadism & masochism)',
    value: 'sm'
  }, {
    label: 'Saline / silicone',
    value: 'saline'
  }, {
    label: 'Scat',
    value: 'scat'
  }, {
    label: 'Sounding',
    value: 'sounding'
  }, {
    label: 'Spanking',
    value: 'spank'
  }, {
    label: 'Speedos / lycra',
    value: 'speedo'
  }, {
    label: 'Straight / married men',
    value: 'straight'
  }, {
    label: 'Tattoos / piercings',
    value: 'tattoo'
  }, {
    label: 'Toys / dildos',
    value: 'toys'
  }, {
    label: 'Transexuals / intersexuals',
    value: 'trans'
  }, {
    label: 'Underwear',
    value: 'underwear'
  }, {
    label: 'Uniforms',
    value: 'uniforms'
  }, {
    label: 'Voyeurism',
    value: 'voyeurism'
  }, {
    label: 'Watersports / piss play',
    value: 'ws'
  }, {
    label: 'Wrestling / singlets',
    value: 'wrestling'
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
  'description',
  'masc',
  'voice'
];

export const profileIntFields = [
  'birthMonth',
  'birthYear'
];

export const profileNumberFields = [
  'weight',
  'height',
  'waist',
  'cockLength',
  'cockGirth'
];

export const profileStringListFields = [
  'kinks'
];

export const excludeSavingFields = [
];

const flattenModel = (model, array) => {
  model.forEach((groupModel) => {
    groupModel.rows.forEach((row) => {
      array.push(row.id);
    });
  });
};

export const starIds = [];
export const kinkIds = ['kinks'];

flattenModel(profileStarsModel, starIds);
flattenModel(profileKinksModel, kinkIds);

export const allIds = [];

starIds.forEach((id) => {
  allIds.push(id);
});

kinkIds.forEach((id) => {
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

profileStringListFields.forEach((id) => {
  allIds.push(id);
});

export const enums = {
  foreskin: {
    cut: 'Cut',
    semicut: 'Semi-cut',
    uncut: 'Uncut'
  },
  ethnicity: {
    black: 'Black / African Descent',
    asian: 'East Asian',
    latino: 'Latino',
    middleeastern: 'Middle Eastern / North African',
    nativeamerican: 'Native American / Indigenous',
    pacificislander: 'Pacific Islander',
    southasian: 'South Asian',
    white: 'White / Caucasian'
  },
  hiv: {
    unknown: "Don't know",
    no: 'Negative',
    yes: 'Positive',
    undetectable: 'Undetectable'
  },
  eye: {
    amber: 'Amber',
    blue: 'Blue',
    brown: 'Brown',
    hray: 'Gray',
    hreen: 'Green',
    hazel: 'Hazel',
    heterochromia: 'Heterochromia (2 distinct colors)',
    red: 'Red',
    violet: 'Violet'
  },
  hair: {
    bald: 'Bald',
    black: 'Black',
    blond: 'Blond',
    brown: 'Brown',
    dyed: 'Dyed (blue, green, red, etc)',
    gray: 'Gray',
    red: 'Red',
    white: 'White'
  },
  bodyHair: {
    smooth: 'Smooth',
    trimmed: 'Trimmed',
    some: 'Some hair',
    hairy: 'Hairy',
    very: 'Very hairy'
  },
  facialHair: {
    none: 'None',
    beard: 'Beard',
    goatee: 'Goatee (chin only)',
    vandyke: 'Goatee with moustache',
    moustache: 'Moustache',
    stubble: 'Stubble'
  },
  safer: {
    no: 'Prefer bareback',
    yes: 'Prefer condoms',
    noprep: 'Prefer bareback - on PrEP',
    yesprep: 'Prefer condoms - on PrEP'
  },
  masc: {
    verymasc: 'Very masculine',
    masc: 'Masculine',
    middle: 'In the middle',
    fem: 'Feminine',
    veryfem: 'Very feminine'
  },
  voice: {
    verydeep: 'Deep',
    deep: 'Deeper than average',
    average: 'Average',
    high: 'Higher than average',
    veryhigh: 'High'
  },
  smokes: {
    no: "Don't smoke",
    cigs: 'Cigarettes',
    both: 'Cigarettes & Cigars',
    cigars: 'Cigars',
    socially: 'Socially'
  },
  discretion: {
    no: "Don't need to be discrete",
    somewhat: 'Need to be discrete',
    yes: 'Need to be very discrete'
  }
};

