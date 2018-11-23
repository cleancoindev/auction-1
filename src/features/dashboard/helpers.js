import fromExponential from 'from-exponential';
import { BigNumber } from 'bignumber.js';

import {
  db,
  storage,
  rtdb,
} from '../../app/utils/firebase';

import { setError } from '../../app/appActions';

export function isTokenForSale(_contract, _tokenId) {
  return _contract.methods.isTokenOnSale(_tokenId).call();
}

export const getAuctionDetails = (_contract, _tokenId) => _contract.methods
  .items(_tokenId)
  .call()
  .then((result) => {
    const {
      t0, t1, p0, p1,
    } = result;
    return [t0, t1, p0, p1];
  });

export const getGemStory = (color, level) => {
  const type = {
    1: 'garnet',
    2: 'amethyst',
    3: 'aquamarine',
    4: 'diamond',
    5: 'emerald',
    6: 'pearl',
    7: 'ruby',
    8: 'peridot',
    9: 'sapphire',
    10: 'opal',
    11: 'topaz',
    12: 'turquoise',
  }[color];
  const lvl = `lvl${level}`;
  return db
    .doc(`gems/${type}`)
    .get()
    .then(doc => doc.data()[lvl]);
};

export const getGemImage = (color, grade, level) => {
  const type = {
    9: 'Sap',
    10: 'Opa',
    1: 'Gar',
    2: 'Ame',
  }[color];

  const gradeType = {
    1: 'D',
    2: 'C',
    3: 'B',
    4: 'A',
    5: 'AA',
    6: 'AAA',
  }[grade];

  const sourceImage = `${type}-${level}-${gradeType}-4500.png`;

  return storage.ref(`gems512/${sourceImage}`).getDownloadURL();
};

export const calcMiningRate = (gradeType, gradeValue) => ({
  1: gradeValue / 200000,
  2: 10 + gradeValue / 200000,
  3: 20 + gradeValue / 200000,
  4: 40 + (3 * gradeValue) / 200000,
  5: 100 + gradeValue / 40000,
  6: 300 + gradeValue / 10000,
}[gradeType]);

export const getGemQualities = (_contract, _tokenId) => _contract.methods
  .getProperties(_tokenId)
  .call()
  .then((_properties) => {
    // web3.utils.toBN(number)
    const properties = new BigNumber(_properties);
    const color = properties.dividedToIntegerBy(0x10000000000).toNumber();
    const level = properties
      .dividedToIntegerBy(0x100000000)
      .modulo(0x100)
      .toNumber();
    const gradeType = properties
      .dividedToIntegerBy(0x1000000)
      .modulo(0x100)
      .toNumber();
    const gradeValue = properties.modulo(0x1000000).toNumber();
    return [color, level, gradeType, gradeValue];
  });

export function getPrice(_tokenId, _contract, gemContract) {
  return _contract.methods.getCurrentPrice(gemContract, _tokenId).call();
}

export const nonExponential = count => fromExponential(Number(count) / 1000000000000000000);

export const calculateGemName = (providedGrade, providedTokenId) => {
  const gemType = {
    1: 'Garnet',
    2: 'Amethyst',

    3: 'Aquamarine',
    4: 'Diamond',
    5: 'Emerald',
    6: 'Pearl',

    7: 'Ruby',
    8: 'Peridot',

    9: 'Sapphire',
    10: 'Opal',

    11: 'Topaz',
    12: 'Turquoise',
  }[providedGrade];
  return `${gemType} #${providedTokenId}`;
};

export const getReferralPoints = (preSaleContract, userId) =>
  // eslint-disable-next-line
  preSaleContract &&
  preSaleContract.methods
  && preSaleContract.methods
    .unusedReferralPoints(userId)
    .call()
    .then(referralPoints => referralPoints)
    .catch(error => setError(error));

