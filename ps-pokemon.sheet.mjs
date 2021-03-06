
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// From tools/deploy/spritepath, factor this out into separate library eventually?
function decodeComponent(s) {
    return s
        .replace(/([^_])_([^_])/g, "$1 $2")
        .replace(/~/g, "-")
        // Must occur last, or escaped ~/_ will be transformed
        .replace(/__(....)/g, (_, m) => String.fromCharCode(parseInt(m, 16)));
}

function decode(s) {
    return s.split("-").map(c => decodeComponent(c));
}

function parsePokemonFilename([num, formeNum, base, forme=null]) {
    return {num: parseInt(num, 10), formeNum: parseInt(formeNum, 10), base, forme};
}

function toPSID(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

// Derived from pokemon-showdown-client/src/battle-dex-data.ts
const BattlePokemonIconIndexes = {
    unknown: 0,
    
	egg: 900 + 1,
	pikachubelle: 900 + 2,
	pikachulibre: 900 + 3,
	pikachuphd: 900 + 4,
	pikachupopstar: 900 + 5,
	pikachurockstar: 900 + 6,
	pikachucosplay: 900 + 7,
	unownexclamation: 900 + 8,
	unownquestion: 900 + 9,
	unownb: 900 + 10,
	unownc: 900 + 11,
	unownd: 900 + 12,
	unowne: 900 + 13,
	unownf: 900 + 14,
	unowng: 900 + 15,
	unownh: 900 + 16,
	unowni: 900 + 17,
	unownj: 900 + 18,
	unownk: 900 + 19,
	unownl: 900 + 20,
	unownm: 900 + 21,
	unownn: 900 + 22,
	unowno: 900 + 23,
	unownp: 900 + 24,
	unownq: 900 + 25,
	unownr: 900 + 26,
	unowns: 900 + 27,
	unownt: 900 + 28,
	unownu: 900 + 29,
	unownv: 900 + 30,
	unownw: 900 + 31,
	unownx: 900 + 32,
	unowny: 900 + 33,
	unownz: 900 + 34,
	castformrainy: 900 + 35,
	castformsnowy: 900 + 36,
	castformsunny: 900 + 37,
	deoxysattack: 900 + 38,
	deoxysdefense: 900 + 39,
	deoxysspeed: 900 + 40,
	burmysandy: 900 + 41,
	burmytrash: 900 + 42,
	wormadamsandy: 900 + 43,
	wormadamtrash: 900 + 44,
	cherrimsunshine: 900 + 45,
	shelloseast: 900 + 46,
	gastrodoneast: 900 + 47,
	rotomfan: 900 + 48,
	rotomfrost: 900 + 49,
	rotomheat: 900 + 50,
	rotommow: 900 + 51,
	rotomwash: 900 + 52,
	giratinaorigin: 900 + 53,
	shayminsky: 900 + 54,
	unfezantf: 900 + 55,
	basculinbluestriped: 900 + 56,
	darmanitanzen: 900 + 57,
	deerlingautumn: 900 + 58,
	deerlingsummer: 900 + 59,
	deerlingwinter: 900 + 60,
	sawsbuckautumn: 900 + 61,
	sawsbucksummer: 900 + 62,
	sawsbuckwinter: 900 + 63,
	frillishf: 900 + 64,
	jellicentf: 900 + 65,
	tornadustherian: 900 + 66,
	thundurustherian: 900 + 67,
	landorustherian: 900 + 68,
	kyuremblack: 900 + 69,
	kyuremwhite: 900 + 70,
	keldeoresolute: 900 + 71,
	meloettapirouette: 900 + 72,
	vivillonarchipelago: 900 + 73,
	vivilloncontinental: 900 + 74,
	vivillonelegant: 900 + 75,
	vivillonfancy: 900 + 76,
	vivillongarden: 900 + 77,
	vivillonhighplains: 900 + 78,
	vivillonicysnow: 900 + 79,
	vivillonjungle: 900 + 80,
	vivillonmarine: 900 + 81,
	vivillonmodern: 900 + 82,
	vivillonmonsoon: 900 + 83,
	vivillonocean: 900 + 84,
	vivillonpokeball: 900 + 85,
	vivillonpolar: 900 + 86,
	vivillonriver: 900 + 87,
	vivillonsandstorm: 900 + 88,
	vivillonsavanna: 900 + 89,
	vivillonsun: 900 + 90,
	vivillontundra: 900 + 91,
	pyroarf: 900 + 92,
	flabebeblue: 900 + 93,
	flabebeorange: 900 + 94,
	flabebewhite: 900 + 95,
	flabebeyellow: 900 + 96,
	floetteblue: 900 + 97,
	floetteeternal: 900 + 98,
	floetteorange: 900 + 99,
	floettewhite: 900 + 100,
	floetteyellow: 900 + 101,
	florgesblue: 900 + 102,
	florgesorange: 900 + 103,
	florgeswhite: 900 + 104,
	florgesyellow: 900 + 105,
	furfroudandy: 900 + 106,
	furfroudebutante: 900 + 107,
	furfroudiamond: 900 + 108,
	furfrouheart: 900 + 109,
	furfroukabuki: 900 + 110,
	furfroulareine: 900 + 111,
	furfroumatron: 900 + 112,
	furfroupharaoh: 900 + 113,
	furfroustar: 900 + 114,
	meowsticf: 900 + 115,
	aegislashblade: 900 + 116,
	hoopaunbound: 900 + 118,
	rattataalola: 900 + 119,
	raticatealola: 900 + 120,
	raichualola: 900 + 121,
	sandshrewalola: 900 + 122,
	sandslashalola: 900 + 123,
	vulpixalola: 900 + 124,
	ninetalesalola: 900 + 125,
	diglettalola: 900 + 126,
	dugtrioalola: 900 + 127,
	meowthalola: 900 + 128,
	persianalola: 900 + 129,
	geodudealola: 900 + 130,
	graveleralola: 900 + 131,
	golemalola: 900 + 132,
	grimeralola: 900 + 133,
	mukalola: 900 + 134,
	exeggutoralola: 900 + 135,
	marowakalola: 900 + 136,
	greninjaash: 900 + 137,
	zygarde10: 900 + 138,
	zygardecomplete: 900 + 139,
	oricoriopompom: 900 + 140,
	oricoriopau: 900 + 141,
	oricoriosensu: 900 + 142,
	lycanrocmidnight: 900 + 143,
	wishiwashischool: 900 + 144,
	miniormeteor: 900 + 145,
	miniororange: 900 + 146,
	minioryellow: 900 + 147,
	miniorgreen: 900 + 148,
	miniorblue: 900 + 149,
    miniorindigo: 900 + 150,
	miniorviolet: 900 + 151,
	magearnaoriginal: 900 + 152,
	pikachuoriginal: 900 + 153,
	pikachuhoenn: 900 + 154,
	pikachusinnoh: 900 + 155,
	pikachuunova: 900 + 156,
	pikachukalos: 900 + 157,
	pikachualola: 900 + 158,
	pikachupartner: 900 + 159,
	lycanrocdusk: 900 + 160,
	necrozmaduskmane: 900 + 161,
	necrozmadawnwings: 900 + 162,
	necrozmaultra: 900 + 163,
	pikachustarter: 900 + 164,
	eeveestarter: 900 + 165,
	meowthgalar: 900 + 166,
	ponytagalar: 900 + 167,
	rapidashgalar: 900 + 168,
	farfetchdgalar: 900 + 169,
	weezinggalar: 900 + 170,
	mrmimegalar: 900 + 171,
	corsolagalar: 900 + 172,
	zigzagoongalar: 900 + 173,
	linoonegalar: 900 + 174,
	darumakagalar: 900 + 175,
	darmanitangalar: 900 + 176,
	darmanitangalarzen: 900 + 177,
	yamaskgalar: 900 + 178,
	stunfiskgalar: 900 + 179,
	cramorantgulping: 900 + 180,
	cramorantgorging: 900 + 181,
	toxtricitylowkey: 900 + 182,
	//sinisteaantique: 854,
	//polteageistantique: 855,
	alcremierubycream: 900 + 183,
	alcremiematchacream: 900 + 184,
	alcremiemintcream: 900 + 185,
	alcremielemoncream: 900 + 186,
	alcremiesaltedcream: 900 + 187,
	alcremierubyswirl: 900 + 188,
	alcremiecaramelswirl: 900 + 189,
	alcremierainbowswirl: 900 + 190,
	eiscuenoice: 900 + 191,
	indeedeef: 900 + 192,
	morpekohangry: 900 + 193,
	zaciancrowned: 900 + 194,
	zamazentacrowned: 900 + 195,
	slowpokegalar: 900 + 196,

	//gumshoostotem: 735,
	//raticatealolatotem: 900 + 120,
	//marowakalolatotem: 900 + 136,
	//araquanidtotem: 752,
	//lurantistotem: 754,
	//salazzletotem: 758,
	//vikavolttotem: 738,
	//togedemarutotem: 777,
	//mimikyutotem: 778,
	//mimikyubustedtotem: 778,
	//ribombeetotem: 743,
	//kommoototem: 784,

	venusaurmega: 1104 + 0,
	charizardmegax: 1104 + 1,
	charizardmegay: 1104 + 2,
	blastoisemega: 1104 + 3,
	beedrillmega: 1104 + 4,
	pidgeotmega: 1104 + 5,
	alakazammega: 1104 + 6,
	slowbromega: 1104 + 7,
	gengarmega: 1104 + 8,
	kangaskhanmega: 1104 + 9,
	pinsirmega: 1104 + 10,
	gyaradosmega: 1104 + 11,
	aerodactylmega: 1104 + 12,
	mewtwomegax: 1104 + 13,
	mewtwomegay: 1104 + 14,
	ampharosmega: 1104 + 15,
	steelixmega: 1104 + 16,
	scizormega: 1104 + 17,
	heracrossmega: 1104 + 18,
	houndoommega: 1104 + 19,
	tyranitarmega: 1104 + 20,
	sceptilemega: 1104 + 21,
	blazikenmega: 1104 + 22,
	swampertmega: 1104 + 23,
	gardevoirmega: 1104 + 24,
	sableyemega: 1104 + 25,
	mawilemega: 1104 + 26,
	aggronmega: 1104 + 27,
	medichammega: 1104 + 28,
	manectricmega: 1104 + 29,
	sharpedomega: 1104 + 30,
	cameruptmega: 1104 + 31,
	altariamega: 1104 + 32,
	banettemega: 1104 + 33,
	absolmega: 1104 + 34,
	glaliemega: 1104 + 35,
	salamencemega: 1104 + 36,
	metagrossmega: 1104 + 37,
	latiasmega: 1104 + 38,
	latiosmega: 1104 + 39,
	kyogreprimal: 1104 + 40,
	groudonprimal: 1104 + 41,
	rayquazamega: 1104 + 42,
	lopunnymega: 1104 + 43,
	garchompmega: 1104 + 44,
	lucariomega: 1104 + 45,
	abomasnowmega: 1104 + 46,
	gallademega: 1104 + 47,
	audinomega: 1104 + 48,
	dianciemega: 1104 + 49,
	charizardgmax: 1104 + 50,
	butterfreegmax: 1104 + 51,
	pikachugmax: 1104 + 52,
	meowthgmax: 1104 + 53,
	machampgmax: 1104 + 54,
	gengargmax: 1104 + 55,
	kinglergmax: 1104 + 56,
	laprasgmax: 1104 + 57,
	eeveegmax: 1104 + 58,
	snorlaxgmax: 1104 + 59,
	garbodorgmax: 1104 + 60,
	melmetalgmax: 1104 + 61,
	corviknightgmax: 1104 + 62,
	orbeetlegmax: 1104 + 63,
	drednawgmax: 1104 + 64,
	coalossalgmax: 1104 + 65,
	flapplegmax: 1104 + 66,
	appletungmax: 1104 + 67,
	sandacondagmax: 1104 + 68,
	toxtricitygmax: 1104 + 69,
	//toxtricitylowkeygmax: 1104 + 69,
	centiskorchgmax: 1104 + 70,
	hatterenegmax: 1104 + 71,
	grimmsnarlgmax: 1104 + 72,
	alcremiegmax: 1104 + 73,
	copperajahgmax: 1104 + 74,
	duraludongmax: 1104 + 75,
	eternatuseternamax: 1104 + 76,

	syclant: 1296 + 0,
	revenankh: 1296 + 1,
	pyroak: 1296 + 2,
	fidgit: 1296 + 3,
	stratagem: 1296 + 4,
	arghonaut: 1296 + 5,
	kitsunoh: 1296 + 6,
	cyclohm: 1296 + 7,
	colossoil: 1296 + 8,
	krilowatt: 1296 + 9,
	voodoom: 1296 + 10,
	tomohawk: 1296 + 11,
	necturna: 1296 + 12,
	mollux: 1296 + 13,
	aurumoth: 1296 + 14,
	malaconda: 1296 + 15,
	cawmodore: 1296 + 16,
	volkraken: 1296 + 17,
	plasmanta: 1296 + 18,
	naviathan: 1296 + 19,
	crucibelle: 1296 + 20,
	crucibellemega: 1296 + 21,
	kerfluffle: 1296 + 22,
	pajantom: 1296 + 23,
	jumbao: 1296 + 24,
	caribolt: 1296 + 25,
	smokomodo: 1296 + 26,
	snaelstrom: 1296 + 27,
	equilibra: 1296 + 28,

	syclar: 1332 + 0,
	embirch: 1332 + 1,
	flarelm: 1332 + 2,
	breezi: 1332 + 3,
	scratchet: 1332 + 4,
	necturine: 1332 + 5,
	cupra: 1332 + 6,
	argalis: 1332 + 7,
	brattler: 1332 + 8,
	cawdet: 1332 + 9,
	volkritter: 1332 + 10,
	snugglow: 1332 + 11,
	floatoy: 1332 + 12,
	caimanoe: 1332 + 13,
	pluffle: 1332 + 14,
	rebble: 1332 + 15,
	tactite: 1332 + 16,
	privatyke: 1332 + 17,
	//nohface: 1332 + 18,
	//monohm: 1332 + 19,
	//duohm: 1332 + 20,
	// protowatt: 1332 + 21,
	voodoll: 1332 + 22,
	mumbao: 1332 + 23,
	fawnifer: 1332 + 24,
	electrelk: 1332 + 25,
	smogecko: 1332 + 26,
	smoguana: 1332 + 27,
	swirlpool: 1332 + 28,
	coribalis: 1332 + 29,
	//justyke: 1332 + 30,
};

const BattlePokemonIconIndexesLeft = {
	pikachubelle: 1188 + 0,
	pikachupopstar: 1188 + 1,
	clefairy: 1188 + 2,
	clefable: 1188 + 3,
	jigglypuff: 1188 + 4,
	wigglytuff: 1188 + 5,
	dugtrioalola: 1188 + 6,
	poliwhirl: 1188 + 7,
	poliwrath: 1188 + 8,
	mukalola: 1188 + 9,
	kingler: 1188 + 10,
	croconaw: 1188 + 11,
	cleffa: 1188 + 12,
	igglybuff: 1188 + 13,
	politoed: 1188 + 14,
	unownb: 1188 + 15,
	unownc: 1188 + 16,
	unownd: 1188 + 17,
	unowne: 1188 + 18,
	unownf: 1188 + 19,
	unowng: 1188 + 20,
	unownh: 1188 + 21,
	unownj: 1188 + 22,
	unownk: 1188 + 23,
	unownl: 1188 + 24,
	unownm: 1188 + 25,
	unownn: 1188 + 26,
	unownp: 1188 + 27,
	unownq: 1188 + 28,
	unownquestion: 1188 + 29,
	unownr: 1188 + 30,
	unowns: 1188 + 31,
	unownt: 1188 + 32,
	unownv: 1188 + 33,
	unownz: 1188 + 34,
	sneasel: 1188 + 35,
	teddiursa: 1188 + 36,
	roselia: 1188 + 37,
	zangoose: 1188 + 38,
	seviper: 1188 + 39,
	castformsnowy: 1188 + 40,
	absolmega: 1188 + 41,
	absol: 1188 + 42,
	regirock: 1188 + 43,
	torterra: 1188 + 44,
	budew: 1188 + 45,
	roserade: 1188 + 46,
	magmortar: 1188 + 47,
	togekiss: 1188 + 48,
	rotomwash: 1188 + 49,
	shayminsky: 1188 + 50,
	emboar: 1188 + 51,
	pansear: 1188 + 52,
	simisear: 1188 + 53,
	drilbur: 1188 + 54,
	excadrill: 1188 + 55,
	sawk: 1188 + 56,
	lilligant: 1188 + 57,
	garbodor: 1188 + 58,
	solosis: 1188 + 59,
	vanilluxe: 1188 + 60,
	amoonguss: 1188 + 61,
	klink: 1188 + 62,
	klang: 1188 + 63,
	klinklang: 1188 + 64,
	litwick: 1188 + 65,
	golett: 1188 + 66,
	golurk: 1188 + 67,
	kyuremblack: 1188 + 68,
	kyuremwhite: 1188 + 69,
	kyurem: 1188 + 70,
	keldeoresolute: 1188 + 71,
	meloetta: 1188 + 72,
	greninja: 1188 + 73,
	greninjaash: 1188 + 74,
	furfroudebutante: 1188 + 75,
	barbaracle: 1188 + 76,
	clauncher: 1188 + 77,
	clawitzer: 1188 + 78,
	sylveon: 1188 + 79,
	klefki: 1188 + 80,
	zygarde: 1188 + 81,
	zygarde10: 1188 + 82,
	zygardecomplete: 1188 + 83,
	dartrix: 1188 + 84,
	steenee: 1188 + 85,
	tsareena: 1188 + 86,
	comfey: 1188 + 87,
	miniormeteor: 1188 + 88,
	minior: 1188 + 89,
	miniororange: 1188 + 90,
	minioryellow: 1188 + 91,
	miniorgreen: 1188 + 92,
	miniorblue: 1188 + 93,
    miniorindigo: 1188 + 94,
	miniorviolet: 1188 + 95,
	dhelmise: 1188 + 96,
	necrozma: 1188 + 97,
	marshadow: 1188 + 98,
	pikachuoriginal: 1188 + 99,
	pikachupartner: 1188 + 100,
	necrozmaduskmane: 1188 + 101,
	necrozmadawnwings: 1188 + 102,
	necrozmaultra: 1188 + 103,
	stakataka: 1188 + 104,
	blacephalon: 1188 + 105,
};

const SEARCH = [
    "src/canonical/minisprites/gen6/pokemon",
    "src/canonical/minisprites/gen6/misc",
    "src/noncanonical/minisprites/gen6/pokemon",
    "src/cap/minisprites/gen6/pokemon",
    "src/canonical/minisprites/gen6/asymmetrical",
];

const entries = [];

for (const dir of SEARCH) {
    for (const name of fs.readdirSync(dir)) {
        let index;
        if (dir.includes("/misc")) {
            const id = toPSID(decodeComponent(path.parse(name).name));
            index = BattlePokemonIconIndexes[id];
            BattlePokemonIconIndexes[id] = 'found';
        } else if (dir.includes("/asymmetrical") || dir.includes("/pokemon")) {
            const {num, formeNum, base, forme} =
                  parsePokemonFilename(decode(path.parse(name).name));
            const id = toPSID(base + (forme === 'Female' ? "f" : forme ?? ""));
            if (dir.includes("/pokemon")) {
                index = BattlePokemonIconIndexes[id];
                BattlePokemonIconIndexes[id] = 'found';
            } else {
                index = BattlePokemonIconIndexesLeft[id];
                BattlePokemonIconIndexesLeft[id] = 'found';
            }

            if (!index) {
                index = num;
            }
        } else {
            throw new Error(`unknown minisprite dir: ${dir}`);
        }
         
        entries[index] = path.join(dir, name);
    }
}

for (const [id, num] of Object.entries(BattlePokemonIconIndexes)) {
    if (num !== 'found') {
        throw new Error(`didn't find ${id}`)
    }
}

for (const [id, num] of Object.entries(BattlePokemonIconIndexesLeft)) {
    if (num !== 'found') {
        throw new Error(`didn't find left ${id}`)
    }
}

for (let i = 0; i < entries.length; i++) {
    if (entries[i] === undefined)
        entries[i] = null;
}

export default {
    width: 40,
    height: 30,
    tile: 12,
    entries
};
