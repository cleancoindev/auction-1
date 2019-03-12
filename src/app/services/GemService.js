import {BigNumber} from 'bignumber.js';
import {db, storage} from '../../app/utils/firebase';

export default class GemService {

    constructor(gemContractInstance, web3Instance, auctionContractInstance) {
        console.log('Gem Service constructor called', gemContractInstance);
        this.contract = gemContractInstance;
        this.web3 = web3Instance;
        this.auctionContract = auctionContractInstance;
    }

    getGemProperties = async (tokenId) => {
        try {
            const properties = new BigNumber(await (this.contract.methods
              .getProperties(tokenId)
              .call()));

            return unpackGemProperties(properties);
        }
        catch (err) {
            console.log('ERROR in getGemProperties', err)
        }
    }

    getGemOwner = async (tokenId) => {
        return (await this.contract.methods
          .ownerOf(tokenId)
          .call())
    }

    getGemCreationTime = async (tokenId) => {
        const blockNumber = await this.contract.methods
          .getCreationTime(tokenId)
          .call();

        const {timestamp} = await transform(blockNumber, this.web3);
        return timestamp;
    }

    getGem = async (tokenId) => {
        // const [gemProperties, gemOwner, gemCreationTime] = await Promise.all(
        //   [
        //       this.getGemProperties(tokenId),
        //       this.getGemOwner(tokenId),
        //       this.getGemCreationTime(tokenId)
        //   ]);

        //console.log(1111111111, gemProperties, gemOwner, gemCreationTime);

        console.log('GEM WILL BE UNPACKED: ');

        const gem = await this.getPackedGem(tokenId);

        console.log('GEM UNPACKED: ', gem);

        return {
          ...gem,
            id: tokenId,
            //owner: gemOwner,
            story: await getGemStory(gem, tokenId),
            image: await getGemImage(gem, tokenId),
            name: calculateGemName(gem.color, tokenId),
            rate: calculateMiningRate(gem.gradeType, gem.gradeValue),
            restingEnergyMinutes: calculateGemRestingEnergy(gem.creationTime)
        }
    }


    getPackedGem = async (tokenId) => {
        try {
            const packed256_256 = await (this.contract.methods
              .getPacked(tokenId)
              .call());
            console.log('PACKED GEM!!!!!!!!!!!!!!', packed256_256);
            return await this.unpackGem([new BigNumber(packed256_256[0]), new BigNumber(packed256_256[1])]);
        }
        catch (err) {
            console.log('ERROR in getPacked', err)
        }
    }

    unpackGem = async ([high256, low256]) => {
        const color = high256.dividedToIntegerBy(new BigNumber(2).pow(184)).modulo(0x100).toNumber();
        const level = high256
          .dividedToIntegerBy(new BigNumber(2).pow(144))
          .modulo(0x100)
          .toNumber();
        const gradeType = high256
          .dividedToIntegerBy(new BigNumber(2).pow(80+24))
          .modulo(0x100)
          .toNumber();
        const gradeValue = high256
          .dividedToIntegerBy(new BigNumber(2).pow(80))
          .modulo(0x1000000).toNumber();
        const gradeModifiedTime = await transform(high256
          .dividedToIntegerBy(new BigNumber(2).pow(112))
          .modulo(new BigNumber(2).pow(32)).toNumber(), this.web3);
        const levelModifiedTime = await transform(high256
          .dividedToIntegerBy(new BigNumber(2).pow(152))
          .modulo(0x100000000).toNumber(), this.web3);

        const owner = '0x'+low256.modulo(new BigNumber(2).pow(160)).toString(16).padStart(40, "0");

        console.log('unpack gem owner: ', owner);

        const creationTime = await transform(low256
          .dividedToIntegerBy(new BigNumber(2).pow(224)).modulo(0x100000000).toNumber(), this.web3);

        console.log(333333333, levelModifiedTime.timestamp, gradeModifiedTime.timestamp, creationTime.timestamp, Date.now());

        return {color: 7, level, gradeType, gradeValue, owner, creationTime: Math.max(creationTime.timestamp, gradeModifiedTime.timestamp, levelModifiedTime.timestamp)}
    }

    getGemAuctionIsLive = async (tokenId) => {
        return !(new BigNumber(
          await (this.auctionContract.methods
            .getTokenSaleStatus(this.contract._address, tokenId)
            .call()))).isZero();
    }

    getImagesForGems = async (gemsToLoadImages) => {
        console.log('GEMS TO LOAD IMAGES: ', gemsToLoadImages);
        return await Promise.all(
          gemsToLoadImages.map(async gem => {
              gem.image = await getGemImage(
                {
                    color: gem.color,
                    level: gem.level,
                    gradeType: gem.gradeType,
                    gradeValue: gem.gradeValue
                }, gem.id);
              //return gem;
          }));
    }