export const getPlotCount = (preSaleContract, userId) => preSaleContract.methods
  .geodeBalances(userId)
  .call()
  .then(referralPoints => referralPoints)
  .catch(error => setError(error));

// export const markSold = countryId => console.log('countryId', countryId);

// eslint-disable-next-line
export const markSold = mapIndex => rtdb.ref(`/worldMap/objects/units/geometries/${mapIndex}/properties`).update({ sold: true });


export const getCountryDetailsFromFirebase = mapIndex => rtdb.ref(`/worldMap/objects/units/geometries/${mapIndex}/properties`).once('value').then(snap => snap.val());

export const validateCoupon = (couponCode) => {
  const characters = couponCode.split('');
  const last3Characters = couponCode.substr(couponCode.length - 3);

  // eslint-disable-next-line
  if (isNaN(last3Characters)) {
    return false;
  }

  if (Number(last3Characters) > 190 || Number(last3Characters) < 150) {
    return false;
  }

  if (characters.length !== 20) {
    return false;
  }

  if (!characters.includes('_')) {
    return false;
  }

  if (characters[16] !== '_') {
    return false;
  }

  for (let i = 0; i < 15; i += 1) {
    // eslint-disable-next-line
    if (!isNaN(characters[i])) {
      return false;
    }
  }

  return true;
};

const countries = [
  {
    name: 'Afghanistan',
    mapIndex: 1,
    countryId: 42,
  },
  {
    name: 'Angola',
    mapIndex: 2,
    countryId: 23,
  },
  {
    name: 'Albania',
    mapIndex: 4,
    countryId: 141,
  },
  {
    name: 'Andorra',
    mapIndex: 6,
    countryId: 181,
  },
  {
    name: 'United Arab Emirates',
    mapIndex: 7,
    countryId: 115,
  },
  {
    name: 'Argentina',
    mapIndex: 8,
    countryId: 8,
  },
  {
    name: 'Armenia',
    mapIndex: 9,
    countryId: 140,
  },
  {
    name: 'Antigua and Barb.',
    mapIndex: 14,
    countryId: 183,
  },
  {
    name: 'Australia',
    mapIndex: 15,
    countryId: 6,
  },
  {
    name: 'Austria',
    mapIndex: 16,
    countryId: 114,
  },
  {
    name: 'Azerbaijan',
    mapIndex: 17,
    countryId: 113,
  },
  {
    name: 'Burundi',
    mapIndex: 18,
    countryId: 144,
  },
  {
    name: 'Belgium',
    mapIndex: 19,
    countryId: 138,
  },
  {
    name: 'Benin',
    mapIndex: 20,
    countryId: 101,
  },
  {
    name: 'Burkina Faso',
    mapIndex: 21,
    countryId: 75,
  },
  {
    name: 'Bangladesh',
    mapIndex: 22,
    countryId: 93,
  },
  {
    name: 'Bulgaria',
    mapIndex: 23,
    countryId: 104,
  },
  {
    name: 'Bahrain',
    mapIndex: 24,
    countryId: 178,
  },
  {
    name: 'Bahamas',
    mapIndex: 25,
    countryId: 157,
  },
  {
    name: 'Bosnia and Herz.',
    mapIndex: 26,
    countryId: 126,
  },
  {
    name: 'Belarus',
    mapIndex: 28,
    countryId: 85,
  },
  {
    name: 'Belize',
    mapIndex: 29,
    countryId: 149,
  },
  {
    name: 'Bolivia',
    mapIndex: 31,
    countryId: 28,
  },
  {
    name: 'Brazil',
    mapIndex: 32,
    countryId: 5,
  },
  {
    name: 'Barbados',
    mapIndex: 33,
    countryId: 184,
  },
  {
    name: 'Brunei',
    mapIndex: 34,
    countryId: 165,
  },
  {
    name: 'Bhutan',
    mapIndex: 35,
    countryId: 130,
  },
  {
    name: 'Botswana',
    mapIndex: 36,
    countryId: 47,
  },
  {
    name: 'Central African Rep.',
    mapIndex: 37,
    countryId: 44,
  },
  {
    name: 'Canada',
    mapIndex: 38,
    countryId: 2,
  },
  {
    name: 'Switzerland',
    mapIndex: 39,
    countryId: 134,
  },
  {
    name: 'Chile',
    mapIndex: 40,
    countryId: 38,
  },
  {
    name: 'China',
    mapIndex: 41,
    countryId: 3,
  },
  {
    name: "Côte d'Ivoire",
    mapIndex: 42,
    countryId: 69,
  },
  {
    name: 'Cameroon',
    mapIndex: 43,
    countryId: 54,
  },
  {
    name: 'Dem. Rep. Congo',
    mapIndex: 44,
    countryId: 11,
  },
  {
    name: 'Congo',
    mapIndex: 45,
    countryId: 64,
  },
  {
    name: 'Colombia',
    mapIndex: 47,
    countryId: 26,
  },
  {
    name: 'Comoros',
    mapIndex: 48,
    countryId: 170,
  },
  {
    name: 'Cape Verde',
    mapIndex: 49,
    countryId: 167,
  },
  {
    name: 'Costa Rica',
    mapIndex: 50,
    countryId: 127,
  },
  {
    name: 'Cuba',
    mapIndex: 51,
    countryId: 105,
  },
  {
    name: 'Cyprus',
    mapIndex: 55,
    countryId: 164,
  },
  {
    name: 'Czech Rep.',
    mapIndex: 56,
    countryId: 116,
  },
  {
    name: 'Germany',
    mapIndex: 57,
    countryId: 63,
  },
  {
    name: 'Djibouti',
    mapIndex: 58,
    countryId: 150,
  },
  {
    name: 'Dominica',
    mapIndex: 59,
    countryId: 173,
  },
  {
    name: 'Denmark',
    mapIndex: 60,
    countryId: 132,
  },
  {
    name: 'Dominican Rep.',
    mapIndex: 61,
    countryId: 129,
  },
  {
    name: 'Algeria',
    mapIndex: 62,
    countryId: 10,
  },
  {
    name: 'Ecuador',
    mapIndex: 63,
    countryId: 74,
  },
  {
    name: 'Egypt',
    mapIndex: 64,
    countryId: 30,
  },
  {
    name: 'Eritrea',
    mapIndex: 65,
    countryId: 98,
  },
  {
    name: 'Spain',
    mapIndex: 66,
    countryId: 52,
  },
  {
    name: 'Estonia',
    mapIndex: 67,
    countryId: 131,
  },
  {
    name: 'Ethiopia',
    mapIndex: 68,
    countryId: 27,
  },
  {
    name: 'Finland',
    mapIndex: 69,
    countryId: 65,
  },
  {
    name: 'Fiji',
    mapIndex: 70,
    countryId: 153,
  },
  {
    name: 'France',
    mapIndex: 72,
    countryId: 41,
  },
  {
    name: 'Micronesia',
    mapIndex: 74,
    countryId: 176,
  },
  {
    name: 'Gabon',
    mapIndex: 75,
    countryId: 77,
  },
  {
    name: 'United Kingdom',
    mapIndex: 76,
    countryId: 79,
  },
  {
    name: 'Georgia',
    mapIndex: 77,
    countryId: 120,
  },
  {
    name: 'Ghana',
    mapIndex: 79,
    countryId: 81,
  },
  {
    name: 'Guinea',
    mapIndex: 80,
    countryId: 78,
  },
  {
    name: 'Guinea-Bissau',
    mapIndex: 82,
    countryId: 135,
  },
  {
    name: 'Eq. Guinea',
    mapIndex: 83,
    countryId: 143,
  },
  {
    name: 'Greece',
    mapIndex: 84,
    countryId: 96,
  },
  {
    name: 'Grenada',
    mapIndex: 85,
    countryId: 186,
  },
  {
    name: 'Greenland',
    mapIndex: 86,
    countryId: 12,
  },
  {
    name: 'Guatemala',
    mapIndex: 87,
    countryId: 106,
  },
  {
    name: 'Guyana',
    mapIndex: 89,
    countryId: 84,
  },
  {
    name: 'Honduras',
    mapIndex: 92,
    countryId: 102,
  },
  {
    name: 'Croatia',
    mapIndex: 93,
    countryId: 125,
  },
  {
    name: 'Haiti',
    mapIndex: 94,
    countryId: 145,
  },
  {
    name: 'Hungary',
    mapIndex: 95,
    countryId: 109,
  },
  {
    name: 'Indonesia',
    mapIndex: 96,
    countryId: 15,
  },
  {
    name: 'India',
    mapIndex: 98,
    countryId: 7,
  },
  {
    name: 'Ireland',
    mapIndex: 101,
    countryId: 119,
  },
  {
    name: 'Iran',
    mapIndex: 102,
    countryId: 18,
  },
  {
    name: 'Iraq',
    mapIndex: 103,
    countryId: 59,
  },
  {
    name: 'Iceland',
    mapIndex: 104,
    countryId: 107,
  },
  {
    name: 'Israel',
    mapIndex: 105,
    countryId: 146,
  },
  {
    name: 'Italy',
    mapIndex: 106,
    countryId: 72,
  },
  {
    name: 'Jamaica',
    mapIndex: 107,
    countryId: 162,
  },
  {
    name: 'Jordan',
    mapIndex: 109,
    countryId: 110,
  },
  {
    name: 'Japan',
    mapIndex: 110,
    countryId: 62,
  },
  {
    name: 'Kazakhstan',
    mapIndex: 112,
    countryId: 9,
  },
  {
    name: 'Kenya',
    mapIndex: 113,
    countryId: 49,
  },
  {
    name: 'Kyrgyzstan',
    mapIndex: 114,
    countryId: 86,
  },
  {
    name: 'Cambodia',
    mapIndex: 115,
    countryId: 89,
  },
  {
    name: 'Kiribati',
    mapIndex: 116,
    countryId: 175,
  },
  {
    name: 'St. Kitts and Nevis',
    mapIndex: 117,
    countryId: 189,
  },
  {
    name: 'Korea',
    mapIndex: 118,
    countryId: 108,
  },
  {
    name: 'Kuwait',
    mapIndex: 120,
    countryId: 154,
  },
  {
    name: 'Lao PDR',
    mapIndex: 121,
    countryId: 83,
  },
  {
    name: 'Lebanon',
    mapIndex: 122,
    countryId: 163,
  },
  {
    name: 'Liberia',
    mapIndex: 123,
    countryId: 103,
  },
  {
    name: 'Libya',
    mapIndex: 124,
    countryId: 17,
  },
  {
    name: 'Saint Lucia',
    mapIndex: 125,
    countryId: 179,
  },
  {
    name: 'Liechtenstein',
    mapIndex: 126,
    countryId: 190,
  },
  {
    name: 'Sri Lanka',
    mapIndex: 127,
    countryId: 121,
  },
  {
    name: 'Lesotho',
    mapIndex: 128,
    countryId: 139,
  },
  {
    name: 'Lithuania',
    mapIndex: 129,
    countryId: 122,
  },
  {
    name: 'Luxembourg',
    mapIndex: 130,
    countryId: 169,
  },
  {
    name: 'Latvia',
    mapIndex: 131,
    countryId: 123,
  },
  {
    name: 'Morocco',
    mapIndex: 134,
    countryId: 58,
  },
  {
    name: 'Moldova',
    mapIndex: 136,
    countryId: 137,
  },
  {
    name: 'Madagascar',
    mapIndex: 137,
    countryId: 48,
  },
  {
    name: 'Maldives',
    mapIndex: 138,
    countryId: 188,
  },
  {
    name: 'Mexico',
    mapIndex: 139,
    countryId: 14,
  },
  {
    name: 'Macedonia',
    mapIndex: 141,
    countryId: 148,
  },
  {
    name: 'Mali',
    mapIndex: 142,
    countryId: 24,
  },
  {
    name: 'Malta',
    mapIndex: 143,
    countryId: 187,
  },
  {
    name: 'Myanmar',
    mapIndex: 144,
    countryId: 40,
  },
  {
    name: 'Montenegro',
    mapIndex: 145,
    countryId: 158,
  },
  {
    name: 'Mongolia',
    mapIndex: 146,
    countryId: 19,
  },
  {
    name: 'Mozambique',
    mapIndex: 148,
    countryId: 36,
  },
  {
    name: 'Mauritania',
    mapIndex: 149,
    countryId: 29,
  },
  {
    name: 'Mauritius',
    mapIndex: 151,
    countryId: 171,
  },
  {
    name: 'Malawi',
    mapIndex: 152,
    countryId: 100,
  },
  {
    name: 'Malaysia',
    mapIndex: 153,
    countryId: 66,
  },
  {
    name: 'Namibia',
    mapIndex: 154,
    countryId: 34,
  },
  {
    name: 'Niger',
    mapIndex: 156,
    countryId: 22,
  },
  {
    name: 'Nigeria',
    mapIndex: null,
    countryId: 32,
  },
  {
    name: 'Nicaragua',
    mapIndex: 159,
    countryId: 97,
  },
  {
    name: 'Netherlands',
    mapIndex: 161,
    countryId: 133,
  },
  {
    name: 'Norway',
    mapIndex: 162,
    countryId: 68,
  },
  {
    name: 'Nepal',
    mapIndex: 163,
    countryId: 94,
  },
  {
    name: 'New Zealand',
    mapIndex: 165,
    countryId: 76,
  },
  {
    name: 'Oman',
    mapIndex: 166,
    countryId: 71,
  },
  {
    name: 'Pakistan',
    mapIndex: 167,
    countryId: 35,
  },
  {
    name: 'Panama',
    mapIndex: 168,
    countryId: 117,
  },
  {
    name: 'Peru',
    mapIndex: 170,
    countryId: 20,
  },
  {
    name: 'Philippines',
    mapIndex: 171,
    countryId: 73,
  },
  {
    name: 'Palau',
    mapIndex: 172,
    countryId: 182,
  },
  {
    name: 'Papua New Guinea',
    mapIndex: 173,
    countryId: 55,
  },
  {
    name: 'Poland',
    mapIndex: 174,
    countryId: 70,
  },
  {
    name: 'Dem. Rep. Korea',
    mapIndex: 176,
    countryId: 99,
  },
  {
    name: 'Portugal',
    mapIndex: 177,
    countryId: 111,
  },
  {
    name: 'Paraguay',
    mapIndex: 178,
    countryId: 60,
  },
  {
    name: 'Qatar',
    mapIndex: 181,
    countryId: 160,
  },
  {
    name: 'Romania',
    mapIndex: 182,
    countryId: 82,
  },
  {
    name: 'Russia',
    mapIndex: 183,
    countryId: 1,
  },
  {
    name: 'Rwanda',
    mapIndex: 184,
    countryId: 147,
  },
  {
    name: 'Saudi Arabia',
    mapIndex: 186,
    countryId: 13,
  },
  {
    name: 'Sudan',
    mapIndex: 187,
    countryId: 16,
  },
  {
    name: 'S. Sudan',
    mapIndex: 188,
    countryId: 45,
  },
  {
    name: 'Senegal',
    mapIndex: 189,
    countryId: 87,
  },
  {
    name: 'Singapore',
    mapIndex: 190,
    countryId: 177,
  },
  {
    name: 'Solomon Is.',
    mapIndex: 193,
    countryId: 142,
  },
  {
    name: 'Sierra Leone',
    mapIndex: 194,
    countryId: 118,
  },
  {
    name: 'El Salvador',
    mapIndex: 195,
    countryId: 151,
  },
  {
    name: 'Somalia',
    mapIndex: 198,
    countryId: 43,
  },
  {
    name: 'Serbia',
    mapIndex: 200,
    countryId: 112,
  },
  {
    name: 'São Tomé and Principe',
    mapIndex: 201,
    countryId: 172,
  },
  {
    name: 'Suriname',
    mapIndex: 202,
    countryId: 92,
  },
  {
    name: 'Slovakia',
    mapIndex: 203,
    countryId: 128,
  },
  {
    name: 'Slovenia',
    mapIndex: 204,
    countryId: 152,
  },
  {
    name: 'Sweden',
    mapIndex: 205,
    countryId: 56,
  },
  {
    name: 'Swaziland',
    mapIndex: 206,
    countryId: 155,
  },
  {
    name: 'Seychelles',
    mapIndex: 208,
    countryId: 180,
  },
  {
    name: 'Syria',
    mapIndex: 209,
    countryId: 88,
  },
  {
    name: 'Chad',
    mapIndex: 211,
    countryId: 21,
  },
  {
    name: 'Togo',
    mapIndex: 212,
    countryId: 124,
  },
  {
    name: 'Thailand',
    mapIndex: 213,
    countryId: 51,
  },
  {
    name: 'Tajikistan',
    mapIndex: 214,
    countryId: 95,
  },
  {
    name: 'Turkmenistan',
    mapIndex: 215,
    countryId: 53,
  },
  {
    name: 'Timor-Leste',
    mapIndex: 216,
    countryId: 156,
  },
  {
    name: 'Tonga',
    mapIndex: 217,
    countryId: 174,
  },
  {
    name: 'Trinidad and Tobago',
    mapIndex: 218,
    countryId: 166,
  },
  {
    name: 'Tunisia',
    mapIndex: 219,
    countryId: 91,
  },
  {
    name: 'Turkey',
    mapIndex: 220,
    countryId: 37,
  },
  {
    name: 'Tanzania',
    mapIndex: 222,
    countryId: 31,
  },
  {
    name: 'Uganda',
    mapIndex: 223,
    countryId: 80,
  },
  {
    name: 'Ukraine',
    mapIndex: 224,
    countryId: 46,
  },
  {
    name: 'Uruguay',
    mapIndex: 225,
    countryId: 90,
  },
  {
    name: 'United States',
    mapIndex: 226,
    countryId: 4,
  },
  {
    name: 'Uzbekistan',
    mapIndex: 227,
    countryId: 57,
  },
  {
    name: 'St. Vin. and Gren.',
    mapIndex: 229,
    countryId: 185,
  },
  {
    name: 'Venezuela',
    mapIndex: 230,
    countryId: 33,
  },
  {
    name: 'Vietnam',
    mapIndex: 233,
    countryId: 67,
  },
  {
    name: 'Vanuatu',
    mapIndex: 234,
    countryId: 159,
  },
  {
    name: 'Samoa',
    mapIndex: 236,
    countryId: 168,
  },
  {
    name: 'Yemen',
    mapIndex: 237,
    countryId: 50,
  },
  {
    name: 'South Africa',
    mapIndex: 238,
    countryId: 25,
  },
  {
    name: 'Zambia',
    mapIndex: 239,
    countryId: 39,
  },
  {
    name: 'Zimbabwe',
    mapIndex: 240,
    countryId: 61,
  },
];

export const getCountryNameFromCountryId = (id) => {
  const result = countries.find(country => country.countryId === id);
  return result.name;
};

export const getMapIndexFromCountryId = (id) => {
  const result = countries.find(country => country.countryId === id);
  return result.mapIndex;
};