    getOwnerGems = async (ownerId) => {

        const notAuctionGemsUserOwns = await this.contract.methods.getPackedCollection(ownerId).call();
        return notAuctionGemsUserOwns.map(notAuctionGem => {
            const packed80uint = new BigNumber(notAuctionGem);
            const gemId = packed80uint.dividedToIntegerBy(new BigNumber(2).pow(48)).toNumber();
            const gemPackedProperties = packed80uint.modulo(new BigNumber(2).pow(48));
            const gemProperties = unpackGemProperties(gemPackedProperties);
            return {
                ...gemProperties,
                id: gemId,
                owner: ownerId,
                auctionIsLive: false, //await this.getGemAuctionIsLive(gemId),
                //story: await getGemStory(gemProperties, gemId),
                //image: await getGemImage(gemProperties, gemId),
                name: calculateGemName(gemProperties.color, gemId),
                rate: calculateMiningRate(gemProperties.gradeType, gemProperties.gradeValue),
                //restingEnergyMinutes: calculateGemRestingEnergy(gemCreationTime)
            }
        })
    }
}


export const unpackGemProperties = (properties) => {
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

    return {color:7, level, gradeType, gradeValue}
}

export const getGemStory = async (gemProperties, tokenId) => {

    console.log('GET GEM STORY, gemProperties: ', gemProperties.color);

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
    }[gemProperties.color];
    const lvl = `lvl${gemProperties.level}`;


    console.log('GET GEM STORY: ', type, lvl);

    if (type && lvl) {

        let story;
        const docData = (await db
          .doc(`specialStones/${tokenId}`)
          .get()).data();

        try {
            story = (await db
              .doc(`gems/${docData.storyName}`)
              .get()).data()[lvl];
            if (!story) {
                throw "No special story for this gem!";
            }
        }
        catch (e) {
            story = (await db
              .doc(`gems/${type}`)
              .get()).data()[lvl];
        }
        console.log("STORY::", story);
        return story;
    }
};

export const getGemImage = async (gemProperties, tokenId) => {

    console.log('GET GEM IMAGE, gemProperties: ', gemProperties);

    const type = {
        1: 'Gar',
        2: 'Ame',
        3: 'Aqu',
        4: 'Dia',
        5: 'Eme',
        6: 'Pea',
        7: 'Rub',
        8: 'Per',
        9: 'Sap',
        10: 'Opa',
        11: 'Top',
        12: 'Tur',
    }[gemProperties.color];

    const gradeType = {
        1: 'D',
        2: 'C',
        3: 'B',
        4: 'A',
        5: 'AA',
        6: 'AAA',
    }[gemProperties.gradeType];

    const level = gemProperties.level;
    // check if any special images are present for gem
    // if no - use type-level-grade formula
    //const sourceImage = `${type}-${level}-${gradeType}-4500.png`;

    console.log('GET GEM IMAGE: ', type, level);

    if (type && gradeType && level) {
        let url;
        try {
            const doc = await db
              .doc(`specialStones/${tokenId}`)
              .get();

            try {
                url = await (storage.ref(`gems512/${doc.data().imageName}-${level}-${gradeType}.png`).getDownloadURL());
            }
            catch (e) {
                url = await (storage.ref(`gems512/${doc.data().imageName}.png`).getDownloadURL());
            }
        }
        catch (err) {
            try {
                url = await (storage.ref(`gems512/${type}-${level}-${gradeType}-4500.png`).getDownloadURL())
            }
            catch (e) {
                url = await (storage.ref(`gems512/specialOneImage.png`).getDownloadURL())
            }
        }
        return url;
    }
};

export const calculateMiningRate = (gradeType, gradeValue) => ({
    1: gradeValue / 200000,
    2: 10 + gradeValue / 200000,
    3: 20 + gradeValue / 200000,
    4: 40 + (3 * gradeValue) / 200000,
    5: 100 + gradeValue / 40000,
    6: 300 + gradeValue / 10000,
}[gradeType]);


export const calculateGemName = (color, tokenId) => {
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
    }[color];
    return `${gemType} #${tokenId}`;
};


export const calculateGemRestingEnergy = (creationTimestamp) => {

    const linearThreshold = 37193;
    const ageSeconds = ((Date.now() / 1000) | 0) - creationTimestamp;
    const ageMinutes = Math.floor(ageSeconds / 60);
    return Math.floor(
      -7e-6 * Math.pow(Math.min(ageMinutes, linearThreshold), 2) +
      0.5406 * Math.min(ageMinutes, linearThreshold)
      + 0.0199 * Math.max(ageMinutes - linearThreshold, 0),
    );
}


const transform = (result, web3) => web3.eth.getBlock(result, (err, results) => {
    if (err) {
        return err;
    }
    return results;
});
